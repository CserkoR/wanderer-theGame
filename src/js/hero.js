import { currentMapLevel, ctxMap, ctxHeroStat, ctxHero} from "./index.js";
import { Monster, realBoss } from "./monster.js";

// O~~~~~~~~~~~~~~  Pálya cellák mérete  ~~~~~~~~~~~~~~O \\

const cellSize = 48;

// O~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  HERO CLASS  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~O \\

export class Hero extends Monster {

    constructor(x, y, hp, dp, sp, hasKey, killedMonsters, isAlive, maxHp = hp) {
        super(x, y, hp, dp, sp, hasKey, isAlive);
        this.killedMonsters = killedMonsters;
        this.name = "Hero";
        this.maxHp = maxHp;
    }

    heroAfterFight() {
      this.killedMonsters += 1;
        if (this.hasKey === currentMapLevel && realBoss[0].isAlive === false){
          ctxMap.drawImage(dungeonSet, 347/4*3,0,347/4,347/4, cellSize, 0,cellSize,cellSize);
        };
    };

    heroLevelUp() {
      this.maxHp += magicDice(6);
      this.dp += magicDice(6);
      this.sp += magicDice(6);
      getBigX();
      if ( bigX === 2 ){
          this.hp=this.maxHp;
      } else if ( bigX === 1){
          this.hp += Math.round(this.maxHp/4);
      } else{
          this.hp += Math.round(this.maxHp/10);
      } 
      if ( this.hp >= this.maxHp){
          this.hp = this.maxHp;
      };

    };
};

// O~~~~~~~~~~~~~~  A d6, a d10 és az X ~O~ mágikus kockák  ~~~~~~~~~~~~~~O \\

function magicDice(n) {
    return Math.floor(Math.random() * n + 1);
  };

let dice10 = Math.floor(Math.random() * 10 + 1);

function magicDice10() {
  dice10 = Math.floor(Math.random() * 10 + 1);
};

let bigX;

function getBigX() {
    magicDice10();
  if (dice10 >= 1 && dice10 < 6) {
    bigX = 0;
  } else if (dice10 >= 6 && dice10 < 10) {
    bigX = 1;
  } else {
    bigX = 2;
  };
};

// O~~~~~~~~~~~~~~  Hős megalkotás  ~~~~~~~~~~~~~~O \\

let realHero = new Hero(cellSize, cellSize, 20 + 3 * magicDice(6), 2 * magicDice(6), 5 + magicDice(6), 0, 0, true);

function getPercentHp(){
    return Math.round(realHero.hp / realHero.maxHp * 100);
};

// O~~~~~~~~~~~~~~  Pergament - Statisztikák  ~~~~~~~~~~~~~~O \\

function statistics() {
    ctxHeroStat.clearRect(0, 0, canvasHeroStat.width, canvasHeroStat.height);
    ctxHeroStat.drawImage(pergamen, 0, 0);
    ctxHeroStat.font = 'bold 35px Papyrus';
    ctxHeroStat.textAlign = 'center';
    ctxHeroStat.fillText(`❤️ ${realHero.hp}/${realHero.maxHp}`, canvasHeroStat.width / 2, 100);
    ctxHeroStat.fillText(`🛡️   ${realHero.dp}`, canvasHeroStat.width / 2, 145);
    ctxHeroStat.fillText(`⚔️   ${realHero.sp}`, canvasHeroStat.width / 2, 190);
    ctxHeroStat.fillText(`🔑   ${realHero.hasKey}`, canvasHeroStat.width / 2, 235);
    ctxHeroStat.fillText(`☠️   ${realHero.killedMonsters}`, canvasHeroStat.width / 2, 280);
  };
  
  // O~~~~~~~~~~~~~~  Élet csík  ~~~~~~~~~~~~~~O \\
  
  function hpBar() {
    ctxHero.fillStyle = 'crimson';
    if (realHero.isAlive) {
      ctxHero.fillRect(realHero.x + 6, realHero.y -4, 36 * (getPercentHp() / 100), 5);
    } else {
      ctxHero.fillRect(realHero.x + 6, realHero.y -4, 1, 5);
    }
    ctxHero.strokeStyle = 'black';
    ctxHero.strokeRect(realHero.x + 6, realHero.y -4, 36, 5);
  };


  export {realHero, statistics, hpBar, bigX, getBigX, magicDice}