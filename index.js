const startGameContainer = document.querySelector(".startGame");
const startGameCards = document.querySelectorAll(".startGame .card");
const startGameButton = document.querySelector(".startGame button");
const playground = document.querySelector(".playground");
const faRepeat = document.querySelector(".fa-repeat");
const timerDisplay = document.querySelector(".timer");
const TotalScoreDisplay = document.getElementById("score");
const TotalTimeDisplay = document.getElementById("time");

let levels = 2;
let columns = 2;
let rows = 2;
let matched = 0;
let cardOne;
let cardTwo;
let isPreventClick = true;
let timer = 0;
let intervalId;
let score = 0;
let completeButton;

// Initialize game
initGame();
// Initialize event listeners
initEventListeners();

// Game functions
function initGame() {
    updateScoreDisplay();
    updateTimerDisplay();
}

function initEventListeners() {
    startGameCards.forEach((card) => card.addEventListener("click", selectLevel));
    startGameButton.addEventListener("click", startGame);
    faRepeat.addEventListener("click", restartGame);
}

function selectLevel(e) {
    startGameCards.forEach((card) => card.classList.remove("active"));
    e.target.parentElement.classList.add("active");
    levels = e.target.parentElement.getAttribute("level");
    columns = e.target.parentElement.getAttribute("column");
    rows = e.target.parentElement.getAttribute("row");
}

function startGame() {
    startGameContainer.style.display = "none";
    playground.style.display = "grid";
    playground.style.gridTemplateColumns = `repeat(${columns}, 100px)`;
    playground.style.gridTemplateRows = `repeat(${rows}, 100px)`;
    createCards();
    startTimer();
    createCompleteButton();
}

function createCompleteButton() {
    completeButton = document.createElement("button");
    completeButton.textContent = "Complete";
    completeButton.classList.add("complete-button");
    playground.appendChild(completeButton);
    completeButton.addEventListener("click", completeGame);
}

function createCards() {
    const cardArr = [
        "house",
        "bomb",
        "poo",
        "gift",
        "egg",
        "dragon",
        "person-biking",
        "jet-fighter-up",
    ];
    const cardsToUse = [...cardArr.slice(0, levels), ...cardArr.slice(0, levels)];
    shuffleArray(cardsToUse);
    shuffleCards(cardsToUse);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function shuffleCards(cards) {
    playground.innerHTML = "";
    cards.forEach((card) => {
        playground.innerHTML += `
        <div class="card" onclick='flipCard(this)'>
            <div class="front"><i class="fa-solid fa-question"></i></div>
            <div class="back"><i class="fa-solid fa-${card}"></i></div>
        </div>
        `;
    });
    faRepeat.style.display = "block";
}

function flipCard(card) {
    if (cardOne !== card && isPreventClick) {
        card.classList.add("flip");
        if (!cardOne) {
            cardOne = card;
            return;
        }
        cardTwo = card;
        isPreventClick = false;
        let cardOneValue = cardOne.querySelector(".back").innerHTML;
        let cardTwoValue = cardTwo.querySelector(".back").innerHTML;
        matchCards(cardOneValue, cardTwoValue);
    }
}

function matchCards(cardOneValue, cardTwoValue) {
    if (cardOneValue === cardTwoValue) {
        matched++;
        score++;
        updateScoreDisplay();
        if (matched === levels) {
            stopTimer();
            setTimeout(() => {
                alert(`Congrats, you won! Time: ${formatTime(timer)} Score: ${score}`);
                displayWinningMessage();
            }, 500);
        }
        cardOne.classList.add("match");
        cardTwo.classList.add("match");
        cardOne.removeAttribute("onclick");
        cardTwo.removeAttribute("onclick");
        cardOne = "";
        cardTwo = "";
        isPreventClick = true;
    } else {
        setTimeout(() => {
            cardOne.classList.add("shake");
            cardTwo.classList.add("shake");
        }, 500);
        setTimeout(() => {
            cardOne.classList.remove("shake", "flip");
            cardTwo.classList.remove("shake", "flip");
            cardOne = "";
            cardTwo = "";
            isPreventClick = true;
        }, 1200);
    }
}

function displayWinningMessage() {
    const winningMessage = document.createElement("div");
    winningMessage.classList.add("winning-message");
    winningMessage.innerHTML = `
<h1 style="color: green;">YOU WON!</h1>
        <p style="color: #ffff00;">Time: ${formatTime(timer)}</p>
        <p style="color: #ffff00;">Score: ${score}</p>
    `;
    playground.appendChild(winningMessage);
    faRepeat.style.display = "block";
}

function completeGame() {
    stopTimer();
    const completionMessage = document.createElement("div");
    completionMessage.classList.add("completion-message");
    completionMessage.innerHTML = `
        <h1 style="color: green;">You Completed the Game!</h1>
        <p style="color: #ffff00;">Time: ${formatTime(timer)}</p>
        <p style="color: #ffff00;">Score: ${score}</p>
    `;
    playground.appendChild(completionMessage);
    faRepeat.style.display = "block";
    playground.removeChild(completeButton);
}

function startTimer() {
    intervalId = setInterval(() => {
        timer++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(intervalId);
}

function restartGame() {
    matched = 0;
    score = 0;
    timer = 0;
    cardOne = "";
    cardTwo = "";
    isPreventClick = true;
    playground.innerHTML = "";
    createCards();
    startTimer();
    updateScoreDisplay();
    updateTimerDisplay();
    createCompleteButton();
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function updateScoreDisplay() {
    TotalScoreDisplay.textContent = `Total Score: ${score}`;
}

function updateTimerDisplay() {
    TotalTimeDisplay.textContent = `Total Time: ${formatTime(timer)}`;
}

document.addEventListener("DOMContentLoaded", () => {
    updateScoreDisplay();
    updateTimerDisplay();
});
