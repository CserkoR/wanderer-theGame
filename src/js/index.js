'use strict';

const canvasMap = document.getElementById('canvasMap');
const ctxMap = canvasMap.getContext('2d');

const canvasHero = document.getElementById('canvasHero');
const ctxHero = canvasHero.getContext('2d');

const canvasMonsters = document.getElementById('canvasMonsters');
const ctxMonsters = canvasMonsters.getContext('2d');

const canvasHeroStat = document.getElementById('canvasHeroStat');
const ctxHeroStat = canvasHeroStat.getContext('2d');

const canvasMonsterStat = document.getElementById('canvasMonsterStat');
const ctxMonsterStat = canvasMonsterStat.getContext('2d');

import { mainMap, freshMap } from "./maps.js"
import { realHero, statistics, hpBar, magicDice } from "./hero.js";
import { getMonstersCoords, monstersGetClass, realBoss, realMonsterS, emptyPergamen, forgetMonsterCoord, rerollMonsterNumber, monstersForgetClass, monsterNumber } from "./monster.js";

let canvasFullSize = 768;

canvasMap.width = canvasFullSize;
canvasMap.height = canvasFullSize;

canvasHero.width = canvasFullSize;
canvasHero.height = canvasFullSize;

canvasMonsters.width = canvasFullSize;
canvasMonsters.height = canvasFullSize;

canvasHeroStat.width = 300;
canvasHeroStat.height = 387;

canvasMonsterStat.width = 300;
canvasMonsterStat.height = 387;

// O~~~~~~~~~~~~~~  Betöltés  ~~~~~~~~~~~~~~O \\

window.onload = () => {
  const pergamen = document.getElementById('pergamen');
  const dungeonSet = document.getElementById('dungeonSet');
  const dungeonFloor = document.getElementById('dungeonFloor');
  const boss1 = document.getElementById('boss1');
  const boss2 = document.getElementById('boss2');
  const boss3 = document.getElementById('boss3');
  const boss4 = document.getElementById('boss4');
  const monster11 = document.getElementById('monster11');
  const monster12 = document.getElementById('monster12');
  const monster13 = document.getElementById('monster13');
  const monster14 = document.getElementById('monster14');
  const monster21 = document.getElementById('monster21');
  const monster22 = document.getElementById('monster22');
  const monster23 = document.getElementById('monster23');
  const monster24 = document.getElementById('monster24');
  const hero1 = document.getElementById('hero1');
  const hero2 = document.getElementById('hero2');
  const hero3 = document.getElementById('hero3');
  const hero4 = document.getElementById('hero4');
  const hero1right = document.getElementById('hero1right');
  const hero2right = document.getElementById('hero2right');
  const hero3right = document.getElementById('hero3right');
  const hero4right = document.getElementById('hero4right');
  const wallmid = document.getElementById('wallmid');
  const doorLeft = document.getElementById('doorLeft')
  const doorRight = document.getElementById('doorRight')
  const doorOpen = document.getElementById('doorOpen')
  const doorClose = document.getElementById('doorClose')
  const doorTop = document.getElementById('doorTop')
  gameStart();
};

// O~~~~~~~~~~~~~~  Pálya cellák mérete  ~~~~~~~~~~~~~~O \\

const cellSize = 48;

// O~~~~~~~~~~~~~~  Pálya Szintje  ~~~~~~~~~~~~~~O \\

let currentMapLevel = 1;

function nextLevel() {
  currentMapLevel += 1;
};

// O~~~~~~~~~~~~~~  Pálya renderelés  ~~~~~~~~~~~~~~O \\

let dungeonSetSize = 347 / 4

