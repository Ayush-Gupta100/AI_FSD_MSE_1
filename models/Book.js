const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({

  title: { type: String, required: true },

  author: { type: String, required: true },

  isbn: { type: String, required: true, unique: true },

  genre: { type: String, required: true },

  publisher: { type: String, required: true },

  publicationYear: Number,

  totalCopies: { type: Number, required: true, min: 1 },

  availableCopies: { type: Number, min: 0 },

  shelfLocation: String,

  bookType: { type: String, enum: ["Reference", "Circulating"] },

  status: { type: String, default: "Available" }

});

module.exports = mongoose.model("Book", bookSchema);