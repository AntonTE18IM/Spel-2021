/** @format */

let suits = ['hearts', 'clubs', 'diams', 'spades'];
let values = [
  'Ess',
  'Kung',
  'Dam',
  'Knekt',
  'Tio',
  'Nio',
  'Åtta',
  'Sju',
  'Sex',
  'Fem',
  'Fyra',
  'Tre',
  'Två',
  //Alla värden på korten
];

let textArea = document.getElementById('text-area');
let newGameButton = document.getElementById('new-game-button');
let hitButton = document.getElementById('hit-button'); //	getelementbyid är en metod som ger de ID med specefika värde
let stayButton = document.getElementById('stay-button');
var money = 100;

function Bets() {
  this.pot = 500;
  this.bet = 0;
  $('#bet').text(0);
  $('#pot').text('$' + this.pot);
}

// Bet metoder
Bets.prototype.updateAmounts = function () {
  $('#bet').text('$' + this.bet);
  $('#pot').text('$' + this.pot);
};
Bets.prototype.doubleDown = function () {
  this.pot -= this.bet;
  this.bet += this.bet;
};
Bets.prototype.potAmount = function () {
  return this.pot;
};
Bets.prototype.betAmount = function () {
  return this.bet;
};
Bets.prototype.disableDeal = function () {
  $('#deal-button').addClass('disabled');
};
Bets.prototype.addBet = function (amount) {
  if (this.pot >= amount) {
    this.pot = this.pot - amount;
    this.bet = this.bet + amount;
    this.updateAmounts();
    $('#deal-button').removeClass('disabled');
  } else {
    notEnoughChips();
  }
};
Bets.prototype.winner = function () {
  this.pot += this.bet * 2;
  this.bet = 0;
  this.updateAmounts();
  this.disableDeal();
};
Bets.prototype.loser = function () {
  this.bet = 0;
  this.updateAmounts();
  this.disableDeal();
};
Bets.prototype.push = function () {
  this.pot += this.bet;
  this.bet = 0;
  this.updateAmounts();
  this.disableDeal();
};
Bets.prototype.blackJackWinner = function () {
  this.pot += parseInt(this.bet * 2.5);
  this.bet = 0;
  this.updateAmounts();
  this.disableDeal();
};

hitButton.style.display = 'none';
stayButton.style.display = 'none';

let gameStart = false,
  gameOver = false,
  playWon = false,
  dealerCards = [],
  playerCards = [],
  dealerScore = 0,
  playerScore = 0,
  deck = [];

newGameButton.addEventListener('click', function () {
  //Lägger till en knapp som visar nytt spel, detta gäller för alla addeventlists
  gameStarted = true;
  gameOver = false;
  playerWon = false;

  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [getNextCard(), getNextCard()]; //Spelbrädet för blackjack samt att korten blandas.
  playerCards = [getNextCard(), getNextCard()];
  newGameButton.style.display = 'none';
  hitButton.style.display = 'inline';
  stayButton.style.display = 'inline';
  showStatus();
});

function createDeck() {
  let deck = [];
  for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
    for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
      let card = {
        suit: suits[suitIdx],
        value: values[valueIdx],
      };
      deck.push(card);
    }
  }
  return deck;
}

function shuffleDeck(deck) {
  for (let i = 0; i < deck.length; i++) {
    let swapIdx = Math.trunc(Math.random() * deck.length);
    let tmp = deck[swapIdx];
    deck[swapIdx] = deck[i];
    deck[i] = tmp;
  }
}

hitButton.addEventListener('click', function () {
  playerCards.push(getNextCard());
  checkForEndOfGame();
  showStatus();
});

stayButton.addEventListener('click', function () {
  gameOver = true;
  checkForEndOfGame();
  showStatus();
});

function checkForEndOfGame() {
  updateScores();

  if (gameOver) {
    while (dealerScore < playerScore && playerScore <= 21 && dealerScore <= 21) {
      dealerCards.push(getNextCard());
      updateScores();
    }
  }

  if (playerScore > 21) {
    playerWon = false;
    gameOver = true; //Över 21 förlorar man
  } else if (dealerScore > 21) {
    playerWon = true;
    gameOver = true; //Delearn får över 21 vinner man
  } else if (gameOver) {
    //Else if sats ifall spelar får bättre poäng än dealern eller sämre
    if (playerScore > dealerScore) {
      playerWon = true;
    } else {
      playerWon = false;
    }
  }
}

