let dictionary = [];
const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
app.use(cors());

const path = require("path");
const filePath = "./sanakirja.txt";

// Funktio lukemaan tiedoston sisältö
function readWordsFromFile() {
  try {
    if (!fs.existsSync(filePath)) {
      console.error("File does not exist:", filePath);
      return;
    }

    const data = fs.readFileSync(filePath, { encoding: "utf8", flag: "r" });

    // split data into lines
    const splitLines = data.split(/\r?\n/);

    dictionary = [];

    // split lines into words
    splitLines.forEach((line) => {
      const words = line.split(" "); // sanat taulukkoon words
      if (words.length === 2) {
        const word = {
          fin: words[0],
          eng: words[1],
        };
        dictionary.push(word);
      }
    });
  } catch (err) {
    console.error("Error reading file:", err);
  }
}

// Lue sanat tiedostosta ennen pyyntöjen käsittelyä
readWordsFromFile();

// get all words
app.get("/words", (req, res) => {
  res.json(dictionary);
});

// get a word by its Finnish word
app.get("/words/fin/:fin", (req, res) => {
  const fin = req.params.fin.toLowerCase();
  const word = dictionary.find((entry) => entry.fin.toLowerCase() === fin);

  if (word) {
    res.json(word);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

// add a word
app.post("/words", (req, res) => {
  const { fin, eng } = req.body;

  if (!fin || !eng) {
    return res
      .status(400)
      .json({ error: "Finnish and English words are required" });
  }

  // Lisää sana sanakirjaan
  const newWord = { fin, eng };
  dictionary.push(newWord);

  // Tallenna uusi sana tiedostoon
  fs.appendFileSync(filePath, `\n${fin} ${eng}`, "utf8");

  res.json(newWord);
});

app.listen(3000, () => {
  console.log("Server listening at port 3000");
});
