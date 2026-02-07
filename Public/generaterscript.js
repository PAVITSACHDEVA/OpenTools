document.addEventListener("DOMContentLoaded",()=>{

/* LOADER */
let width=0;
const fill=document.getElementById("loaderFill");
const loading=document.getElementById("loading");

const loader=setInterval(()=>{
  width+=2;
  fill.style.width=width+"%";
  if(width>=100){
    clearInterval(loader);
    loading.style.display="none";
  }
},40);

/* GENERATOR */

const generateBtn=document.getElementById("generateBtn");
const progress=document.querySelector(".progress");
const bar=document.querySelector(".progress-bar");
const editor=document.getElementById("editor");
const canvas=document.getElementById("previewCanvas");
const ctx=canvas.getContext("2d");
const placeholder=document.getElementById("image-placeholder");

const inputs=document.querySelectorAll("input[type=range]");
const resetBtn=document.getElementById("resetFilters");
const downloadBtn=document.getElementById("downloadBtn");

let baseCanvas=document.createElement("canvas");
let baseCtx=baseCanvas.getContext("2d");
let img=null;

const defaults={
grayscale:0,sepia:0,contrast:100,brightness:100,blur:0,invert:0
};

let current={...defaults};

function simulate(){
progress.style.display="block";
bar.style.width="0%";
let w=0;
return new Promise(r=>{
const i=setInterval(()=>{
w+=10;
bar.style.width=w+"%";
if(w>=100){clearInterval(i);progress.style.display="none";r();}
},80);
});
}

generateBtn.onclick=async()=>{
generateBtn.disabled=true;
await simulate();

const seed=Math.floor(Math.random()*99999);
img=new Image();
img.crossOrigin="anonymous";
img.src=`https://picsum.photos/seed/${seed}/1200/800`;

img.onload=()=>{
baseCanvas.width=canvas.width=img.width;
baseCanvas.height=canvas.height=img.height;
baseCtx.drawImage(img,0,0);

editor.classList.remove("hidden");
placeholder.style.display="none";
canvas.style.display="block";

resetFilters();
generateBtn.disabled=false;
};
};

function apply(){
if(!img) return;
let f="";
for(let k in current){
if(current[k]!=defaults[k]){
f+=`${k}(${current[k]}${document.getElementById(k).dataset.unit}) `;
}}
ctx.filter=f;
ctx.drawImage(baseCanvas,0,0);
}

inputs.forEach(i=>{
i.oninput=e=>{
current[e.target.id]=e.target.value;
apply();
};
});

function resetFilters(){
current={...defaults};
inputs.forEach(i=>i.value=defaults[i.id]);
apply();
}
resetBtn.onclick=resetFilters;

downloadBtn.onclick=()=>{
canvas.toBlob(b=>{
const a=document.createElement("a");
a.href=URL.createObjectURL(b);
a.download="image.png";
a.click();
},"image/png");
};

/* LANGUAGE TOGGLE */

let isHindi=false;
document.getElementById("langToggle").onclick=()=>{
isHindi=!isHindi;
document.getElementById("genTitle").innerText=isHindi?"📸 इमेज जनरेटर":"📸 Image Generator";
document.getElementById("genDesc").innerText=isHindi?
"बटन दबाएं → स्लाइडर बदलें → इमेज डाउनलोड करें":
"Click the button → adjust sliders → download image";
};

});