function renderMap() {
  for (let i = 0; i < mainMap.length; i++) {
    for (let j = 0; j < mainMap[i].length; j++) {
      if (mainMap[i][j] === 0) {
        ctxMap.drawImage(dungeonSet, 0, 0, dungeonSetSize, dungeonSetSize, j * cellSize, i * cellSize, cellSize, cellSize);
      } else if (mainMap[i][j] === 1) {
        ctxMap.drawImage(dungeonSet, 0, dungeonSetSize, dungeonSetSize, dungeonSetSize, j * cellSize, i * cellSize, cellSize, cellSize);
      } else if (mainMap[i][j] === 2) {
        ctxMap.drawImage(dungeonSet, 0, dungeonSetSize * 2, dungeonSetSize, dungeonSetSize, j * cellSize, i * cellSize, cellSize, cellSize);
      } else if (mainMap[i][j] === 3) {
        ctxMap.drawImage(dungeonSet, dungeonSetSize, 0, dungeonSetSize, dungeonSetSize, j * cellSize, i * cellSize, cellSize, cellSize);
      } else if (mainMap[i][j] === 6) {
        ctxMap.drawImage(dungeonSet, dungeonSetSize, dungeonSetSize, dungeonSetSize, dungeonSetSize, j * cellSize, i * cellSize, cellSize, cellSize);
      } else if (mainMap[i][j] === 5) {
        ctxMap.drawImage(dungeonSet, dungeonSetSize, dungeonSetSize * 2, dungeonSetSize, dungeonSetSize, j * cellSize, i * cellSize, cellSize, cellSize);
      } else if (mainMap[i][j] === 4) {
        ctxMap.drawImage(dungeonSet, dungeonSetSize, dungeonSetSize * 3, dungeonSetSize, dungeonSetSize, j * cellSize, i * cellSize, cellSize, cellSize);
      };


      // ctxMap.beginPath();
      // ctxMap.strokeStyle = 'black'
      // ctxMap.moveTo(j*cellSize, 0);
      // ctxMap.lineTo(j*cellSize, canvasFullSize);
      // ctxMap.stroke();

      // ctxMap.beginPath();
      // ctxMap.strokeStyle = 'black'
      // ctxMap.moveTo(0, j*cellSize);
      // ctxMap.lineTo(canvasFullSize, j*cellSize);
      // ctxMap.stroke();


    };
  };
};

// O~~~~~~~~~~~~~~  Játék Kezdés  ~~~~~~~~~~~~~~O \\

function gameStart() {
  renderMap();
  getMonstersCoords();
  monstersGetClass();
  ctxMap.drawImage(dungeonSet, dungeonSetSize * 2, 0, dungeonSetSize, dungeonSetSize, cellSize, 0, cellSize, cellSize);
  levelInfo();
  pauseTimer = false;

  statistics();

  emptyPergamen();
};

// O~~~~~~~~~~~~~~  Következő pálya  ~~~~~~~~~~~~~~O \\

function nextMap() {
  pauseTimer = true;
  moveCounting = 1;
  ctxMap.clearRect(0, 0, canvasMap.width, canvasMap.height);
  ctxMonsters.clearRect(0, 0, canvasMap.width, canvasMap.height);
  nextLevel();
  freshMap();
  realHero.heroLevelUp();
  monstersForgetClass();
  forgetMonsterCoord();
  rerollMonsterNumber();
  gameStart();
}

// O~~~~~~~~~~~~~~  Irányítás  ~~~~~~~~~~~~~~O \\

document.querySelector("html").onkeypress = function (e) {
  if (e.key == "w") if (mainMap[Math.round(realHero.y / cellSize) - 1][Math.round(realHero.x / cellSize)] <3 && realHero.isAlive === true && pauseTimer === false) {
    realHero.y -= cellSize;
  };
  if (e.key == "s") if (mainMap[Math.round(realHero.y / cellSize) + 1][Math.round(realHero.x / cellSize)] <3 && realHero.isAlive === true && pauseTimer === false) {
    realHero.y += cellSize;
  };
  if (e.key == "a") if (mainMap[Math.round(realHero.y / cellSize)][Math.round(realHero.x / cellSize) - 1] <3 && realHero.isAlive === true && pauseTimer === false) {
    heroRight = true;
    realHero.x -= cellSize;
  };
  if (e.key == "d") if (mainMap[Math.round(realHero.y / cellSize)][Math.round(realHero.x / cellSize) + 1] <3 && realHero.isAlive === true && pauseTimer === false) {
    heroRight = false;
    realHero.x += cellSize;
  };
  if (e.key == "w") if (realHero.hasKey === currentMapLevel && realBoss[0].isAlive === false && realHero.x === cellSize && realHero.y === cellSize) {
    nextMap()
  };
  if (e.key == " ") if (realHero.isAlive === false) {
    location.reload()
  }
};

