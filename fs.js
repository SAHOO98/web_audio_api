let actx;
let source;
let gainNode;
let div1,div2;
let osc;
function change(val){
  div1.innerHTML = "Track gain:"+val;
  gainNode.gain.value = val;
}
function osc_control(val) {
    div2.innerHTML = "Oscillator frequency :"+val;
    osc.frequency.value = val;
}
function init(){
  try{
    actx = new AudioContext();
  }catch(e){
    console.log('Error '+e);
  }

  div1 = document.querySelector('.out');
  div2 = document.querySelector('.osc_freq');
  source = load_buffer('src2.mp3');
  gainNode = actx.createGain();
  gainNode.gain.value = document.querySelector('input[type="range"]').value;

  osc = actx.createOscillator();
  osc.type = "sine";
  osc.frequency.value =document.querySelector('#freq_control').value ;

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
  osc.connect(actx.destination);
  osc.start();
  source.start(0);
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
