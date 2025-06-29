const MAP_SIZE = 9;
let map = [];
let playerX, playerY;
let gameOver = false;
let moveCount = 0;
let health = 100;

async function generateGeminiImage(prompt) {
  const response = await fetch('http://localhost:3000/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  const data = await response.json();
  if (data.image) {
    document.getElementById('monsterImg').src = 'data:image/png;base64,' + data.image;
    document.getElementById('monsterImg').style.display = 'block';
  }
}

function initializeGame() {
  map = [];
  for(let i=0; i<MAP_SIZE; i++) {
    map[i] = [];
    for(let j=0; j<MAP_SIZE; j++) {
      if(i == 4 || j == 4) {
        map[i][j] = '.'; // Empty space
      }
      else {
        map[i][j] = 'W'; // Wall
      }
    }
  }
  playerX = 4;
  playerY = 4;
  // playerX = Math.floor(Math.random() * MAP_SIZE);
  // playerY = Math.floor(Math.random() * MAP_SIZE);
  map[playerY][playerX] = 'P';
  gameOver = false;
  moveCount = 0;
  document.getElementById('message').textContent = '';
  document.getElementById('monsterImg').style.display = 'none';
  document.getElementById('restartBtn').style.display = 'none';
  renderMap();
}

function renderMap() {
  let mapDiv = document.getElementById('map');
  let html = '';
  let monsterNearby = false;

  for(let i=0; i<MAP_SIZE; i++) {
    for(let j=0; j<MAP_SIZE; j++) {
      if(i === playerY && j === playerX) {
        html += '<span class="player">P</span> ';
      } else if(map[i][j] === 'M') {
        html += '<span class="monster">M</span> ';
        if (Math.abs(i - playerY) <= 1 && Math.abs(j - playerX) <= 1) {
          monsterNearby = true;
        }
      } else {
        html += map[i][j] + ' ';
      }
    }
    html += '<br>';
  }

  mapDiv.innerHTML = html;

  if(monsterNearby) {
    generateGeminiImage("First-Person perspective adventurer's encounter with one or multiple orcs in a dungeon with design inspired by Lord of the Rings");
  }
  document.getElementById('monsterImg').style.display = monsterNearby ? 'block' : 'none';
}

function movePlayer(dx, dy) {
  if(gameOver) return;

  if(map[playerY + dy][playerX + dx] === 'W') { 
    
    return; // Can't move through walls
  }

  map[playerY][playerX] = '.';
  playerX += dx;
  playerY += dy;

  if(playerX < 0 || playerX >= MAP_SIZE || playerY < 0 || playerY >= MAP_SIZE) {
    removeMonster();
    if(playerX < 0) {
      playerX = MAP_SIZE - 1;
    }
    if(playerX > 8) {
      playerX = 0;
    }
    if(playerY < 0) {
      playerY = MAP_SIZE - 1;    
    }
    if(playerY > 8) {
      playerY = 0;
    }
    // gameOver = true;
    // document.getElementById('message').textContent = 'You fell off the map! Game Over.';
    // document.getElementById('restartBtn').style.display = 'inline-block';
    renderMap();
    return;
  }

  if(map[playerY][playerX] === 'M') {
    gameOver = true;
    document.getElementById('message').textContent = 'You were eaten by a monster!';
    document.getElementById('restartBtn').style.display = 'inline-block';
    renderMap();
    return;
  }

  map[playerY][playerX] = 'P';
  moveCount++;

  if(moveCount % 4 === 0) {
    spawnMonster();
  }

  renderMap();
}

function removeMonster() { 
  for (let i = 0; i < MAP_SIZE; i++) {
    for (let j = 0; j < MAP_SIZE; j++) {
      if (map[i][j] === 'M') {
        map[i][j] = '.'; // Remove the monster
      }
    }
  }
}

function spawnMonster() {
  let mx, my;
  let tries = 0;
  do {
    mx = Math.floor(Math.random() * MAP_SIZE);
    my = Math.floor(Math.random() * MAP_SIZE);
    tries++;
  } while ((map[my][mx] !== '.' || (mx === playerX && my === playerY)) && tries < 100);

  if (tries < 100) {
    map[my][mx] = 'M';
  }
}

// Attack monsters adjacent to player
function attack() {
  if(gameOver) return;

  const directions = [
    [0, -1],  // up
    [1, 0],   // right
    [0, 1],   // down
    [-1, 0],  // left
    [-1, -1], // up left
    [1, -1], // up right
    [-1, 1], // down left
    [1, 1], // down right
  ];

  let attacked = false;
  for (const [dx, dy] of directions) {
    const nx = playerX + dx;
    const ny = playerY + dy;
    if (nx >= 0 && nx < MAP_SIZE && ny >= 0 && ny < MAP_SIZE) {
      if (map[ny][nx] === 'M') {
        combat();
        map[ny][nx] = '.';
        attacked = true;
        break; // attack only one monster per button press
      }
    }
  }

  if (attacked) {
    document.getElementById('message').textContent = 'You killed a monster!';
  } else {
    document.getElementById('message').textContent = 'No monsters nearby to attack.';
  }

  renderMap();
}

function combat() {
  const attackMessages = [
    "You swing your weapon at the monster!\n",
    "You strike the monster with a mighty blow!\n",
    "The monster falls before your fierce attack!\n",
    "You wound the beast with a swift strike!\n",
  ];

  const enemyHealth = [
    25, 50, 75, 100
  ];

  const enemyStates = [
    "frail", "weakened", "strong", "invincible"
  ]

  const indexes = [0, 1, 2, 3];
  const randomIndex = Math.floor(Math.random() * indexes.length);

  const currHealth = enemyHealth[Math.floor(Math.random() * enemyHealth.length)];
  const currState = enemyStates[Math.floor(Math.random() * enemyStates.length)];
  //document.getElementById('message').textContent = 'The monster is ' + currState + ' with ' + currHealth + ' health.';

  while (currHealth > 0) {
    const attackMessage = attackMessages[Math.floor(Math.random() * attackMessages.length)];
    document.getElementById('message').textContent = attackMessage + 'The monster is ' + currState + ' with ' + currHealth + ' health remaining.';
    currHealth -= 25; // Assume each attack reduces health by 25
  }
  
}

function quitGame() {
  gameOver = true;
  document.getElementById('message').textContent = 'Thanks for playing!';
  document.getElementById('monsterImg').style.display = 'none';
  document.getElementById('restartBtn').style.display = 'inline-block';
}

// ...existing code...

// Add this at the end of your file or after your function definitions
document.addEventListener('keydown', function(event) {
  switch(event.key.toLowerCase()) {
    case 'w':
    case 'arrowup':
      movePlayer(0, -1);
      break;
    case 'a':
    case 'arrowleft':
      movePlayer(-1, 0);
      break;
    case 's':
    case 'arrowdown':
      movePlayer(0, 1);
      break;
    case 'd':
    case 'arrowright':
      movePlayer(1, 0);
      break;
    case 'q':
      quitGame();
      break;
    default:
      // Ignore other keys
      break;
  }
});

initializeGame();