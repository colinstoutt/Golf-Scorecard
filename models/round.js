const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roundSchema = Schema({
  course: { type: String, required: true },
  date: { type: Date, required: true },
  handicap: { type: Number, default: 0, required: true },
  par: [Number],
  score: [Number],
});

const Round = mongoose.model("Round", roundSchema);

module.exports = Round;
