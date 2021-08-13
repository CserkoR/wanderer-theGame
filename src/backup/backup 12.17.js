'use strict';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const statCanvas = document.getElementById('statCanvas');
const statCtx = statCanvas.getContext('2d');

import { mainMap } from "./maps.js"
//import { Boss } from "./boss.js";
import { Hero } from "./hero.js";
//import { Monster } from "./monster.js";
import {getMonstersCoords, monstersGetClass, monsterNumber, realBoss, realMonsterS} from "./mons-kord-creat.js"

canvas.width = 720 + 142;
canvas.height = 720 + 142;

statCanvas.width = 300;
statCanvas.height = 387;

// O~~~~~~~~~~~~~~  Betöltés  ~~~~~~~~~~~~~~O \\

window.onload = () => {
  const floor = document.getElementById('floor');
  const heroUp = document.getElementById('hero-up')
  const heroRight = document.getElementById('hero-right')
  const heroDown = document.getElementById('hero-down')
  const heroLeft = document.getElementById('hero-left')
  const wall = document.getElementById('wall')
  const pergamen = document.getElementById('pergamen')
  const boss = document.getElementById('boss')
  const skeleton = document.getElementById('skeleton')
  const doorOpen = document.getElementById('doorOpen')
  const doorClose = document.getElementById('doorClose')
  gameStart();
};

// O~~~~~~~~~~~~~~  Álandók  ~~~~~~~~~~~~~~O \\

const cellSize = 72;

const floor = document.getElementById('floor');
const heroUp = document.getElementById('hero-up')
const heroRight = document.getElementById('hero-right')
const heroDown = document.getElementById('hero-down')
const heroLeft = document.getElementById('hero-left')
const wall = document.getElementById('wall')
const boss = document.getElementById('boss')
const doorOpen = document.getElementById('doorOpen')
const doorClose = document.getElementById('doorClose')
const skeleton = document.getElementById('skeleton')

// O~~~~~~~~~~~~~~  Pálya Szintje  ~~~~~~~~~~~~~~O \\

let currentMapLevel = 0;

function nextLevel(){
  currentMapLevel+=1;
}

// O~~~~~~~~~~~~~~  Pálya renderelés  ~~~~~~~~~~~~~~O \\

function renderMap() {
  for (let i = 0; i < mainMap.length; i++) {
    for (let j = 0; j < mainMap[i].length; j++) {
      if (mainMap[i][j] === 0) {
        ctx.drawImage(floor, j * cellSize, i * cellSize);
      } else {
        ctx.drawImage(wall, j * cellSize, i * cellSize)
      }
    }
  }
}

// O~~~~~~~~~~~~~~  Játék Loop  ~~~~~~~~~~~~~~O \\

function gameStart(){
  nextLevel();
  getMonstersCoords();
  renderMap();
  monstersGetClass();
  getPercentHp();
  ctx.drawImage(doorClose, 72, 0)
  hpBar();
  ctx.drawImage(heroDown, realHero.x, realHero.y);

  statCtx.drawImage(pergamen, 0, 0);
  statistics();
}

// O~~~~~~~~~~~~~~  Játék ciklus  ~~~~~~~~~~~~~~O \\

function gameLoop(){
  renderMap();
  drawAllMonster();
  ctx.drawImage(doorClose, 72, 0)
  hpBar();
  isCellShared();
}

// O~~~~~~~~~~~~~~  Irányítás  ~~~~~~~~~~~~~~O \\

const input = {};

window.addEventListener('keyup', (event) => {
  input[event.key] = false;
});

window.addEventListener('keydown', (event) => {
  input[event.key] = true;
  if (input.ArrowDown === true && mainMap[Math.round(realHero.y / cellSize) + 1][Math.round(realHero.x / cellSize)] != 1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    realHero.y += cellSize;
    gameLoop();
    ctx.drawImage(heroDown, realHero.x, realHero.y);
  }
  if (input.ArrowUp === true && mainMap[Math.round(realHero.y / cellSize) - 1][Math.round(realHero.x / cellSize)] != 1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    realHero.y -= cellSize;
    gameLoop();
    ctx.drawImage(heroUp, realHero.x, realHero.y);
  }
  if (input.ArrowLeft === true && mainMap[Math.round(realHero.y / cellSize)][Math.round(realHero.x / cellSize) - 1] != 1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    realHero.x -= cellSize;
    gameLoop();
    ctx.drawImage(heroLeft, realHero.x, realHero.y);
  }
  if (input.ArrowRight === true && mainMap[Math.round(realHero.y / cellSize)][Math.round(realHero.x / cellSize) + 1] != 1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    realHero.x += cellSize;
    gameLoop();
    ctx.drawImage(heroRight, realHero.x, realHero.y);
  }
});

// // O~~~~~~~~~~~~~~  Monster koordináta kreálás  ~~~~~~~~~~~~~~O \\

// const monsterNumber = Math.floor(Math.random() * Math.round(4)) + 4;

// let monsterCoord = []

