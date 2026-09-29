/*
  FitAI backend
  ----------------
  This server receives the two uploaded images and calls a virtual try-on model.

  The model endpoint is deliberately isolated in createTryOn().
  Set REPLICATE_API_TOKEN in .env and choose a current virtual try-on model
  available in your Replicate account.

  IMPORTANT: Never put your API token in app.js or index.html.
*/

require("dotenv").config();
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: path.join(__dirname, "uploads") });

app.use(express.static(__dirname));

app.post("/api/try-on", upload.fields([
  { name: "person", maxCount: 1 },
  { name: "clothes", maxCount: 1 }
]), async (req, res) => {
  const person = req.files?.person?.[0];
  const clothes = req.files?.clothes?.[0];

  if (!person || !clothes) {
    return res.status(400).json({ error: "Upload både et billede af dig selv og et billede af tøjet." });
  }

  try {
    const image = await createTryOn(person.path, clothes.path);
    res.json({ image });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Kunne ikke lave try-on-billedet." });
  } finally {
    for (const file of [person.path, clothes.path]) {
      fs.unlink(file, () => {});
    }
  }
});

async function createTryOn(personPath, clothesPath) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error("REPLICATE_API_TOKEN mangler i .env-filen.");
  }

  /*
    Plug your selected virtual try-on model into this function.
    A common production setup is:
      1. Upload person image and clothing image to a private image host/storage.
      2. Create a prediction with the selected VTON model.
      3. Poll until the prediction is complete.
      4. Return the model's output image URL.

    The exact input names differ between models, so keep this adapter
    separate instead of hard-coding a possibly outdated model schema.
  */

  throw new Error(
    "AI-modellen er ikke valgt endnu. Åbn README.md og vælg en aktuel virtual try-on-model."
  );
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`FitAI kører på http://localhost:${PORT}`));
