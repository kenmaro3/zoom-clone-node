
const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
});



let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    }) 
    
    socket.on('createMessage', message => {
        console.log("test")
        console.log("this is coming from server >>>", message);
        $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`)
        scrollToBottom();
    })    

})

peer.on('open', id => {
    console.log(id)
    socket.emit('join-room', ROOM_ID, id);
})
socket.emit('join-room', ROOM_ID);



const connectToNewUser = (userId, stream) => {
    console.log('new user >>>', userId);
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    })

}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })

    videoGrid.append(video);
}


let text = $('input');

$('html').keydown((e) => {

    if(e.which == 13 && text.val().length !== 0){
        console.log(text.val());

        socket.emit('message', text.val());
        
        text.val('');
        
    }
    

})



const scrollToBottom = () => {
    let d = $('.main__rightChatWindow');
    d.scrollTop(d.prop("scrollHeight"));
}


const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}


const setMuteButton = () => {
    const html = `
     <i class="mute fas fa-microphone"></i>
     <span>mute</span>

    `

    document.querySelector('.main__muteButton').innerHTML = html;
}


const setUnmuteButton = () => {
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `

    document.querySelector('.main__muteButton').innerHTML = html;
}


const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    }else{
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setStopVideo = () => {
    const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
    `

    document.querySelector('.main__videoButton').innerHTML = html;
}

const setPlayVideo = () => {
    const html = `
    <i class="playVideo fas fa-video-slash"></i>
    <span>Play Video</span>
    `

    document.querySelector('.main__videoButton').innerHTML = html;
}