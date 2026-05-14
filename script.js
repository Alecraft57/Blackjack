const tg = window.Telegram.WebApp;
tg.expand();

let deck = [];
let playerHand = [];
let dealerHand = [];
let isGameOver = false;

// Variables de puntuación
let wins = 0;
let losses = 0;

const suits = ['❤️', '💎', '♣️', '♠️'];
const values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];

// CARGAR DATOS AL INICIAR
function loadStats() {
    wins = localStorage.getItem('bj_wins') ? parseInt(localStorage.getItem('bj_wins')) : 0;
    losses = localStorage.getItem('bj_losses') ? parseInt(localStorage.getItem('bj_losses')) : 0;
    document.getElementById('stat-wins').innerText = wins;
    document.getElementById('stat-losses').innerText = losses;
}

function saveStats(result) {
    if (result === 'win') {
        wins++;
        localStorage.setItem('bj_wins', wins);
    } else if (result === 'loss') {
        losses++;
        localStorage.setItem('bj_losses', losses);
    }
    document.getElementById('stat-wins').innerText = wins;
    document.getElementById('stat-losses').innerText = losses;
}

function createDeck() {
    deck = [];
    for (let s of suits) {
        for (let v of values) {
            deck.push({ v, s });
        }
    }
    deck.sort(() => Math.random() - 0.5);
}

function calculateScore(hand) {
    let score = 0;
    let aces = 0;
    hand.forEach(card => {
        if (['J', 'Q', 'K'].includes(card.v)) score += 10;
        else if (card.v === 'A') { score += 11; aces++; }
        else score += parseInt(card.v);
    });
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }
    return score;
}

function drawCard(hand, elementId) {
    const card = deck.pop();
    hand.push(card);
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.innerHTML = `<div>${card.v}</div><div>${card.s}</div>`;
    if (card.s === '❤️' || card.s === '💎') cardDiv.style.color = 'red';
    document.getElementById(elementId).appendChild(cardDiv);
    return card;
}

function startNewGame() {
    isGameOver = false;
    playerHand = [];
    dealerHand = [];
    createDeck();

    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('dealer-cards').innerHTML = '';
    document.getElementById('result-overlay').classList.add('hidden');
    document.getElementById('game-btns').classList.remove('hidden');
    document.getElementById('end-btns').classList.add('hidden');

    drawCard(playerHand, 'player-cards');
    drawCard(playerHand, 'player-cards');
    drawCard(dealerHand, 'dealer-cards');

    updateScores();
}

function updateScores() {
    document.getElementById('player-score').innerText = calculateScore(playerHand);
    document.getElementById('dealer-score').innerText = calculateScore(dealerHand);
}

document.getElementById('hit-btn').onclick = () => {
    if (isGameOver) return;
    drawCard(playerHand, 'player-cards');
    const score = calculateScore(playerHand);
    updateScores();
    if (score > 21) {
        saveStats('loss');
        finishGame("¡TE PASASTE! 💀");
    }
};

document.getElementById('stand-btn').onclick = () => {
    if (isGameOver) return;
    
    while (calculateScore(dealerHand) < 17) {
        drawCard(dealerHand, 'dealer-cards');
    }
    updateScores();

    const pScore = calculateScore(playerHand);
    const dScore = calculateScore(dealerHand);

    if (dScore > 21 || pScore > dScore) {
        saveStats('win');
        finishGame(dScore > 21 ? "¡CRUPIER SE PASÓ! 🏆" : "¡GANASTE! 🏆");
    } else if (pScore < dScore) {
        saveStats('loss');
        finishGame("PERDISTE 💀");
    } else {
        finishGame("EMPATE 🤝");
    }
};

function finishGame(message) {
    isGameOver = true;
    document.getElementById('result-text').innerText = message;
    document.getElementById('result-overlay').classList.remove('hidden');
    document.getElementById('game-btns').classList.add('hidden');
    document.getElementById('end-btns').classList.remove('hidden');
}

document.getElementById('rematch-btn').onclick = startNewGame;
document.getElementById('exit-btn').onclick = () => tg.close();

// Inicialización
loadStats();
startNewGame();
