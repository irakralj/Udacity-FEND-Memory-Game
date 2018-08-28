// list that holds all of cards
const deck = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb']
// array that stores opened cards
let openedCards = []
// initial state of move counter and timer
let moveCounter = 0
let seconds = 00
let minutes = 00

let closingTimeout
let timer

let cardIndex = 0

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

shuffle(deck)

function cardShuffle() {
  document.querySelectorAll('.card').forEach(function(card) {
  card.firstElementChild.setAttribute('class', `fa ${deck[cardIndex]}`)
  cardIndex++
  })
}

cardShuffle()

// opens clicked card
function cardOpening(card) {
  card.setAttribute('class', 'card open show')
  openedCards.push(card.firstElementChild.getAttribute('class'))
}

// matching cards
function cardMatch(openedCard) {
  openedCard.setAttribute('class', 'card match')
  document.querySelector('.open').setAttribute('class', 'card match')
}

// function to close opened cards if not matched
function closeCards(lastCard) {
  lastCard.setAttribute('class', 'card')
  document.querySelector('.open').setAttribute('class', 'card')
}

// manages timeout and card closing
function closeTimeout(card) {
  closingTimeout = setTimeout(closeCards, 1500, card)
  setTimeout(resetOpenedCards, 1500)
}

// resets opened card array to empty state
function resetOpenedCards() {
  openedCards = []
}

// stops card from being clicked twice and opening of a third card if two already opened
function cardCheck (clickedCard) {
  return (openedCards.length < 2 && document.querySelector('.open') !== clickedCard && clickedCard.getAttribute('class') !== 'match' && clickedCard.getAttribute('class') === 'card')
}

function resetAll() {
  // resets stars
  document.querySelectorAll('.removed-star').forEach(function(star) {
    star.setAttribute('class', 'fa fa-star')
  })
  // resets time
  clearInterval(timer)
  minutes = 00
  seconds = 00
  document.querySelector('.timer').innerHTML = minutes + ':' + seconds
  // resets moves
  moveCounter = 0
  document.querySelector('.moves').innerHTML = 0
  // closes all cards
  document.querySelectorAll('.match, .open').forEach(function(card) {
    if (openedCards.length === 2) {
      clearTimeout(closingTimeout)
    }
    card.setAttribute('class', 'card')
  })
  openedCards = []
  // shuffles cards
  shuffle(deck)
  cardIndex = 0
  cardShuffle()
}

// reset button
document.querySelector('.restart').addEventListener('click', function(e) {
  resetAll()
})

document.querySelectorAll('.card').forEach(function(card) {
  card.addEventListener('click', function(e) {
    // opens clicked card
    if (cardCheck(e.target)) {
      cardOpening(e.target)
      if (openedCards.length === 2) {
        // check if cards are matched
        if (openedCards[0] === openedCards[1]) {
          cardMatch(e.target)
          resetOpenedCards()
        }
        // closes cards if not matched
        else {
          closeTimeout(e.target)
        }
      }
      // starts move counter
      moveCounter++
      document.querySelector('.moves').textContent = moveCounter
      if (moveCounter === 24 || moveCounter === 36 || moveCounter === 48) {
        document.querySelector('.fa-star').setAttribute('class', 'removed-star')
      }
      // timer
      if (moveCounter === 1) {
        timer = setInterval(function() {
          seconds++
          if (seconds === 60) {
            minutes++
            seconds = 00
          }
          // adding 0 to seconds
          if (seconds < 10) {
            document.querySelector('.timer').innerHTML = minutes + ':0' + seconds
          }
          else {
            document.querySelector('.timer').innerHTML = minutes + ':' + seconds
          }
          // checks for winning
          if (document.querySelectorAll('.match').length === 16) {
            // stops timer
            clearInterval(timer)
            // sweet alert 2 modal box
            swal({
              allowEscapeKey:false,
              allowOutsideClick: false,
              title: 'You won!',
              text: `Time: ${minutes}:${seconds}  Moves: ${moveCounter}  Stars ${document.querySelectorAll('.fa-star').length} of 3`,
              type: 'success',
              confirmButtonText: 'Play again',
              confirmButtonColor: '#ff8552',
              confirmButtonClass: 'restart',
              showCloseButton: 'true',
            }).then(
              function () {
                resetAll() },
              function () {
                return false;
              });
          }
        }, 1000)
      }
    }
  })
})
