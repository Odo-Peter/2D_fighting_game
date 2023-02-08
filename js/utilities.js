//Game utils
const enemyHealth = document.querySelector('.enemy-health');
const playerHealth = document.querySelector('.player-health');
const displayText = document.querySelector('.display-text');

const btn = document.querySelector('#restart-btn');

let timer = parseInt(document.querySelector('.timeframe').textContent);
let timerText = document.querySelector('.timeframe');

//determine winner
const determineWinner = ({ player, enemy }) => {
  displayText.style.display = 'flex';
  btn.style.display = 'flex';

  if (player.health > enemy.health) displayText.innerHTML = 'PLAYER 1 WINS';
  else if (player.health < enemy.health)
    displayText.innerHTML = 'PLAYER 2 WINS';
  else if (player.health === enemy.health) displayText.innerHTML = 'Its a TIE';
};

const timeCheck = setInterval(() => {
  if (timer > 0) {
    timer -= 1;
    timerText.innerHTML = timer;
  } else {
    stopper();
    timer = 0;
    timerText.innerHTML = timer;
    if (timer === 0) determineWinner({ player: player, enemy: enemy });
  }
}, 1000);

const stopper = () => {
  clearInterval(timeCheck);
};

btn.addEventListener('click', () => {
  window.location.reload();
});
