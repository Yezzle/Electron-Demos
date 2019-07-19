const { desktopCapturer, ipcRenderer} = require('electron')
const fs = require('fs');
const path = require('path');
const r = p => path.resolve(__dirname, p);

desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
    for (const source of sources) {
        if (source.name === 'Screen 1') {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        mandatory: {
                            chromeMediaSource: 'desktop'
                        }
                    },
                    video: {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            minWidth: 1280,
                            maxWidth: 1920,
                            minHeight: 720,
                            maxHeight: 1080,
                        }
                    }
                })
                handleStream(stream)
            } catch (e) {
                handleError(e)
            }
            return
        }
    }
})

let videoFilePath = r('./recorde/video2.mp4');

let chunks = [];
let mediaRecorder;
function recordStream(stream){
    
    let options = {
        audioBitsPerSecond : 128000,
        videoBitsPerSecond : 2500000,
        mimeType : 'video/webm'
      }
    mediaRecorder = new MediaRecorder(stream,options);

    mediaRecorder.start();
    mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data)
    }

    mediaRecorder.onstop = (e) => {
        let writeStream = fs.createWriteStream(videoFilePath,{flags:'a+', encoding:'hex',mode:fs.S_IXOTH , autoClose:true})
        let fileReader = new FileReader();
        fileReader.readAsDataURL(chunks[0])
        fileReader.onloadend = () => {
            let base64data = fileReader.result;
            console.log(base64data);
            const buf = Buffer.from( base64data.replace('data:video/webm;base64,',''), 'base64');
            fs.writeFileSync(videoFilePath, buf);
            chunks = [];
        }
    }
}

//"ascii" | "utf8" | "utf16le" | "ucs2" | "base64" | "latin1" | "binary" | "hex";
function handleStream(stream) {
    const video = document.getElementById('video')
    video.srcObject = stream;
    video.onloadedmetadata = (e) => video.play()
    recordStream(stream);
}

function handleError(e) {
    console.log(e)
}
let a = 0;
document.getElementById('devButton').onclick = (e) => {
    mediaRecorder.stop();
    console.log('clicked')
}

// document.getElementById('btn-a').addEventListener('click',function(e){
//     navigator.getUserMedia({audio: true}, ()=>{
//         console.log('success')
//     },()=>{
//         console.log('faile');
//     })
// })
// let media_video = document.getElementById('media-v');
// document.getElementById('btn-v').addEventListener('click',function(e){
//     navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: {
//           width: { min: 320, ideal: 1280, max: 1920 },
//           height: { min: 340, ideal: 720, max: 1080 }
//         }
//       }).then((stream)=>{
//         media_video.srcObject = stream
//         console.log('success')
//     }).catch(()=>{
//         console.log('faile');
//     })
// })

// window.onbeforeunload = (e) => { 
//     // e.returnValue = window.confirm('确认关闭？') ? undefined : false;
//     return 'undefined'
// }

