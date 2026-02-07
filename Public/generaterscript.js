const generateBtn=document.getElementById("generateBtn");
const progress=document.querySelector(".progress");
const bar=document.querySelector(".progress-bar");
const editor=document.getElementById("editor");
const canvas=document.getElementById("previewCanvas");
const ctx=canvas.getContext("2d");
const placeholder=document.getElementById("image-placeholder");
const history=document.getElementById("history");

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
w+=12;
bar.style.width=w+"%";
if(w>=100){clearInterval(i);progress.style.display="none";r();}
},70);
});
}

generateBtn.onclick=async()=>{
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
saveHistory();
};
};

function apply(){
ctx.clearRect(0,0,canvas.width,canvas.height);
let f="";
for(let k in current){
f+=`${k}(${current[k]}${document.getElementById(k).dataset.unit}) `;
}
ctx.filter=f;
ctx.drawImage(baseCanvas,0,0);
}

inputs.forEach(i=>{
const v=document.getElementById(i.id+"Val");
i.oninput=e=>{
current[e.target.id]=e.target.value;
if(v) v.innerText=e.target.value;
apply();
};
});

function resetFilters(){
current={...defaults};
inputs.forEach(i=>{
i.value=defaults[i.id];
document.getElementById(i.id+"Val").innerText=i.value;
});
apply();
}
resetBtn.onclick=resetFilters;

document.querySelectorAll(".presets button").forEach(btn=>{
btn.onclick=()=>{
const p=btn.dataset.preset;
if(p==="vintage") current={grayscale:10,sepia:60,contrast:120,brightness:110,blur:0,invert:0};
if(p==="cinematic") current={grayscale:0,sepia:20,contrast:140,brightness:90,blur:0,invert:0};
if(p==="bwpro") current={grayscale:100,sepia:0,contrast:160,brightness:100,blur:0,invert:0};
inputs.forEach(i=>{
i.value=current[i.id];
document.getElementById(i.id+"Val").innerText=i.value;
});
apply();
};
});

downloadBtn.onclick=()=>{
canvas.toBlob(b=>{
const a=document.createElement("a");
a.href=URL.createObjectURL(b);
a.download="image.png";
a.click();
},"image/png");
};

function saveHistory(){
const im=document.createElement("img");
im.src=canvas.toDataURL();
im.onclick=()=>loadFromHistory(im.src);
history.prepend(im);
}

function loadFromHistory(src){
const h=new Image();
h.onload=()=>{
baseCanvas.width=canvas.width=h.width;
baseCanvas.height=canvas.height=h.height;
baseCtx.drawImage(h,0,0);
apply();
};
h.src=src;
}
