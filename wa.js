//"use strict";
var sources = new Array();
var actx;
var songs = ['src1.mp3','src2.mp3'];
let div = document.querySelector('.out')
let range = document.querySelector('.range')
function change(){
 div.innerHTML = range.value;
 console.log(range);
 console.log(div);
}
async function start(){
  console.log("WELCOME!!");
  range = document.getElementsByClassName('range');
  try{
      actx = new AudioContext();
  }catch(e){
    console.log('WebAudio api is not supported!!');

  }

    await getBuffers(actx,songs);
    console.log(sources);
    console.log(sources.length);
    sources[0].connect(actx.destination);
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
//creats buffers
async function getBuffers(actx,songs){
    for (let x of songs){
      let temp = actx.createBufferSource();
      try{
      let audioData = await load_song(x)
      let decodedAudioData = await actx.decodeAudioData(audioData);
      temp.buffer = decodedAudioData;
      sources.push(temp);
    }catch(err){
      console.error(err);
    }
}
//console.log(buffers.length);
}
function play() {

  sources[0].start(0);
//  sources[1].start(0);
}
function stop(){
  sources[0].stop(0);
  //sources[1].stop(0);
}