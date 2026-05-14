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
    shuffle();
}

function shuffle() {
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
    div.innerHTML = `<span>${card.value}</span><span>${card.suit}</span>`;
    document.getElementById(elementId).appendChild(div);
}

function endGame(msg) {
    gameOver = true;
    document.getElementById('message').innerText = msg;
    document.getElementById('hit-btn').classList.add('hidden');
    document.getElementById('stand-btn').classList.add('hidden');
    document.getElementById('reset-btn').classList.remove('hidden');
}

document.getElementById('hit-btn').onclick = () => {
    if (gameOver) return;
    const card = deck.pop();
    playerHand.push(card);
    renderCard(card, 'player-cards');
    const score = getScore(playerHand);
    document.getElementById('player-score').innerText = score;
    if (score > 21) endGame("¡TE PASASTE! 💥");
};

document.getElementById('stand-btn').onclick = () => {
    if (gameOver) return;
    
    let dScore = getScore(dealerHand);
    while (dScore < 17) {
        const card = deck.pop();
        dealerHand.push(card);
        renderCard(card, 'dealer-cards');
        dScore = getScore(dealerHand);
    }
    document.getElementById('dealer-score').innerText = dScore;
    
    const pScore = getScore(playerHand);
    if (dScore > 21) endGame("¡EL CRUPIER SE PASÓ! Ganaste 🏆");
    else if (pScore > dScore) endGame("¡GANASTE! 🏆");
    else if (pScore < dScore) endGame("PERDISTE 💀");
    else endGame("EMPATE 🤝");
};

document.getElementById('reset-btn').onclick = () => {
    // Reiniciar mesa
    playerHand = [];
    dealerHand = [];
    gameOver = false;
    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('dealer-cards').innerHTML = '';
    document.getElementById('player-score').innerText = '0';
    document.getElementById('dealer-score').innerText = '0';
    document.getElementById('message').innerText = '';
    document.getElementById('hit-btn').classList.remove('hidden');
    document.getElementById('stand-btn').classList.remove('hidden');
    document.getElementById('reset-btn').classList.add('hidden');
    
    if (deck.length < 10) createDeck();
    initGame();
};

document.getElementById('exit-btn').onclick = () => {
    tg.close();
};

function initGame() {
    // Reparto inicial
    const p1 = deck.pop();
    const p2 = deck.pop();
    playerHand.push(p1, p2);
    renderCard(p1, 'player-cards');
    renderCard(p2, 'player-cards');
    document.getElementById('player-score').innerText = getScore(playerHand);

    const d1 = deck.pop();
    dealerHand.push(d1);
    renderCard(d1, 'dealer-cards');
    document.getElementById('dealer-score').innerText = getScore(dealerHand);
}

createDeck();
initGame();
