const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.port || 3001;
app.use(cors());
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

const wordBank = [
  "affix",
  "avenue",
  "awkward",
  "beekeeper",
  "boggle",
  "jazz",
  "juggle",
  "red",
  "blue",
  "green",
  "deez",
];

//This is the random word from the array that is to be guessed
let activeWord = "";

//How far you have guessed
let currentWord = [];

//Stores list of guessed indexes
let guessIndexes = [];

function reInitialize() {
  activeWord = wordBank[Math.floor(Math.random() * wordBank.length)];
  activeWord = activeWord.split("");
  currentWord = activeWord.map(() => "_");
}

//Send the guess
app.post("/play/:playerId/:guess", (req, res) => {
  let correctGuess = req.params.guess;
  guessIndexes = [];
  for (let i = 0; i < activeWord.length; i++) {
    if (activeWord[i] === correctGuess) {
      guessIndexes.push(i);
      currentWord[i] = correctGuess;
    }
  }
  console.log(req.params.playerId);
  io.emit("new-guess", "NEW_GUESS");
  res.json({
    success: true,
  });
});

//Retrieve current word status
app.get("/play", (req, res) => {
  if (currentWord.join("") == activeWord.join("")) {
    res.json({
      correctGuess: guessIndexes.length ? true : false,
      currentWord,
      success: true,
    });
    reInitialize();
  } else {
    res.json({
      correctGuess: guessIndexes.length ? true : false,
      currentWord,
      success: false,
    });
  }
});

let connectedUsers = [];

io.on("connection", function (socket) {
  connectedUsers.push(socket.id);
  // io.emit().broadcast
  socket.on("new-guess", function (data) {
    console.log(data);
    io.emit("new-guess", data);
  });
  console.log(socket.id);
});

http.listen(port, () => {
  reInitialize();
  console.log(currentWord);
  console.log(`Example app listening at http://localhost:${port}`);
  console.log("The active word is " + activeWord);
});
