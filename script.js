const tg = window.Telegram.WebApp;
tg.expand();

let deck = [];
let playerHand = [];
let dealerHand = [];
let isGameOver = false;

const suits = ['❤️', '💎', '♣️', '♠️'];
const values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];

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
    cardDiv.innerHTML = `<div>${card.v}</div><div style="font-size:1.5rem">${card.s}</div>`;
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

    // Reparto inicial
    drawCard(playerHand, 'player-cards');
    drawCard(playerHand, 'player-cards');
    drawCard(dealerHand, 'dealer-cards'); // El crupier empieza con una visible

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
    if (score > 21) finishGame("¡TE PASASTE! 💀");
};

document.getElementById('stand-btn').onclick = () => {
    if (isGameOver) return;
    
    // Turno del Crupier
    while (calculateScore(dealerHand) < 17) {
        drawCard(dealerHand, 'dealer-cards');
    }
    updateScores();

    const pScore = calculateScore(playerHand);
    const dScore = calculateScore(dealerHand);

    if (dScore > 21) finishGame("¡CRUPIER SE PASÓ! 🏆");
    else if (pScore > dScore) finishGame("¡GANASTE! 🏆");
    else if (pScore < dScore) finishGame("PERDISTE 💀");
    else finishGame("EMPATE 🤝");
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

// Inicializar
startNewGame();
