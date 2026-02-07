const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");
const generateBtn = document.getElementById("generate");
const resetBtn = document.getElementById("reset");
const downloadBtn = document.getElementById("downloadBtn");
const format = document.getElementById("format");
const quality = document.getElementById("quality");
const progress = document.getElementById("progress");
const sliderBox = document.querySelector(".sliders");

const filters = {
brightness:100,
contrast:100,
grayscale:0,
sepia:0,
saturate:100,
hue:0,
blur:0,
invert:0
};

let img = new Image();

const defs = [
["brightness",0,200],
["contrast",0,200],
["grayscale",0,100],
["sepia",0,100],
["saturate",0,200],
["hue",-180,180],
["blur",0,10],
["invert",0,100],
];

defs.forEach(([name,min,max])=>{
const l=document.createElement("label");
l.innerHTML=`${name}<span id="${name}Val">${filters[name]}</span>`;
const s=document.createElement("input");
s.type="range"; s.min=min; s.max=max; s.value=filters[name];
s.oninput=e=>{
filters[name]=e.target.value;
document.getElementById(name+"Val").innerText=e.target.value;
applyFilters();
};
sliderBox.append(l,s);
});

function applyFilters(){
ctx.filter=`
brightness(${filters.brightness}%)
contrast(${filters.contrast}%)
grayscale(${filters.grayscale}%)
sepia(${filters.sepia}%)
saturate(${filters.saturate}%)
hue-rotate(${filters.hue}deg)
blur(${filters.blur}px)
invert(${filters.invert}%)
`;
ctx.drawImage(img,0,0,canvas.width,canvas.height);
}

function loadImage(src){
img.onload=()=>{
canvas.width=img.width;
canvas.height=img.height;
applyFilters();
};
img.src=src;
}

generateBtn.onclick=()=>{
progress.style.display="block";
setTimeout(()=>{
progress.style.display="none";
loadImage(`https://picsum.photos/seed/${Math.random()*9999}/1200/800`);
},800);
};

upload.onchange=e=>{
const r=new FileReader();
r.onload=()=>loadImage(r.result);
r.readAsDataURL(e.target.files[0]);
};

resetBtn.onclick=()=>{
Object.keys(filters).forEach(k=>{
filters[k]=k==="saturate"?100:100;
});
applyFilters();
};

downloadBtn.onclick=()=>{
canvas.toBlob(blob=>{
const a=document.createElement("a");
a.href=URL.createObjectURL(blob);
a.download="image";
a.click();
},format.value,parseFloat(quality.value));
};

/* KEYBOARD SHORTCUTS */

document.addEventListener("keydown",e=>{
if(e.key==="g") generateBtn.click();
if(e.key==="r") resetBtn.click();
if(e.key==="o") upload.click();
});
