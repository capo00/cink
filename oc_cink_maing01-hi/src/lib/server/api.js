import { Cink as CinkAbl, Player as PlayerAbl } from "./abl";
import Tools from "./tools";

let Cink = {
  join(dtoIn = {}) {
    dtoIn = JSON.parse(JSON.stringify(dtoIn));
    return CinkAbl.join(dtoIn);
  },

  play(dtoIn = {}) {
    dtoIn = JSON.parse(JSON.stringify(dtoIn));
    return CinkAbl.play(dtoIn);
  },

  get(dtoIn = {}) {
    dtoIn = JSON.parse(JSON.stringify(dtoIn));
    return CinkAbl.get(dtoIn);
  },
};

let Player = {
  create(dtoIn = {}) {
    dtoIn = JSON.parse(JSON.stringify(dtoIn));
    return PlayerAbl.create(dtoIn);
  },
};

// test
console.log("tests start");

// clean
localStorage.removeItem("ocCink-localServer-player");
localStorage.removeItem("ocCink-localServer-playerCink");
localStorage.removeItem("ocCink-localServer-cink");

// test Player
const testName = "Test 1";

const playerCreateDtoOut = Player.create({ name: testName });
const playerCreateTest = {
  id: playerCreateDtoOut.id.length === 32,
  name: playerCreateDtoOut.name === testName,
  db: JSON.parse(localStorage.getItem("ocCink-localServer-player"))[0].id === playerCreateDtoOut.id,
};

if (Object.values(playerCreateTest).find(v => !v) != null) {
  console.error("playerCreateTest", playerCreateTest, playerCreateDtoOut);
}

// Cink.join test
const gameJoinDtoOut = Cink.join({ playerId: playerCreateDtoOut.id });
const gameJoinTest = {
  player: Object.keys(gameJoinDtoOut.player).length === 3
    && gameJoinDtoOut.player.id === playerCreateDtoOut.id
    && gameJoinDtoOut.player.name === playerCreateDtoOut.name
    && gameJoinDtoOut.player.bank === 20,
  game: Object.keys(gameJoinDtoOut.game).length === 3
    && gameJoinDtoOut.game.id.length === 32
    && gameJoinDtoOut.game.activePlayerId === playerCreateDtoOut.id
    && gameJoinDtoOut.game.bet === 1,
  playerList: gameJoinDtoOut.playerList.length === 0,
  db: JSON.parse(localStorage.getItem("ocCink-localServer-playerCink")).length === 1,
};

if (Object.values(gameJoinTest).find(v => !v) != null) {
  console.error("gameJoinTest", gameJoinTest, gameJoinDtoOut);
}

const playerCreateDtoOut2 = Player.create({ name: "Test 2" });

const gameJoinDtoOut2 = Cink.join({ playerId: playerCreateDtoOut2.id });
const gameJoinTest2 = {
  gameLength: Object.keys(gameJoinDtoOut2.game).length === 3,
  gameId: gameJoinDtoOut2.game.id.length === 32,
  gameActivePlayerId: gameJoinDtoOut2.game.activePlayerId === undefined,
  playerList: gameJoinDtoOut2.playerList.length === 1 && gameJoinDtoOut2.playerList[0].id === playerCreateDtoOut.id,
  db: JSON.parse(localStorage.getItem("ocCink-localServer-playerCink")).length === 2,
};

if (Object.values(gameJoinTest2).find(v => !v) != null) {
  console.error("gameJoinTest2", gameJoinTest2, gameJoinDtoOut2);
}

const playerCreateDtoOut3 = Player.create({ name: "Test 3" });
const playerCreateDtoOut4 = Player.create({ name: "Test 4" });

const gameJoinDtoOut3 = Cink.join({ playerId: playerCreateDtoOut3.id });
const gameJoinDtoOut4 = Cink.join({ playerId: playerCreateDtoOut4.id });
const gameJoinTest4 = {
  gameLength: Object.keys(gameJoinDtoOut4.game).length === 3,
  gameId: gameJoinDtoOut4.game.id.length === 32,
  gameActivePlayerId: gameJoinDtoOut4.game.activePlayerId === playerCreateDtoOut.id,
  playerList: gameJoinDtoOut4.playerList.length === 3 && gameJoinDtoOut4.playerList[0].id === playerCreateDtoOut.id,
  db: JSON.parse(localStorage.getItem("ocCink-localServer-playerCink")).length === 4,
};

if (Object.values(gameJoinTest4).find(v => !v) != null) {
  console.error("gameJoinTest4", gameJoinTest4, gameJoinDtoOut4);
}

const playerCreateDtoOut5 = Player.create({ name: "Test 5" });

const gameJoinDtoOut5 = Cink.join({ playerId: playerCreateDtoOut5.id });
const gameJoinTest5 = {
  gameActivePlayerId: gameJoinDtoOut5.game.activePlayerId === playerCreateDtoOut5.id,
  playerList: gameJoinDtoOut5.playerList.length === 0,
  db: JSON.parse(localStorage.getItem("ocCink-localServer-playerCink")).length === 5,
  gameId: gameJoinDtoOut5.game.id !== gameJoinDtoOut.game.id,
};

if (Object.values(gameJoinTest5).find(v => !v) != null) {
  console.error("gameJoinTest5", gameJoinTest5, gameJoinDtoOut5);
}

// Cink.get test
const gameGetDtoOutList = [gameJoinDtoOut, gameJoinDtoOut2, gameJoinDtoOut3, gameJoinDtoOut4].map((gameJoinDtoOut, i) => {
  const gameGetDtoOut = Cink.get({ id: gameJoinDtoOut.game.id, playerId: gameJoinDtoOut.player.id });

  const gameGetTest = {
    id: gameGetDtoOut.game.id === gameJoinDtoOut.game.id,
    playerId: gameGetDtoOut.player.id === gameJoinDtoOut.player.id,
    playerCardsSize: gameGetDtoOut.player.cardList.length === 8,
    gameActivePlayerId: gameGetDtoOut.game.activePlayerId === playerCreateDtoOut.id,
  };

  if (Object.values(gameGetTest).find(v => !v) != null) {
    console.error("gameGetTest" + (i + 1), gameGetTest, gameGetDtoOut);
  }

  return gameGetDtoOut;
});

// Cink.play test
const gamePlayDtoOut1 = Cink.play({ playerId: playerCreateDtoOut.id, card: gameGetDtoOutList[0].player.cardList[0] });
// TODO test whole dtoOut
const gamePlayTest1 = {
  playerId: gamePlayDtoOut1.player.id === playerCreateDtoOut.id,
  playerName: gamePlayDtoOut1.player.name === playerCreateDtoOut.name,
  playerBank: gamePlayDtoOut1.player.bank === playerCreateDtoOut.bank,
  playerCardListSize: gamePlayDtoOut1.player.cardList.length === 7,
};

if (Object.values(gamePlayTest1).find(v => !v) != null) {
  console.error("gamePlayTest1", gamePlayTest1, gamePlayDtoOut1);
}
console.log("tests end");

window.Server = { Cink, Player };

function generateMock(api) {
  const server = {};

  for (let k in api) {
    server[k] = async (...args) => {
      await Tools.wait(0.5);
      return api[k](...args);
    };
  }

  return server;
}

Cink = generateMock(Cink);
Player = generateMock(Player);

export { Cink, Player };
export default { Cink, Player };
