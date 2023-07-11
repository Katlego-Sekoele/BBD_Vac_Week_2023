const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  Question: { type: String, required: true },
  Answers: [{ type: String, required: true }],
  Correct_Answer_Index: { type: Number, required: true },
  Used: { type: Boolean, default: false },
});

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;
