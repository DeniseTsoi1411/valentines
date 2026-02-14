import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { nanoid } from "nanoid";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo connected"))
  .catch(err => console.error(err));

// Schema
const LetterSchema = new mongoose.Schema({
  id: String,
  letter: String,
  recipient: String,
  stickers: Array
});

const Letter = mongoose.model("Letter", LetterSchema);

// Create letter
app.post("/letters", async (req, res) => {
  const id = nanoid(6);

  const newLetter = new Letter({
    id,
    letter: req.body.letter,
    recipient: req.body.recipient,
    stickers: req.body.stickers
  });

  await newLetter.save();

  res.json({ id });
});

// Get letter
app.get("/letters/:id", async (req, res) => {
  const letter = await Letter.findOne({ id: req.params.id });

  if (!letter) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json(letter);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
