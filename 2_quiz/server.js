const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const database_url = process.env.DATABASE_URL;

mongoose
  .connect(database_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(3000, () => {
      console.log(`Server started at ${3000}`);
    });
  });

const database = mongoose.connection;

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Succesfully connected to the database!");
});

const questionRoute = require("./routes/questionRoute");
app.use("/api/question", questionRoute);
