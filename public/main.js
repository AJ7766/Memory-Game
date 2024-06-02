import { replayMenuSound, toggleMenuSound, playFlipCardSound, playCardMatchSound, playClickSound, playHoverSound, stopHoverSound } from './audio.js';
import { checkHighScore } from './leaderboards.js';

document.addEventListener("DOMContentLoaded", function() {
    const gameContainer = document.getElementById('game-container');
    const leaderboardWrapper = document.getElementById('wrapper');
    const menu = document.getElementById('menu');
    const menuSound = document.getElementById('menuSound');
    const homeButton = document.getElementById('home-btn');
    const replayGame = document.getElementById('replay-game');
    const toggleSounds = document.querySelectorAll('.toggleSound');
    const startButton = document.getElementById('start');
    const leaderboardButton = document.getElementById('leaderboard-btn');
    const closeButton = document.getElementById('close-btn');
    let score = document.getElementById('score');
    let multiplier = document.getElementById('multiplier');
    let time = document.getElementById('time');
    const highScoreElement = document.getElementById("highscore");

    // Creating array for images and doubling them with concat
    const images = [
        { url: 'image1.png', linearStyle: 'linear-gradient(180deg, rgb(109, 119, 140), rgb(255, 255, 255) 80%)' },
        { url: 'image2.png', linearStyle: 'linear-gradient(180deg, rgb(168 110 71), rgb(255 255 255) 80%)' },
        { url: 'image3.png', linearStyle: 'linear-gradient(rgb(243 154 105), rgb(201, 201, 201) 42%)' },
        { url: 'image4.png', linearStyle: 'linear-gradient(180deg, rgb(210 129 129), rgb(220 216 216) 80%)' },
        { url: 'image5.png', linearStyle: 'linear-gradient(180deg, rgb(38 217 15), rgb(135 255 149) 80%)' },
        { url: 'image6.png', linearStyle: 'linear-gradient(180deg, rgb(186 127 96), rgb(255, 228, 228) 80%)' },
        { url: 'image7.png', linearStyle: 'linear-gradient(180deg, rgb(215 136 41), rgb(255 218 182) 80%)' },
        { url: 'image8.png', linearStyle: 'linear-gradient(rgb(211 117 36), rgb(255 255 255) 120%)' },
        { url: 'image9.png', linearStyle: 'linear-gradient(rgb(232 69 145), rgb(255 255 255) 140%)' },
        { url: 'image10.png', linearStyle: 'linear-gradient(rgb(121 0 10), rgb(255 255 255) 130%)' },
        { url: 'image11.png', linearStyle: 'linear-gradient(rgb(10 79 164), rgb(255 255 255) 170%)' },
        { url: 'image12.png', linearStyle: 'linear-gradient(rgb(233 163 78), rgb(255 255 255) 180%)' }
];
    const imageUrls = images.concat(images);

    menuSound.addEventListener('ended', replayMenuSound.bind(null, menuSound));
    createCards();

    startButton.playsinline = "true";
    leaderboardButton.playsinline = "true";
    // Desktop & Mobile 
if (window.innerWidth > 1000) {
    // Buttons
        startButton.addEventListener('click', () => { startGame(); playClickSound(); });
        startButton.addEventListener("mouseenter", playHoverSound);
        startButton.addEventListener("mouseleave", stopHoverSound);
        leaderboardButton.addEventListener('click', () => { openLeaderboard(); playClickSound(); });
        leaderboardButton.addEventListener("mouseenter", playHoverSound);
        leaderboardButton.addEventListener("mouseleave", stopHoverSound);
        closeButton.addEventListener('click', () => { closeLeaderboard(); playClickSound(); });
    // Audio
        toggleSounds.forEach(toggleSound => {
        toggleSound.addEventListener('click', toggleMenuSound);
        });
        replayGame.addEventListener('click', () => { resetGame(); playClickSound(); });
        homeButton.addEventListener('click', () => { returnHome(); playClickSound(); });
        console.log("main.js Desktop: " + window.innerWidth);
    }
    else{
    // Buttons
    startButton.addEventListener('touchstart', () => { startGame(); playClickSound(); });
    leaderboardButton.addEventListener('touchstart', () => { openLeaderboard(); playClickSound(); });
    closeButton.addEventListener('touchstart', () => { closeLeaderboard(); playClickSound(); });
    // Audio
        toggleSounds.forEach(toggleSound => {
        toggleSound.addEventListener('touchstart', toggleMenuSound);
    });
        replayGame.addEventListener('touchstart', () => { resetGame(); playClickSound(); });
        homeButton.addEventListener('touchstart', () => { returnHome(); playClickSound(); });
    console.log("main.js Phone: " + window.innerWidth);
    }

function createCards(){
const parentElement = document.querySelector('.cards');
const numberOfCards = 24;
const cardsArray = new Array(numberOfCards).fill(null);

cardsArray.forEach(function(_, index) {

        const card = document.createElement('div');
        card.classList.add('card');
        const backContent = document.createElement('div');
        backContent.classList.add('card-content', 'back');
        const frontContent = document.createElement('div');
        frontContent.classList.add('card-content', 'front');

        card.appendChild(backContent);
        card.appendChild(frontContent);
        parentElement.appendChild(card);
}
);
const frontCards = document.querySelectorAll('.front');
frontCards.forEach((frontCard, index) => {
    if (index < imageUrls.length && imageUrls[index]) {
            const imageUrl = 'url(images/cards/' + imageUrls[index].url + '), ' + imageUrls[index].linearStyle;
            frontCard.style.backgroundImage = imageUrl;
    } else {
            console.error('Index out of bounds or invalid object:', index);
    }
});
}

const cardContainer = document.querySelector('.cards');
function clickedCard(event){
    const clickedCard = event.target.closest('.card');
    if (clickedCard) {
        flipCard(clickedCard);
        console.log("click");
    }
}
cardContainer.addEventListener('click', clickedCard);

function startGame(){
    menu.className = 'hidden';
        resetGame();
        setTimeout(function() {
            score.textContent = "SCORE:";
            multiplier.textContent = "1x" ;
            time.textContent = "00:00";
            gameContainer.classList.add('visible');
}, 400);
}

function openLeaderboard(){
    leaderboardWrapper.className = 'visible';
    menu.className = 'behind';
}

function closeLeaderboard(){
    leaderboardWrapper.className = 'hidden';
    menu.className = 'visible';
}

let seconds = 0;
let minutes = 0;
let timerInterval;
let formatedTime;
let formattedMinutes;
let formattedSeconds;

function updateTimer() {
    seconds++;
    timeInSeconds++;
    if (seconds > 59){
        ++minutes
        seconds = 0;
    }

   formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
   formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

   formatedTime = formattedMinutes + ':' + formattedSeconds;
   time.textContent = formatedTime;
}

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    console.log("Final time: " + seconds);
}

let flippedCards = [];
let matchScore = 0;
let pointsGain = 100;
let pointsMultiplier = 0;
let matchStreak = 0;
let matchesLeft = 0;
let totalAvailableMatches = imageUrls.length / 2;
let timeMultiplier = 100000;
let timeInSeconds = 0;
let timeInScore = 0;
let finalScore = 0;
let timeIsOn = false;

function flipCard(card) {
    if (!timeIsOn){
        startTimer();
        timeIsOn = true;
    }
     if (card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
        card.classList.toggle('flipped');
        flippedCards.push(card);
        playFlipCardSound();

        if (flippedCards.length === 2) {
                const [card1, card2] = flippedCards;
                if (checkMatch(card1, card2)) {
                    
                    playCardMatchSound();
                    card1.classList.add('matched');
                    card2.classList.add('matched');

                    matchStreak += 1;
                    pointsMultiplier = matchStreak + 1;
                    pointsGain = matchStreak * pointsGain;
                    matchScore = matchScore + pointsGain;

                    score.textContent = "SCORE: " + matchScore;
                    multiplier.textContent = pointsMultiplier + "x";
                    
                    console.log("Streak: "+ matchStreak + " scoreGained: " + pointsGain + " Multiplier: x " + pointsMultiplier + " Time score: " + timeInSeconds);
                    console.log("Score: "+ matchScore);
                    pointsGain = 100;

                    matchesLeft += 1;
                    console.log(matchesLeft + '/' + totalAvailableMatches);

                    if (matchesLeft === totalAvailableMatches){
                        console.log("you finished the game!");
                        setTimeout(pauseTimer);
                        timeInScore = timeMultiplier / timeInSeconds;
                        finalScore = Math.floor(matchScore + timeInScore);
                        console.log("Score from cards: " + matchScore + "Score from Time: " + timeInScore + "Final Score: " + finalScore)
                        score.textContent = "SCORE: " + finalScore;
                        console.log("Name: Jackie " + "Time: " + formatedTime + " Final Score: " + finalScore);
                        checkHighScore(formatedTime, finalScore);
                    }
                } else {
                        matchStreak = 0;
                        multiplier.textContent = "1x" ;
                        setTimeout(() => {
                                card1.classList.remove('flipped');
                                card2.classList.remove('flipped');
                        }, 800);
                }
                flippedCards = [];
        }
}


function checkMatch(card1, card2) {
        const frontContent1 = card1.querySelector('.front');
        const frontContent2 = card2.querySelector('.front');
        
        const imageUrl1 = frontContent1.style.backgroundImage.slice(5, -2);
        const imageUrl2 = frontContent2.style.backgroundImage.slice(5, -2);
        
        return imageUrl1 === imageUrl2;
}

function returnHome(){
    gameContainer.className = 'hidden';
    setTimeout(function() {
        menu.className = 'visible';
        resetGame();
}, 400);
}

function resetGame(){
    const cards = document.querySelectorAll('.card');
    let cardsArray = [];
    score.textContent = "SCORE:";
    multiplier.textContent = "1x" ;
    time.textContent = "00:00";
    highScoreElement.className = 'hidden';
    setTimeout(pauseTimer);
    cards.forEach(card=>{
        card.className = 'card';
        cardsArray.push(card);
    });
    console.log(cardsArray);
        shuffleArray(cardsArray);
        flippedCards = [];
        matchScore = 0;
        pointsGain = 100;
        pointsMultiplier = 0;
        matchStreak = 0;
        matchesLeft = 0;
        totalAvailableMatches = imageUrls.length / 2;
        timeInScore = 0;
        finalScore = 0;
        timeIsOn = false;
        seconds = 0;
        minutes = 0;
        formattedMinutes = 0;
        formattedSeconds = 0;
}

function shuffleArray(array) {
    let shuffledArray = [];
    const cardContainer = document.querySelector('.cards');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    shuffledArray = array;
    shuffledArray.forEach(card => {
            cardContainer.appendChild(card);
    });


}
});

