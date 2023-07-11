const express = require("express");

const Question = require("../models/questions");

const router = express.Router();

router.get("/getAllQuestions", async (req, res) => {
  try {
    const data = await Question.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getQuestionById/:id", async (req, res) => {
  try {
    const data = await Question.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/addManyQuestions", async (req, res) => {
  try {
    const data = await Question.insertMany(req.body);
    res.status(200).json({ message: "successfully added to the database" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/get20Questions", async (req, res) => {
  try {
    const data = Question.aggregate([{ $sample: { size: 20 } }]);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
