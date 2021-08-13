import { magicDice} from "./hero.js"

//  ~~~~~~~>  16*16

const mapSize = 16;

// padló megcsinálása
function createGround() {
  let result = [];
  for (let i = 0; i < mapSize; i++) {
    result[i] = [];
    for (let j = 0; j < mapSize; j++) {
      let randomizer = magicDice(100)
      if (randomizer < 51){
        result[i][j] = 0;
      } else if (randomizer > 50 && randomizer < 76){
        result[i][j] = 1;
      } else if (randomizer >75 && randomizer < 101){
        result[i][j] = 2;
      }
    }
  }
  return result;
}

// körbe fal
function createBorder() {
  let map = createGround();
  for (let i = 0; i < map.length; i++) {
    if (map[0][i] < 3) {
      let randomizer = magicDice(100)
      if (randomizer < 51){
        map[0].splice(i, 1, 3);
      } else if (randomizer > 50 && randomizer < 71){
        map[0].splice(i, 1, 4);
      } else if (randomizer >70 && randomizer < 91){
        map[0].splice(i, 1, 5);
      } else if (randomizer >90 && randomizer < 101){
        map[0].splice(i, 1, 6);
      }
    }
    if (map[mapSize-1][i] <3) {
      let randomizer = magicDice(100)
      if (randomizer < 51){
        map[mapSize-1].splice(i, 1, 3);
      } else if (randomizer > 50 && randomizer < 71){
        map[mapSize-1].splice(i, 1, 4);
      } else if (randomizer >70 && randomizer < 91){
        map[mapSize-1].splice(i, 1, 5);
      } else if (randomizer >90 && randomizer < 101){
        map[mapSize-1].splice(i, 1, 6);
      }
    };
    if (map[i][0] <3) {
      let randomizer = magicDice(100)
      if (randomizer < 51){
        map[i].splice(0, 1, 3);
      } else if (randomizer > 50 && randomizer < 71){
        map[i].splice(0, 1, 4);
      } else if (randomizer >70 && randomizer < 91){
        map[i].splice(0, 1, 5);
      } else if (randomizer >90 && randomizer < 101){
        map[i].splice(0, 1, 6);
      }
    }
    if (map[i][mapSize-1] <3) {
      let randomizer = magicDice(100)
      if (randomizer < 51){
        map[i].splice(mapSize-1, 1, 3);
      } else if (randomizer > 50 && randomizer < 71){
        map[i].splice(mapSize-1, 1, 4);
      } else if (randomizer >70 && randomizer < 91){
        map[i].splice(mapSize-1, 1, 5);
      } else if (randomizer >90 && randomizer < 101){
        map[i].splice(mapSize-1, 1, 6);
      }
    }
  };
  return map;
};

let mainMap = createBorder();

function freshMap(){
  mainMap = createBorder();
}

  export { mainMap, freshMap };