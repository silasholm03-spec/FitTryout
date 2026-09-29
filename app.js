const personInput = document.getElementById("personInput");
const clothesInput = document.getElementById("clothesInput");
const personDrop = document.getElementById("personDrop");
const clothesDrop = document.getElementById("clothesDrop");
const personPreview = document.getElementById("personPreview");
const clothesPreview = document.getElementById("clothesPreview");
const tryButton = document.getElementById("tryButton");
const loading = document.getElementById("loading");
const resultSection = document.getElementById("resultSection");
const resultImage = document.getElementById("resultImage");
const resultError = document.getElementById("resultError");
const againButton = document.getElementById("againButton");

let personFile = null;
let clothesFile = null;

function handleFile(input, type) {
  const file = input.files?.[0];
  if (!file || !file.type.startsWith("image/")) return;

  if (type === "person") {
    personFile = file;
    personPreview.src = URL.createObjectURL(file);
    personDrop.classList.add("has-image");
  } else {
    clothesFile = file;
    clothesPreview.src = URL.createObjectURL(file);
    clothesDrop.classList.add("has-image");
  }
  tryButton.disabled = !(personFile && clothesFile);
}

personInput.addEventListener("change", () => handleFile(personInput, "person"));
clothesInput.addEventListener("change", () => handleFile(clothesInput, "clothes"));

function setupDrop(drop, input, type) {
  ["dragenter","dragover"].forEach(evt => drop.addEventListener(evt, e => {
    e.preventDefault(); drop.style.borderColor = "#8b5cf6";
  }));
  ["dragleave","drop"].forEach(evt => drop.addEventListener(evt, e => {
    e.preventDefault(); drop.style.borderColor = "";
  }));
  drop.addEventListener("drop", e => {
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const dt = new DataTransfer(); dt.items.add(file); input.files = dt.files;
    handleFile(input, type);
  });
}
setupDrop(personDrop, personInput, "person");
setupDrop(clothesDrop, clothesInput, "clothes");

tryButton.addEventListener("click", async () => {
  if (!personFile || !clothesFile) return;

  tryButton.disabled = true;
  loading.classList.remove("hidden");
  resultSection.classList.add("hidden");
  resultError.classList.add("hidden");

  const form = new FormData();
  form.append("person", personFile);
  form.append("clothes", clothesFile);

  const response = await fetch("/api/try-on", { method: "POST", body: form });
  const data = await response.json();

  loading.classList.add("hidden");

  if (!response.ok || !data.image) {
    throw new Error(data.error || "AI-genereringen fejlede.");
  }

  resultImage.src = data.image;
  resultSection.classList.remove("hidden");
  resultSection.scrollIntoView({ behavior: "smooth" });
} catch (err) {
  loading.classList.add("hidden");
  resultSection.classList.remove("hidden");
  resultError.textContent = err.message;
  resultError.classList.remove("hidden");
} finally {
  tryButton.disabled = !(personFile && clothesFile);
});

againButton.addEventListener("click", () => {
  resultSection.classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