// function getMonstersCoords() {
//   for (let i = 0; i < monsterNumber;) {
//     monsterCoord[i] = { x: Math.floor(Math.random() * Math.round(11)) * cellSize, y: Math.floor(Math.random() * Math.round(11)) * cellSize };
//     if ((mainMap[Math.round(monsterCoord[i].y / cellSize)][Math.round(monsterCoord[i].x / cellSize)] != 1) &&
//       (realHero.x !== monsterCoord[i].x && realHero.y !== monsterCoord[i].y) &&
//       (realHero.x + cellSize !== monsterCoord[i].x && realHero.y + cellSize !== monsterCoord[i].y)) {
//       i++
//     } else {
//       rerollMonsterCoord(i)
//     }
//   }
// }

// function rerollMonsterCoord(index) {
//   monsterCoord[index] = { x: Math.floor(Math.random() * Math.round(11)) * cellSize, y: Math.floor(Math.random() * Math.round(11)) * cellSize };
// }

// // O~~~~~~~~~~~~~~  Monster Klasszosodás  ~~~~~~~~~~~~~~O \\

// let realMonsterS = [];

// for (let i = 0; i<monsterNumber-1; i++){
//   realMonsterS.push(i)
// }

// let realBoss = [0];

// function monstersGetClass() {
//   for (let i = 0; i < monsterNumber; i++) {
//     if (i < monsterNumber - 1) {
//       ctx.drawImage(skeleton, monsterCoord[i].x, monsterCoord[i].y);
//       magicDice();
//       realMonsterS[i] = new Monster(i,monsterCoord[i].x, monsterCoord[i].y, 2 * currentMapLevel*dice6, Math.round(currentMapLevel/2*dice6), currentMapLevel*dice6);
//     } else {
//       ctx.drawImage(boss, monsterCoord[i].x, monsterCoord[i].y);
//       magicDice();
//       realBoss[0] = new Boss(monsterCoord[i].x, monsterCoord[i].y, 2 * Math.round(currentMapLevel*dice6+dice6), Math.round(currentMapLevel/2*dice6+dice6/2), currentMapLevel*dice6+currentMapLevel);
//     }
//   }
// }

// O~~~~~~~~~~~~~~  A mágikus kocka  ~~~~~~~~~~~~~~O \\

let dice6 = Math.floor(Math.random() * 6 + 1);

function magicDice(){
  return dice6 = Math.floor(Math.random() * 6 + 1);
}


// O~~~~~~~~~~~~~~  Hős Statisztikák  ~~~~~~~~~~~~~~O \\

// constructor(x, y, hp, dp, sp, hasKey, level,isAlive)

let realHero = new Hero(72, 72, 20 + 3 * dice6, 2 * dice6, 5 + dice6, 0,1);

let maxHp = realHero.hp;

let percentHp = []

function getPercentHp() {
  for (let i = 0; i < maxHp; i++) {
    percentHp = Math.round(realHero.hp / maxHp * 100)
  }
}

// O~~~~~~~~~~~~~~  Szörnyek kirajzolás  ~~~~~~~~~~~~~~O \\

function drawAllMonster(){
  ctx.drawImage(boss, realBoss[0].x, realBoss[0].y)
  for(let i = 0; i < realMonsterS.length; i++){
    ctx.drawImage(skeleton, realMonsterS[i].x, realMonsterS[i].y);
  }
}

// O~~~~~~~~~~~~~~  Hero és Monster egy helyen  ~~~~~~~~~~~~~~O \\

function isCellShared() {
  if (realHero.x === realBoss[0].x && realHero.y === realBoss[0].y) {
    console.log("Boss: takarodj")
  } else {
    for (let i = 0; i < realMonsterS.length; i++) {
      if (realHero.x === realMonsterS[i].x && realHero.y === realMonsterS[i].y) {
        console.log(realMonsterS[i].name, ": Menj odébb!")
      }
    }
  }
};

// O~~~~~~~~~~~~~~  Pergament - Statisztikák  ~~~~~~~~~~~~~~O \\

function statistics() {
  statCtx.font = 'bold 35px Courier';
  statCtx.textAlign = 'center';
  statCtx.fillText(`🌟   ${realHero.level}`, statCanvas.width / 2, 90);
  statCtx.fillText(`❤️ ${realHero.hp}/${maxHp}`, statCanvas.width / 2, 135);
  statCtx.fillText(`🛡️   ${realHero.dp}`, statCanvas.width / 2, 180);
  statCtx.fillText(`⚔️   ${realHero.sp}`, statCanvas.width / 2, 225);
  statCtx.fillText(`🔑   ${realHero.getKey}`, statCanvas.width / 2, 270);
  statCtx.fillText(`☠️   ${monsterNumber}`, statCanvas.width / 2, 315);
}

// O~~~~~~~~~~~~~~  Élet csík  ~~~~~~~~~~~~~~O \\

function hpBar() {
  getPercentHp();
  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'crimson';
  ctx.fillRect(realHero.x + 5, realHero.y - 12, 60 * (percentHp / 100), 5);
  ctx.strokeRect(realHero.x + 5, realHero.y - 12, 60, 5);
}











export {realHero, ctx, magicDice, currentMapLevel, dice6};