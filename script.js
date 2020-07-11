const word = document.getElementById('word');
const text = document.getElementById('text');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const endgameEl = document.getElementById('end-game-container');
const settingsBtn = document.getElementById('settings-btn');
const settings = document.getElementById('settings');
const settingsForm = document.getElementById('settings-form');
const difficultySelect = document.getElementById('difficulty');

// List of words for game
// const words = [
//   'sigh',
//   'tense',
//   'airplane',
//   'ball',
//   'pies',
//   'juice',
//   'warlike',
//   'bad',
//   'north',
//   'dependent',
//   'steer',
//   'silver',
//   'highfalutin',
//   'superficial',
//   'quince',
//   'eight',
//   'feeble',
//   'admit',
//   'drag',
//   'loving'
// ];

// Init word
let randomWord;

// Init score
let score = 0;

// Init time
let time = 10;

// Set difficulty to value in ls or medium
let difficulty =
  localStorage.getItem('difficulty') !== null
    ? localStorage.getItem('difficulty')
    : 'medium';

// Set difficulty select value
difficultySelect.value =
  localStorage.getItem('difficulty') !== null
    ? localStorage.getItem('difficulty')
    : 'medium';

// Focus on text on start
text.focus();

// Start counting down
const timeInterval = setInterval(updateTime, 1000);

// Generate random word from array
// function getRandomWord() {
//   return words[Math.floor(Math.random() * words.length)];
// }
// Get random word from API od LS
async function getRandomWord() {
    if (localStorage.getItem('typing_game') === null) {
        const res = await fetch('https://random-word-api.herokuapp.com/word?number=10000');
        const data = await res.json();
        localStorage.setItem('typing_game', JSON.stringify(data));
        return data
    } else {
        data = JSON.parse(localStorage.getItem('typing_game'));
        return data
    }
}

// Add word to DOM
async function addWordToDOM() {
    let data = await getRandomWord();
    randomWord = data.filter(w => w.length );
    randomWord = randomWord[Math.floor(Math.random() * randomWord.length)]
    console.log(randomWord)
    word.innerText = randomWord;
    return randomWord;
}

// Add word to DOM
// function addWordToDOM() {
//   randomWord = getRandomWord();
//   word.innerHTML = randomWord;
// }

// Update score
function updateScore() {
  score++;
  scoreEl.innerHTML = score;
}

// Update time
function updateTime() {
  time--;
  timeEl.innerHTML = time + 's';

  if (time === 0) {
    clearInterval(timeInterval);
    // end game
    gameOver();
  }
}

// Game over, show end screen
function gameOver() {
  endgameEl.innerHTML = `
    <h1>Time ran out</h1>
    <p>Your final score is ${score}</p>
    <button onclick="location.reload()">Reload</button>
  `;

  endgameEl.style.display = 'flex';
}

addWordToDOM();

// Event listeners

// Typing
text.addEventListener('input', e => {
  const insertedText = e.target.value;

  if (insertedText === randomWord) {
    addWordToDOM();
    updateScore();

    // Clear
    e.target.value = '';

    if (difficulty === 'hard') {
      time += 8;
    } else if (difficulty === 'medium') {
      time += 12;
    } else {
      time += 15;
    }

    updateTime();
  }
});

// Settings btn click
settingsBtn.addEventListener('click', () => settings.classList.toggle('hide'));

// Settings select
settingsForm.addEventListener('change', e => {
  difficulty = e.target.value;
  localStorage.setItem('difficulty', difficulty);
});