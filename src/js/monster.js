import { currentMapLevel, ctxMonsterStat, gameOver, cellSize} from "./index.js";
import { mainMap } from "./maps.js";
import { realHero, statistics, bigX, getBigX, magicDice } from "./hero.js"

// O~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  MONSTER CLASS  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~O \\

export class Monster {

  constructor(x, y, hp, dp, sp, hasKey = 0, isAlive = true, i, isBoss = false) {
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.dp = dp;
    this.sp = sp;
    this.hasKey = hasKey;
    this.isAlive = isAlive;
    this.name = `Monster#${i}`;
    this.isBoss = isBoss;
  };

  // O~~~~~~~~~~~~~~  Monster mozgatás  ~~~~~~~~~~~~~~O \\

  moveMonster() {
    let dice4 = magicDice(4)
    for (let i = 0; i < 1;) {
      if (dice4 === 1 && mainMap[Math.floor(this.y / cellSize) + 1][Math.floor(this.x / cellSize)] <3) {
        this.y += cellSize;
        i++;
      } else if (dice4 === 2 && mainMap[Math.floor(this.y / cellSize) - 1][Math.floor(this.x / cellSize)] <3) {
        this.y -= cellSize;
        i++;
      } else if (dice4 === 3 && mainMap[Math.floor(this.y / cellSize)][Math.floor(this.x / cellSize) - 1] <3) {
        this.x -= cellSize;
        i++;
      } else if (dice4 === 4 && mainMap[Math.floor(this.y / cellSize)][Math.floor(this.x / cellSize) + 1] <3) {
        this.x += cellSize;
        i++;
      } else {
        dice4 = magicDice(4)
      };
    };
  };

  // O~~~~~~~~~~~~~~  Monster életben van e  ~~~~~~~~~~~~~~O \\

  isAliveCheck() {
    if (this.hp <= 0) {
      if (this.hasKey === 1) {
        realHero.hasKey += 1;
        this.hasKey -= 0;
      }
      this.isAlive = false;
      this.x = 0;
      this.y = 0;
      realHero.heroAfterFight();
    } else {
      realHero.isAlive = false;
      gameOver();
    };
  };

  // O~~~~~~~~~~~~~~  Monster Harc  ~~~~~~~~~~~~~~O \\

  startMonsterFight() {
    let fight = Math.round(Math.random());
    while (realHero.hp > 0 && this.hp > 0) {
      // hős támad
      if (realHero.hp > 0 && this.hp > 0 && fight === 0) {
        this.hp -= Math.round(((realHero.sp + (magicDice(3)+1) * 2) - this.dp) * 0.5);
        fight += 1;
      };
      // szörny támad
      if (realHero.hp > 0 && this.hp > 0 && fight === 1) {
        realHero.hp -= Math.round((this.sp + (magicDice(3)+1) * 2) - (realHero.dp /2));
        fight -= 1;
      };
    };
    this.isAliveCheck();
    statistics();
  }
}

// O~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  CLASS VÉGE  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~O \\

// O~~~~~~~~~~~~~~  Monster koordináta kreálás  ~~~~~~~~~~~~~~O \\

let monsterNumber = magicDice(5) + 20;

function rerollMonsterNumber() {
  monsterNumber = magicDice(5) + 20;
};

let monsterCoord = [];



function getMonstersCoords() {
  for (let i = 0; i < monsterNumber;) {
    monsterCoord[i] = { x: magicDice(14) * cellSize, y: magicDice(14) * cellSize };
    if (i === 0 && mainMap[Math.floor(monsterCoord[i].y / cellSize)][Math.floor(monsterCoord[i].x / cellSize)] < 3) {
      if (monsterCoord[i].x === cellSize && monsterCoord[i].y === cellSize) {
        i -= i;
        rerollMonsterCoord(i);
      } else if (monsterCoord[i].x === cellSize*2 && monsterCoord[i].y === cellSize) {
        i -= i;
        rerollMonsterCoord(i);
      } else if (monsterCoord[i].x === cellSize*2 && monsterCoord[i].y === cellSize*2) {
        i -= i;
        rerollMonsterCoord(i);
      } else if (monsterCoord[i].x === cellSize && monsterCoord[i].y === cellSize*2) {
        i -= i;
        rerollMonsterCoord(i);
      } else {
        i++;
      };
    } else if (i > 0 && mainMap[Math.floor(monsterCoord[i].y / cellSize)][Math.floor(monsterCoord[i].x / cellSize)] < 3) {
      for (let j = 0; j < monsterCoord.length - 1;) {
        if (monsterCoord[i].x === monsterCoord[j].x && monsterCoord[i].y === monsterCoord[j].y) {
          j -= j;
          rerollMonsterCoord(i);
        } else if (mainMap[Math.floor(monsterCoord[i].y / cellSize)][Math.floor(monsterCoord[i].x / cellSize)] > 2) {
          j -= j;
          rerollMonsterCoord(i);
        } else if (monsterCoord[i].x === cellSize && monsterCoord[i].y === cellSize) {
          j -= j;
          rerollMonsterCoord(i);
        } else if (monsterCoord[i].x === cellSize*2 && monsterCoord[i].y === cellSize) {
          j -= j;
          rerollMonsterCoord(i);
        } else if (monsterCoord[i].x === cellSize*2 && monsterCoord[i].y === cellSize*2) {
          j -= j;
          rerollMonsterCoord(i);
        } else if (monsterCoord[i].x === cellSize && monsterCoord[i].y === cellSize*2) {
          j -= j;
          rerollMonsterCoord(i);
        } else {
          j++;
        };
      };
      i++;
    } else {
      rerollMonsterCoord(i);
    };
  };
};

