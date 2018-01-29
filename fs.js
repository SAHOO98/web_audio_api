let actx;
let source;
let gainNode;
let div
function change(val){
  div.innerHTML = val;
  gainNode.gain.value = val;
}

function init(){
  try{
    actx = new AudioContext();
  }catch(e){
    console.log('Error '+e);
  }

  div = document.querySelector('.out');
  source = load_buffer('src3.mp3');
  gainNode = actx.createGain();
  gainNode.gain.value = document.querySelector('input[type="range"]').value;

}

function load_song(url){
  let promise = new Promise((resolve,reject)=>{
    let request = new XMLHttpRequest();
    request.open('GET',url,true);
    request.responseType = 'arraybuffer';
    request.onload = ()=>{
      let audioData = request.response;
            resolve(audioData);
          }
    request.onerror = ()=>{
      reject(new error("Could not load the song:- "+url));
    }

request.send();
  });
  return promise;
}

function load_buffer(url){
  let temp  = actx.createBufferSource();
  load_song(url).then(audioData => {
    actx.decodeAudioData(audioData).then(buffer => {
      temp.buffer = buffer;
    }).catch(err => {
      console.error(err);
    });
  }).catch(err => {
    console.log(err);
  });
  return temp;
}

function play(){
  source.connect(gainNode);
  gainNode.connect(actx.destination);
  source.start();
}

function pause(){
  if(actx.state === 'running'){
  actx.suspend()
  }
  else if(actx.state === 'suspended'){
    actx.resume();
  }
}

function stop(){
  source.stop();
}
