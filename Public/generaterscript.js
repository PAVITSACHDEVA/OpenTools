document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // DOM ELEMENTS
  // ===============================
  const generateBtn = document.getElementById("generateBtn");
  const progress = document.querySelector(".progress");
  const progressBar = document.querySelector(".progress-bar");

  const editor = document.getElementById("editor");
  const previewCanvas = document.getElementById("previewCanvas");
  const ctx = previewCanvas.getContext("2d");

  const imagePlaceholder = document.getElementById("image-placeholder");
  const filterInputs = document.querySelectorAll(
    "#filterControls input[type='range']"
  );

  const resetFiltersBtn = document.getElementById("resetFilters");
  const downloadBtn = document.getElementById("downloadBtn");

  const filenameInput = document.getElementById("filename");
  const formatSelect = document.getElementById("format");
  const qualityGroup = document.getElementById("qualityGroup");
  const qualitySlider = document.getElementById("quality");

  // ===============================
  // STATE
  // ===============================
  let originalImage = null;

  const originalCanvas = document.createElement("canvas");
  const originalCtx = originalCanvas.getContext("2d");

  const defaultFilters = {
    grayscale: 0,
    sepia: 0,
    contrast: 100,
    brightness: 100,
    blur: 0,
    invert: 0,
  };

  let currentFilters = { ...defaultFilters };

  // ===============================
  // PROGRESS BAR (FAKE BUT SMOOTH)
  // ===============================
  function simulateProgress() {
    progress.style.display = "block";
    progressBar.style.width = "0%";

    let width = 0;
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        width += Math.random() * 15;
        progressBar.style.width = Math.min(width, 100) + "%";

        if (width >= 100) {
          clearInterval(interval);
          progress.style.display = "none";
          resolve();
        }
      }, 100);
    });
  }

  // ===============================
  // GENERATE IMAGE
  // ===============================
  generateBtn.addEventListener("click", async () => {
    generateBtn.disabled = true;
    generateBtn.textContent = "Generating...";

    await simulateProgress();

    const seed = Math.floor(Math.random() * 10000);
    const imageUrl = `https://picsum.photos/seed/${seed}/1200/800`;

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        originalCanvas.width = previewCanvas.width = img.width;
        originalCanvas.height = previewCanvas.height = img.height;

        originalCtx.clearRect(0, 0, img.width, img.height);
        originalCtx.drawImage(img, 0, 0);

        originalImage = img;

        editor.classList.remove("hidden");
        imagePlaceholder.style.display = "none";
        previewCanvas.style.display = "block";

        resetFilters();
      };

      img.onerror = () => {
        alert("Failed to load image. Please try again.");
      };

      img.src = imageUrl;
    } catch (err) {
      console.error(err);
      alert("Something went wrong while generating the image.");
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = "✨ Generate New Image";
    }
  });

  // ===============================
  // FILTER LOGIC
  // ===============================
  function applyFilters() {
    if (!originalImage) return;

    let filterString = "";

    for (const [key, value] of Object.entries(currentFilters)) {
      const input = document.getElementById(key);
      const unit = input.dataset.unit;

      if (value !== defaultFilters[key]) {
        filterString += `${key}(${value}${unit}) `;
      }
    }

    ctx.filter = filterString.trim();
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    ctx.drawImage(originalCanvas, 0, 0);
  }

  filterInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      currentFilters[e.target.id] = e.target.value;
      applyFilters();
    });
  });

  function resetFilters() {
    currentFilters = { ...defaultFilters };
    filterInputs.forEach((input) => {
      input.value = defaultFilters[input.id];
    });
    applyFilters();
  }

  resetFiltersBtn.addEventListener("click", resetFilters);

  // ===============================
  // DOWNLOAD LOGIC
  // ===============================
  formatSelect.addEventListener("change", () => {
    qualityGroup.style.display =
      formatSelect.value === "image/jpeg" ? "block" : "none";
  });

  downloadBtn.addEventListener("click", () => {
    if (!originalImage) return;

    const format = formatSelect.value;
    const quality = parseFloat(qualitySlider.value);
    const extension = format.split("/")[1];
    const filename = `${filenameInput.value}.${extension}`;

    previewCanvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      format,
      quality
    );
  });
});