function getCardNumericValue(card) {
  switch (card.value) {
    case 'Ess':
      return 1;
    case 'Två':
      return 2;
    case 'Tre':
      return 3;
    case 'Fyra':
      return 4;
    case 'Fem':
      return 5;
    case 'Sex':
      return 6;
    case 'Sju':
      return 7;
    case 'Åtta':
      return 8;
    case 'Nio':
      return 9;
    default:
      return 10;
  }
}
function showStatus() {
  if (!gameStarted) {
    textArea.innerText = 'Välkommen till Blackjack!';
    return;
  }

  const dealerHandUl = document.createElement('ul');
  dealerHandUl.classList.add('d-flex');
  dealerHandUl.classList.add('justify-content-center');
  dealerHandUl.classList.add('table');
  for (let i = 0; i < dealerCards.length; i++) {
    dealerHandUl.appendChild(getCard(dealerCards[i]));
  }

  const playerHandUl = document.createElement('ul');
  playerHandUl.classList.add('d-flex');
  playerHandUl.classList.add('justify-content-center');
  playerHandUl.classList.add('table');
  playerHandUl.classList.add('playingCards');
  for (let i = 0; i < playerCards.length; i++) {
    playerHandUl.appendChild(getCard(playerCards[i]));
  }

  updateScores();
  textArea.innerHTML = '';
  const dealerDiv = document.createElement('div');
  const dealerP = document.createElement('p');
  const dealerPoäng = document.createElement('p');
  dealerDiv.classList.add('card');
  dealerDiv.classList.add('row');
  dealerDiv.classList.add('playingCards');
  dealerDiv.classList.add('faceImages');

  dealerP.innerHTML = 'Dealer har:\n';
  dealerPoäng.innerHTML = 'Poäng: ' + dealerScore;

  dealerDiv.appendChild(dealerP);
  dealerDiv.appendChild(dealerHandUl);
  dealerDiv.appendChild(dealerPoäng);

  const playerDiv = document.createElement('div');
  const playerP = document.createElement('p');
  const playerPoäng = document.createElement('p');
  playerDiv.classList.add('row');
  playerDiv.classList.add('card');

  playerDiv.classList.add('playingCards');
  playerDiv.classList.add('faceImages');

  playerP.innerHTML = 'Du har:\n';
  playerPoäng.innerHTML = 'Poäng: ' + playerScore;

  playerDiv.appendChild(playerP);
  playerDiv.appendChild(playerHandUl);
  playerDiv.appendChild(playerPoäng);

  textArea.appendChild(dealerDiv);
  textArea.appendChild(playerDiv);
  if (gameOver) {
    if (playerWon) {
      playerPoäng.innerHTML += '<br>DU VANN!';
    } else {
      playerPoäng.innerHTML += '<br>DEALER VANN';
    }
    newGameButton.style.display = 'inline';
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
  }
}

function getScore(cardArray) {
  let score = 0;
  let hasAce = false;
  for (let i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += getCardNumericValue(card);
    if (card.value == 'Ace') {
      hasAce = true;
    }

    if (hasAce && score + 10 <= 21) {
      return score + 10;
    }
  }
  return score;
}

function updateScores() {
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);
}

function getNextCard() {
  return deck.shift();
}
//skapar kortens span element
function cardSpans(rank, suit) {
  const cardRank = document.createElement('span');
  const cardSuit = document.createElement('span');
  cardRank.classList.add('rank');
  cardRank.innerHTML = rank;
  cardInHand.appendChild(cardRank);
  cardSuit.classList.add('suit');
  cardSuit.innerHTML = '&' + suit + ';';
  cardInHand.appendChild(cardSuit);
}

function getCard(card) {
  var value = getCardRealValue(card.value);
  const cardLi = document.createElement('li');
  cardInHand = document.createElement('div');
  if (value <= 10) {
    cardSpans(value, card.suit);
    var rank = 'rank-' + value;
    cardInHand.classList.add(rank);
    cardInHand.classList.add(card.suit);
  } else {
    // HandUl.classList.add('faceImages');
    //knekt
    if (value == 11) {
      cardInHand.classList.add('rank-j');
      cardInHand.classList.add(card.suit);
      cardSpans('J', card.suit);
      //dam
    } else if (value == 12) {
      cardInHand.classList.add('rank-q');
      cardInHand.classList.add(card.suit);
      cardSpans('Q', card.suit);
      //kung
    } else if (value == 13) {
      cardInHand.classList.add('rank-k');
      cardInHand.classList.add(card.suit);
      cardSpans('K', card.suit);
      //ess
    } else if (value == 14) {
      cardInHand.classList.add('rank-a');
      cardInHand.classList.add(card.suit);
      cardSpans('A', card.suit);
    }
  }
  cardInHand.classList.add('cards');
  cardLi.appendChild(cardInHand);

  return cardLi;
}
function getCardRealValue(card) {
  console.log(card);
  switch (card) {
    case 'Två':
      return 2;
    case 'Tre':
      return 3;
    case 'Fyra':
      return 4;
    case 'Fem':
      return 5;
    case 'Sex':
      return 6;
    case 'Sju':
      return 7;
    case 'Åtta':
      return 8;
    case 'Nio':
      return 9;
    case 'Tio':
      return 10;
    case 'Knekt':
      return 11;
    case 'Dam':
      return 12;
    case 'Kung':
      return 13;
    case 'Ess':
      return 14;
    default:
      return 0;
  }
}