function rerollMonsterCoord(index) {
  monsterCoord[index] = { x: magicDice(10) * cellSize, y: magicDice(10) * cellSize };
};

function forgetMonsterCoord() {
  monsterCoord = [];
};

// O~~~~~~~~~~~~~~  Üres Monster papír  ~~~~~~~~~~~~~~O \\

function emptyPergamen() {
  ctxMonsterStat.clearRect(0, 0, canvasMonsterStat.width, canvasMonsterStat.height);
  ctxMonsterStat.drawImage(pergamen, 0, 0);
  ctxMonsterStat.font = 'bold 20px Papyrus';
  ctxMonsterStat.textAlign = 'center';
  ctxMonsterStat.fillText("Kattints egy", canvasMonsterStat.width / 2, canvasMonsterStat.height / 2 - 40);
  ctxMonsterStat.fillText("szörnyre, hogy", canvasMonsterStat.width / 2, canvasMonsterStat.height / 2);
  ctxMonsterStat.fillText("megvizsgáld!", canvasMonsterStat.width / 2, canvasMonsterStat.height / 2 + 40);
};

// O~~~~~~~~~~~~~~  Monster Klasszosodás  ~~~~~~~~~~~~~~O \\

let realMonsterS = [];

let realBoss = [0];

function monstersGetClass() {
  for (let i = 0; i < monsterNumber; i++) {
    if (i < monsterNumber - 2) {
      getBigX();
      realMonsterS[i] = new Monster(monsterCoord[i].x, monsterCoord[i].y, 2 * (currentMapLevel + bigX) * magicDice(3), Math.round((currentMapLevel + bigX) / 2 * magicDice(3)), (currentMapLevel + bigX) * magicDice(3), 0, true, i, false);
    } else if (i === monsterNumber - 2) {
      getBigX();
      realMonsterS[i] = new Monster(monsterCoord[i].x, monsterCoord[i].y, 2 * (currentMapLevel + bigX) * magicDice(3), Math.round((currentMapLevel + bigX) / 2 * magicDice(3)), (currentMapLevel + bigX) * magicDice(3), 1, true, i, false);
    } else {
      getBigX();
      realBoss[0] = new Monster(monsterCoord[i].x, monsterCoord[i].y, 2 * currentMapLevel * magicDice(3) + magicDice(3), Math.round((currentMapLevel + bigX) / 2 * magicDice(3) + magicDice(3) / 2), currentMapLevel * magicDice(3) + currentMapLevel, 0, true, "Boss", true);
    };
  };
};

function monstersForgetClass() {
  for (let i = 0; i < monsterNumber; i++) {
    if (i < monsterNumber - 2) {
      realMonsterS[i] = null;
    } else if (i === monsterNumber - 2) {
      realMonsterS[i] = null;
    } else {
      realBoss[0] = null;
    };
  };
};

// O~~~~~~~~~~~~~~  Monster Statok kattintással  ~~~~~~~~~~~~~~O \\

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  clickForStats(x, y);
};

canvasHero.addEventListener('mousedown', function (e) {
  getCursorPosition(canvasHero, e);
});

function clickForStats(x, y) {
  if (Math.floor(x / cellSize) === Math.floor(realBoss[0].x / cellSize) && Math.floor(y / cellSize) === Math.floor(realBoss[0].y / cellSize)) {
    ctxMonsterStat.clearRect(0, 0, canvasMonsterStat.width, canvasMonsterStat.height);
    ctxMonsterStat.font = 'bold 35px Papyrus';
    ctxMonsterStat.textAlign = 'center';
    ctxMonsterStat.drawImage(pergamen, 0, 0);
    ctxMonsterStat.fillText(`BOSS`, canvasMonsterStat.width / 2, 90);
    ctxMonsterStat.fillText(`❤️  ${realBoss[0].hp}`, canvasMonsterStat.width / 2, 180);
    ctxMonsterStat.fillText(`🛡️   ${realBoss[0].dp}`, canvasMonsterStat.width / 2, 225);
    ctxMonsterStat.fillText(`⚔️   ${realBoss[0].sp}`, canvasMonsterStat.width / 2, 270);
  } else {
    emptyPergamen();
  };
  for (let i = 0; i < monsterNumber - 1; i++) {
    if (Math.floor(x / cellSize) === Math.floor(realMonsterS[i].x / cellSize) && Math.floor(y / cellSize) === Math.floor(realMonsterS[i].y / cellSize)) {
      ctxMonsterStat.clearRect(0, 0, canvasMonsterStat.width, canvasMonsterStat.height);
      ctxMonsterStat.font = 'bold 35px Papyrus';
      ctxMonsterStat.textAlign = 'center';
      ctxMonsterStat.drawImage(pergamen, 0, 0);
      ctxMonsterStat.fillText(realMonsterS[i].name, canvasMonsterStat.width / 2, 90);
      ctxMonsterStat.fillText(`❤️  ${realMonsterS[i].hp}`, canvasMonsterStat.width / 2, 180);
      ctxMonsterStat.fillText(`🛡️   ${realMonsterS[i].dp}`, canvasMonsterStat.width / 2, 225);
      ctxMonsterStat.fillText(`⚔️   ${realMonsterS[i].sp}`, canvasMonsterStat.width / 2, 270);
    };
  };
};

// O~~~~~~~~~~~~~~  Exportok  ~~~~~~~~~~~~~~O \\


export { realBoss, realMonsterS, emptyPergamen, forgetMonsterCoord, rerollMonsterNumber, monstersForgetClass, monsterNumber, monstersGetClass, getMonstersCoords };