// O~~~~~~~~~~~~~~  Kirajzolások  ~~~~~~~~~~~~~~O \\

let heroRight = false;

function drawBoss() {
  if (realBoss[0].isAlive === true) {
    //48
    //32*36 -> 64,72
    if (bossTimer === 0) {
      ctxMonsters.drawImage(boss1, realBoss[0].x-8, realBoss[0].y-28, 64,72);
      bossTimer += 1;
    } else if (bossTimer === 1) {
      ctxMonsters.drawImage(boss2, realBoss[0].x-8, realBoss[0].y-28, 64,72);
      bossTimer += 1;
    } else if (bossTimer === 2) {
      ctxMonsters.drawImage(boss3, realBoss[0].x-8, realBoss[0].y-28, 64,72);
      bossTimer += 1;
    } else if (bossTimer >= 3) {
      ctxMonsters.drawImage(boss4, realBoss[0].x-8, realBoss[0].y-28, 64,72);
      bossTimer = 0;
    };
  };
};

function drawMonsters() {
  for (let i = 0; i < monsterNumber - 1; i++) {
    if (realMonsterS[i].isAlive === true && i % 2 === 0) {
      if (monsterTimer[i] === 0) {
        ctxMonsters.drawImage(monster11, realMonsterS[i].x+8, realMonsterS[i].y-4, 32, 48);
        monsterTimer[i] += 1;
      } else if (monsterTimer[i] === 1) {
        ctxMonsters.drawImage(monster12, realMonsterS[i].x+8, realMonsterS[i].y-4, 32, 48);
        monsterTimer[i] += 1;
      } else if (monsterTimer[i] === 2) {
        ctxMonsters.drawImage(monster13, realMonsterS[i].x+8, realMonsterS[i].y-4, 32, 48);
        monsterTimer[i] += 1;
      } else if (monsterTimer[i] >= 3) {
        ctxMonsters.drawImage(monster14, realMonsterS[i].x+8, realMonsterS[i].y-4, 32, 48);
        monsterTimer[i] = 0;
      };
    };
    if (realMonsterS[i].isAlive === true && i % 2 === 1) {
    // 48
    //16*24 ->  32*48
      if (monsterTimer[i] === 0) {
        ctxMonsters.drawImage(monster21, realMonsterS[i].x+8, realMonsterS[i].y-4, 32, 48);
        monsterTimer[i] += 1;
      } else if (monsterTimer[i] === 1) {
        ctxMonsters.drawImage(monster22, realMonsterS[i].x+8, realMonsterS[i].y-4, 32, 48);
        monsterTimer[i] += 1;
      } else if (monsterTimer[i] === 2) {
        ctxMonsters.drawImage(monster23, realMonsterS[i].x+8, realMonsterS[i].y-4, 32, 48);
        monsterTimer[i] += 1;
      } else if (monsterTimer[i] >= 3) {
        ctxMonsters.drawImage(monster24, realMonsterS[i].x+8, realMonsterS[i].y-4, 32, 48);
        monsterTimer[i] = 0;
      };
    };
  };
};

function drawHero() {
  if (realHero.isAlive === true && heroRight === false) {
    //16*28
    if (heroTimer === 0) {
      ctxHero.drawImage(hero1, realHero.x+8, realHero.y-12, 32,56);
      heroTimer += 1;
    } else if (heroTimer === 1) {
      ctxHero.drawImage(hero2, realHero.x+8, realHero.y-12, 32,56);
      heroTimer += 1;
    } else if (heroTimer === 2) {
      ctxHero.drawImage(hero3, realHero.x+8, realHero.y-12, 32,56);
      heroTimer += 1;
    } else if (heroTimer >= 3) {
      ctxHero.drawImage(hero4, realHero.x+8, realHero.y-12, 32,56);
      heroTimer = 0;
    };
  };
  if (realHero.isAlive === true && heroRight === true) {
    //16*28
    if (heroTimer === 0) {
      ctxHero.drawImage(hero1right, realHero.x+8, realHero.y-12, 32,56);
      heroTimer += 1;
    } else if (heroTimer === 1) {
      ctxHero.drawImage(hero2right, realHero.x+8, realHero.y-12, 32,56);
      heroTimer += 1;
    } else if (heroTimer === 2) {
      ctxHero.drawImage(hero3right, realHero.x+8, realHero.y-12, 32,56);
      heroTimer += 1;
    } else if (heroTimer >= 3) {
      ctxHero.drawImage(hero4right, realHero.x+8, realHero.y-12, 32,56);
      heroTimer = 0;
    };
  };
};

