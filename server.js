const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.port || 3001;
app.use(cors());

/*  1. Pick a random word from array of words

    2. Save word as current word

    3. Using fetch requests from frontend, send user's guess
       to backend

    4. Backend returns a JSON in the following format:
        {
            correctGuess: true,
            currentWord: ['a','p','p','_','e']
        }
        -Where correctGuess is a bool that is true if the letter the player guessed is 
        in the word, and currentWord is an array of strings. currentWord has one string per 
        character. If the character has been guessed, it appears in the word, if it hasn't, 
        a string containing a single underscore is in its place.
        -The endpoint that takes in this "guess" only takes in a single parameter 
        which would be the guessed letter. You'll need to store the current state of 
        the word on the backend. 
    
    Ex: // The word is "apple" and the player(s) has made no guesses

// the user guesses "c"
{
  correctGuess: false,
  currentWord: ['_','_','_','_','_']
} 

// the user guesses "a"
{
  correctGuess: true,
  currentWord: ['a','_','_','_','_']
} 
*/
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
];

//This is the random word from the array that is to be guessed
let activeWord = "";

//How far you have guessed
let currentWord = [];

function reInitialize() {
  activeWord = wordBank[Math.floor(Math.random() * wordBank.length)];
  activeWord = activeWord.split("");
  currentWord = activeWord.map(() => "_");
}

app.post("/play/:guess", (req, res) => {
  let correctGuess = req.params.guess;
  let guessIndexes = [];
  for (let i = 0; i < activeWord.length; i++) {
    if (activeWord[i] === correctGuess) {
      guessIndexes.push(i);
      currentWord[i] = correctGuess;
    }
  }
  console.log(currentWord);
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

app.listen(port, () => {
  reInitialize();
  console.log(currentWord);
  console.log(`Example app listening at http://localhost:${port}`);
  console.log("The active word is " + activeWord);
});
