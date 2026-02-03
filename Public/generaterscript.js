document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const progress = document.querySelector(".progress");
  const progressBar = document.querySelector(".progress-bar");
  const editor = document.getElementById("editor");
  const previewCanvas = document.getElementById("previewCanvas");
  const ctx = previewCanvas.getContext("2d");
  const imagePlaceholder = document.getElementById("image-placeholder");
  const filterInputs = document.querySelectorAll("#filterControls input");
  const resetFiltersBtn = document.getElementById("resetFilters");
  const downloadBtn = document.getElementById("downloadBtn");
  const filenameInput = document.getElementById("filename");
  const formatSelect = document.getElementById("format");
  const qualityGroup = document.getElementById("qualityGroup");
  const qualitySlider = document.getElementById("quality");
  const langBtn = document.getElementById("langToggle");

  let isHindi = false;
  let originalImage = null;

  const baseCanvas = document.createElement("canvas");
  const baseCtx = baseCanvas.getContext("2d");

  const defaults = {
    grayscale: 0,
    sepia: 0,
    contrast: 100,
    brightness: 100,
    blur: 0,
    invert: 0,
  };

  let current = { ...defaults };

  function simulateProgress() {
    progress.style.display = "block";
    progressBar.style.width = "0%";
    let w = 0;
    return new Promise((r) => {
      const i = setInterval(() => {
        w += Math.random() * 20;
        progressBar.style.width = Math.min(w, 100) + "%";
        if (w >= 100) {
          clearInterval(i);
          progress.style.display = "none";
          r();
        }
      }, 80);
    });
  }

  generateBtn.onclick = async () => {
    generateBtn.disabled = true;
    generateBtn.innerText = isHindi ? "इमेज बन रही है..." : "Generating...";
    await simulateProgress();

    const seed = Math.floor(Math.random() * 99999);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `https://picsum.photos/seed/${seed}/1200/800`;

    img.onload = () => {
      baseCanvas.width = previewCanvas.width = img.width;
      baseCanvas.height = previewCanvas.height = img.height;
      baseCtx.drawImage(img, 0, 0);
      originalImage = img;

      editor.classList.remove("hidden");
      imagePlaceholder.style.display = "none";
      previewCanvas.style.display = "block";

      resetFilters();
      generateBtn.disabled = false;
      generateBtn.innerText = isHindi ? "नई इमेज बनाएं" : "✨ Generate New Image";
    };
  };

  function applyFilters() {
    if (!originalImage) return;
    let f = "";
    for (const k in current) {
      if (current[k] !== defaults[k]) {
        f += `${k}(${current[k]}${document.getElementById(k).dataset.unit}) `;
      }
    }
    ctx.filter = f;
    ctx.drawImage(baseCanvas, 0, 0);
  }

  filterInputs.forEach((i) =>
    i.addEventListener("input", (e) => {
      current[e.target.id] = e.target.value;
      applyFilters();
    })
  );

  function resetFilters() {
    current = { ...defaults };
    filterInputs.forEach((i) => (i.value = defaults[i.id]));
    applyFilters();
  }

  resetFiltersBtn.onclick = resetFilters;

  formatSelect.onchange = () => {
    qualityGroup.style.display =
      formatSelect.value === "image/jpeg" ? "block" : "none";
  };

  downloadBtn.onclick = () => {
    previewCanvas.toBlob((b) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = `${filenameInput.value}.${formatSelect.value.split("/")[1]}`;
      a.click();
    }, formatSelect.value, qualitySlider.value);
  };

  langBtn.onclick = () => {
    isHindi = !isHindi;
    langBtn.innerText = isHindi ? "English" : "हिन्दी";

    document.getElementById("genTitle").innerText =
      isHindi ? "📸 इमेज जनरेटर और एडिटर" : "📸 Image Generator & Editor";

    document.getElementById("genDesc").innerText =
      isHindi
        ? "बटन दबाएं → स्लाइडर बदलें → इमेज डाउनलोड करें"
        : "Click the button → adjust sliders → download image";

    imagePlaceholder.innerText =
      isHindi ? "शुरू करने के लिए इमेज बनाएं" : "Generate an image to begin editing.";

    generateBtn.innerText =
      isHindi ? "नई इमेज बनाएं" : "✨ Generate New Image";
  };
});
document.addEventListener("DOMContentLoaded", () => {

  const $ = (id) => document.getElementById(id);

  let isHindi = false;

  const texts = {
    en: {
      title: "📸 Image Generator",
      desc: "Click the button → move sliders → download image",
      helper: "Works on slow internet • No login needed",
      generate: "✨ Generate New Image",
      controls: "Controls",
      effects: "Image Effects",
      bw: "Black & White",
      sepia: "Sepia",
      contrast: "Contrast",
      brightness: "Brightness",
      blur: "Blur",
      invert: "Invert",
      reset: "Reset",
      download: "Download",
      downloadBtn: "Download Image",
      placeholder: "Generate an image to begin editing."
    },
    hi: {
      title: "📸 इमेज जनरेटर",
      desc: "बटन दबाएं → स्लाइडर बदलें → इमेज डाउनलोड करें",
      helper: "धीमे इंटरनेट पर भी काम करता है • लॉगिन की ज़रूरत नहीं",
      generate: "✨ नई इमेज बनाएं",
      controls: "नियंत्रण",
      effects: "इमेज इफ़ेक्ट",
      bw: "ब्लैक एंड व्हाइट",
      sepia: "सेपिया",
      contrast: "कॉन्ट्रास्ट",
      brightness: "चमक",
      blur: "ब्लर",
      invert: "रंग उल्टा",
      reset: "रीसेट",
      download: "डाउनलोड",
      downloadBtn: "इमेज डाउनलोड करें",
      placeholder: "शुरू करने के लिए इमेज बनाएं"
    }
  };

  function applyLang() {
    const t = isHindi ? texts.hi : texts.en;

    $("genTitle").innerText = t.title;
    $("genDesc").innerText = t.desc;
    $("helperText").innerText = t.helper;
    $("generateBtn").innerText = t.generate;
    $("controlsTitle").innerText = t.controls;
    $("effectsTitle").innerText = t.effects;
    $("lblBW").innerText = t.bw;
    $("lblSepia").innerText = t.sepia;
    $("lblContrast").innerText = t.contrast;
    $("lblBrightness").innerText = t.brightness;
    $("lblBlur").innerText = t.blur;
    $("lblInvert").innerText = t.invert;
    $("resetFilters").innerText = t.reset;
    $("downloadTitle").innerText = t.download;
    $("downloadBtn").innerText = t.downloadBtn;
    $("image-placeholder").innerText = t.placeholder;
    $("langToggle").innerText = isHindi ? "English" : "हिन्दी";
  }

  $("langToggle").onclick = () => {
    isHindi = !isHindi;
    applyLang();
  };

  applyLang(); // default
});
