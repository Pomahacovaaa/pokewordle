import { WORDS } from "./pokemons.js";

const NUMBER_OF_GUESSES=6;

let guessesLeft = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)].toLowerCase();
const urlName = rightGuessString.toLowerCase();
const WORD_LENGTH = rightGuessString.length;
const music = new Audio("poketheme.mp3");

music.loop = true;
music.volume = 0.01; 
const gelb = new Audio("pop.wav");
gelb.volume = 0.1;
const win = new Audio("win.wav");
win.volume = 0.1;
const error = new Audio("error.wav");
error.volume = 0.1;
music.play();
console.log(rightGuessString);

function initBoard() {
    let board = document.getElementById("game-board")

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div");
        row.className = "letter-row";
        for (let j = 0; j < WORD_LENGTH; j++) {
            let box = document.createElement("div");
            box.className = "letter-box";
            row.appendChild(box);
        }
        board.appendChild(row);
    }
}

document.addEventListener("keyup", (e)=> {
    if (guessesLeft === 0) {
        return;
    }
    let pressedKey = String(e.key);

    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter();
        return;
    }
    if (pressedKey === "Enter") {

        checkGuess();
        return;
    }

    
    let found = pressedKey.match(/[a-z]/gi);

    if (!found || found.length > 1) {
        return;
    }

    insertLetter(pressedKey);
});



function insertLetter(pressedKey) {
    if (nextLetter === WORD_LENGTH) {
        return;
    }

    pressedKey = pressedKey.toLowerCase();

    let row = 
    document.getElementsByClassName("letter-row")
    [NUMBER_OF_GUESSES - guessesLeft];

    let box = row.children[nextLetter];
    box.textContent = pressedKey;
    box.classList.add("filled-box");
    currentGuess.push(pressedKey);

    nextLetter++;

}
function deleteLetter() {

    let row =
    document.getElementsByClassName("letter-row")
    [NUMBER_OF_GUESSES - guessesLeft];

    let box = row.children[nextLetter - 1];

    box.textContent = "";

    box.classList.remove("filled-box");

    currentGuess.pop();

    nextLetter--;
}

function shadeKeyBoard(letter, box) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            // zelena
            if (box.classList.contains("correct")) {
                elem.classList.add("correct");
            // zluta
            } else if (box.classList.contains("present")) {
                if (!elem.classList.contains("correct")) {
                    elem.classList.add("present");
                }
            // seda
            } else {
                if (
                    !elem.classList.contains("correct") &&
                    !elem.classList.contains("present")
                ) {
                    elem.classList.add("wrong");
                }
            }
        }
    }
}


function checkGuess() {
    let row =
    document.getElementsByClassName("letter-row")
    [NUMBER_OF_GUESSES - guessesLeft];

    let guessString = currentGuess.join("");
    let rightGuess = Array.from(rightGuessString);
    if (guessString.length !== WORD_LENGTH) {
        alert("NOT ENOUGH LETTERS");
        return;
    }

    let letterCount = {};

// count letters in answer
for (let letter of rightGuessString) {
    letterCount[letter] = (letterCount[letter] || 0) + 1;
}

// FIRST PASS = greens
for (let i = 0; i < WORD_LENGTH; i++) {

    let box = row.children[i];
    let letter = currentGuess[i];
    let delay = 250 * i;

    setTimeout(() => {

        if (letter === rightGuessString[i]) {

            box.classList.add("correct");

            letterCount[letter]--;

            const s = win.cloneNode();
            s.currentTime = 0;
            s.volume = 0.1;
            s.play();
        }

    }, delay);
}

// SECOND PASS = yellows + wrong
for (let i = 0; i < WORD_LENGTH; i++) {

    let box = row.children[i];
    let letter = currentGuess[i];
    let delay = 250 * i;

    setTimeout(() => {

        // zelena
        if (box.classList.contains("correct")) {
            shadeKeyBoard(letter, box);
            return;
        }

        // zluta
        if (letterCount[letter] > 0) {

            box.classList.add("present");

            letterCount[letter]--;

            const s = gelb.cloneNode();
            s.currentTime = 0;
            s.volume = 0.1;
            s.play();

        } else {

            // seda
            box.classList.add("wrong");

            const s = error.cloneNode();
            s.currentTime = 0;
            s.volume = 0.1;
            s.play();
        }

        shadeKeyBoard(letter, box);

    }, delay);
}

    if (guessString === rightGuessString) {

    setTimeout(() => {
        win.currentTime = 0;
        win.volume = 0.4;
        win.play();

        showPokedexButton(rightGuessString);
    }, 1200);

    guessesLeft = 0;

    return;
}
    guessesLeft--;
    currentGuess = [];
    nextLetter= 0;

    if (guessesLeft === 0) {

    setTimeout(() => {
        showPokedexButton(rightGuessString);
    }, 1200);
}
}

function showPokedexButton(pokemonName) {
    const container = document.getElementById("game-container");
    const btn = document.createElement("button");
    btn.textContent = "Pokédex";
    btn.classList.add("pokedex-btn");
    btn.addEventListener("click", () => {
        window.open(
            `https://pokemondb.net/pokedex/${pokemonName}`,
            "_blank"
        );
    });

    container.appendChild(btn);


}

document.addEventListener("click", () => {
    music.play();
}, { once: true });
initBoard();