// O~~~~~~~~~~~~~~  Hero és Monster egy helyen  ~~~~~~~~~~~~~~O \\

function isCellShared() {
  if (realHero.x === realBoss[0].x && realHero.y === realBoss[0].y && realBoss[0].isAlive === true) {
    realBoss[0].startMonsterFight();
  };
  for (let i = 0; i < monsterNumber - 1; i++) {
    if (realHero.x === realMonsterS[i].x && realHero.y === realMonsterS[i].y && realMonsterS[i].isAlive === true) {
      realMonsterS[i].startMonsterFight();
    };
  };
};

// O~~~~~~~~~~~~~~  Lépés számláló  ~~~~~~~~~~~~~~O \\

let moveCounting = 1;

function moveCount() {
  if (moveCounting >= 12) {
    for (let i = 0; i < monsterNumber - 1; i++) {
      if (realMonsterS[i].isAlive === true) {
        realMonsterS[i].moveMonster();
      };
    };
    if (realBoss[0].isAlive === true) {
      realBoss[0].moveMonster();
    };
    moveCounting = 1;
  };
  moveCounting +=1;
};

// O~~~~~~~~~~~~~~  Játék Vége  ~~~~~~~~~~~~~~O \\

function gameOver() {
  pauseTimer = true;
  ctxHero.clearRect(0, 0, canvasHero.width, canvasHero.height);
  statistics();
  ctxHero.fillStyle = 'black';
  ctxHero.fillRect(0, canvasHero.height / 2 - 80, canvasHero.width, 160);
  ctxHero.fillStyle = 'Crimson';
  ctxHero.font = '70px Times New Roman';
  ctxHero.textAlign = 'center';
  ctxHero.fillText(`YOU DIED`, canvasHero.width / 2, canvasHero.height / 2 + 18);
  ctxHero.fillStyle = 'gray';
  ctxHero.font = '20px Times New Roman';
  ctxHero.fillText(`Press 'Space' to start a new game`, canvasHero.width / 2, canvasHero.height / 2 + 45);
};

// O~~~~~~~~~~~~~~  Pálya kiírása  ~~~~~~~~~~~~~~O \\

function levelInfo() {
  ctxHero.fillStyle = 'black';
  ctxHero.fillRect(0, canvasMap.height / 2 - 60, canvasMap.width, 120);
  ctxHero.fillStyle = 'Orange';
  ctxHero.font = '50px Papyrus';
  ctxHero.textAlign = 'center';
  ctxHero.fillText(`Level ${currentMapLevel}`, canvasMap.width / 2, canvasMap.height / 2 + 12);
}

// O~~~~~~~~~~~~~~  Idő beállítás  ~~~~~~~~~~~~~~O \\

let pauseTimer = true;
let bossTimer = magicDice(4)-1;
let heroTimer = magicDice(4)-1;
let monsterTimer = [];

for (let i = 0; i <monsterNumber;i++){
  monsterTimer[i] = magicDice(4)-1
}

window.setInterval(function () {
  if (!pauseTimer) {
    ctxMonsters.clearRect(0, 0, canvasHero.width, canvasHero.height);
    ctxHero.clearRect(0, 0, canvasHero.width, canvasHero.height);
    moveCount();
    drawMonsters();
    drawBoss();
    drawHero();
    isCellShared()
    hpBar();
  };
}, 125);

/*
kép honnan x: 21 +22 + 10
kép honnan y: 370
kép meddig X: 22
kép meddig Y: 30
canvas honnan X: canvasMonsterStat.width/2
canvas honnan Y: 120
canvas hova X: cellSize
canvas hova Y: cellSize
*/


// O~~~~~~~~~~~~~~  Egyéb  ~~~~~~~~~~~~~~O \\

export { ctxMap, currentMapLevel, ctxHero, ctxMonsterStat, gameOver, ctxHeroStat, cellSize };