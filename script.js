const tg = window.Telegram.WebApp;
tg.expand();

let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;

const suits = ['❤️', '💎', '♣️', '♠️'];
const values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];

function createDeck() {
    deck = [];
    for (let s of suits) {
        for (let v of values) {
            deck.push({ value: v, suit: s });
        }
    }
    deck.sort(() => Math.random() - 0.5);
}

function getScore(hand) {
    let score = 0;
    let aces = 0;
    for (let card of hand) {
        if (['J','Q','K'].includes(card.value)) score += 10;
        else if (card.value === 'A') { score += 11; aces++; }
        else score += parseInt(card.value);
    }
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }
    return score;
}

function renderCard(card, elementId) {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `${card.value}<br>${card.suit}`;
    document.getElementById(elementId).appendChild(div);
}

function checkGameOver() {
    const pScore = getScore(playerHand);
    if (pScore > 21) {
        endGame("¡Te has pasado! Pierdes. 😭");
    }
}

function endGame(msg) {
    gameOver = true;
    document.getElementById('message').innerText = msg;
    document.getElementById('hit-btn').classList.add('hidden');
    document.getElementById('stand-btn').classList.add('hidden');
    document.getElementById('reset-btn').classList.remove('hidden');
    
    // Enviar resultado al bot de Telegram
    tg.sendData(`Resultado: ${msg} con ${getScore(playerHand)} puntos.`);
}

document.getElementById('hit-btn').onclick = () => {
    if (gameOver) return;
    const card = deck.pop();
    playerHand.push(card);
    renderCard(card, 'player-cards');
    document.getElementById('player-score').innerText = getScore(playerHand);
    checkGameOver();
};

document.getElementById('stand-btn').onclick = () => {
    while (getScore(dealerHand) < 17) {
        const card = deck.pop();
        dealerHand.push(card);
        renderCard(card, 'dealer-cards');
    }
    const pScore = getScore(playerHand);
    const dScore = getScore(dealerHand);
    
    if (dScore > 21 || pScore > dScore) endGame("¡GANASTE! 🏆");
    else if (pScore < dScore) endGame("Perdiste contra el crupier. 💀");
    else endGame("Empate. 🤝");
};

document.getElementById('reset-btn').onclick = () => location.reload();

// Iniciar juego
createDeck();
// Reparto inicial
document.getElementById('hit-btn').click();
document.getElementById('hit-btn').click();