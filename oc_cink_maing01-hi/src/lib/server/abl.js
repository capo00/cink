import { Utils } from "uu5g05";
import { PlayerCinkDao, PlayerDao, CinkDao } from "./dao";
import Tools from "./tools";

class Pack {
  static generate(numbers) {
    const cards = [];

    ["d", "h", "s", "c"].forEach(kind => {
      numbers.forEach(num => cards.push([kind, num]));
    });

    return new Pack(cards);
  }

  constructor(cards) {
    this.cards = [...cards];
  }

  removeRandomCard(cards = this.cards) {
    const i = Tools.getRandom(cards.length - 1);
    const card = cards[i];
    cards.splice(i, 1);
    return card;
  }

  shuffle(pack) {
    pack = [...pack];
    const shuffledPack = [];

    while (pack.length) {
      const randomCard = this.removeRandomCard(pack);
      shuffledPack.push(randomCard);
    }

    return shuffledPack;
  }
}

class Cink {
  static join({ playerId, bet = 1, force }) {
    let playerObject;

    if (!playerId) {
      throw `PlayerId was not set.`;
    } else {
      playerObject = PlayerDao.getById(playerId);
      if (!playerObject) {
        throw `Player ${playerId} does not exist.`;
      }
    }

    // find game with playerId by playerCink.list
    let playerCinkList = PlayerCinkDao.listByPlayer(playerId);

    let gameId, activePlayerId, playerCinkId;
    if (playerCinkList.length) {
      // player is already playing
      gameId = playerCinkList[0].gameId;
      playerCinkId = playerCinkList.find(({ playerId: player }) => player === playerId).id;
    } else {
      // find game where players are waiting
      playerCinkList = PlayerCinkDao.findEmptyGame();

      if (playerCinkList.length) {
        gameId = playerCinkList[0].gameId;
      } else {
        const game = CinkDao.create({ activePlayerId: playerId, bet });
        gameId = game.id;
        activePlayerId = game.activePlayerId;
      }

      // TODO if exist player -> same as "player is already playing"
      const playerCinkObject = { playerId, gameId };
      const playerCink = PlayerCinkDao.create(playerCinkObject);
      playerCinkId = playerCink.id;
      playerCinkList.push(playerCinkObject);
    }

    if (force && playerCinkList.length < 4) {
      while (playerCinkList.length < 4) {
        const robotId = Utils.String.generateId();
        const robotCinkObject = { playerId: robotId, gameId, isRobot: true };
        PlayerCinkDao.create(robotCinkObject);
        playerCinkList.push(robotCinkObject);
      }
    }

    const playerList = PlayerDao.listByIdList(playerCinkList.map(({ playerId }) => playerId));
    let player, opponentList = [];
    playerCinkList.forEach(item => {
      const pl = playerList.find(p => p.id === item.playerId);

      if (pl) {
        if (item.playerId === playerId) {
          player = pl;
        } else {
          opponentList.push(pl);
        }
      } else {
        opponentList.push({ id: item.playerId, isRobot: true });
      }
    });

    if (playerCinkList.length === 4) {
      activePlayerId = activePlayerId || CinkDao.getById(gameId).activePlayerId;

      // shuffle pack
      const pack = Pack.generate([7, 8, 9, 10, 11, 12, 13, 14]);

      // set cards
      [player, ...opponentList].forEach(pl => {
        pl.cardList = [];
        for (let i = 0; i < 8; i++) {
          pl.cardList.push(pack.removeRandomCard());
        }
        PlayerCinkDao.updateByPlayer({ playerId: pl.id, cardList: pl.cardList });
      });
    }

    return {
      player,
      game: { id: gameId, activePlayerId, bet },
      playerList: opponentList.map(({ id, cardList, name, isRobot }) => {
        const playerData = { id };
        if (cardList) playerData.cardCount = cardList.length;
        isRobot ? (playerData.isRobot = true) : (playerData.name = name);
        return playerData;
      }),
    };
  }

  static get({ id, playerId }) {
    // check if playerId belongs to player (by IP?)

    //find game with id by game.get
    const gameObject = CinkDao.getById(id);
    if (!gameObject) {
      throw `Game "${id}" does not exist.`;
    }

    //find gamePlayer with id by playerCink.list
    const playerCinkList = PlayerCinkDao.listByGame(id);
    if (!playerCinkList.length) {
      throw `Player "${playerId}" is not playing.`;
    }

    //find players by player.list with player ids from playerCink
    const playerList = PlayerDao.listByIdList(playerCinkList.map(pg => pg.playerId));

    const playerObject = playerList.find(({ id: player }) => player === playerId);
    const playerPlayerCink = playerCinkList.find(({ playerId: player }) => player === playerId);

    //return proper dtoOut
    //player: { id, name, bank, cardList }
    //game: { id, bank, cardList, activePlayerId }
    //playerList: [{ id, name, cardCount, isRobot }]
    return {
      player: {
        id: playerObject.id,
        name: playerObject.name,
        bank: playerObject.bank,
        cardList: playerPlayerCink.cardList,
      },
      game: gameObject,
      playerList: playerList.filter(({ id: player }) => player !== playerId).map(({ id, name, isRobot }) => {
        const pgObject = playerCinkList.find(({ playerId: player }) => player === id);

        return {
          id, name, isRobot,
          cardCount: pgObject.cardList.length,
        }
      }),
    };
  }

  static play({ playerId, card }) {
    const dtoOut = {};

    // find game with playerId by playerCink.list
    const playerCink = PlayerCinkDao.listByPlayer(playerId);
    const playerCink0 = playerCink.find(pg => pg.playerId === playerId);

    if (!playerCink0) {
      // throw error if the game does not exist
      throw `Player ${playerId} is not joined to any game.`;
    } else if (playerCink.length < 4) {
      // throw error if the game contains less than 4 players
      throw `Player ${playerId} cannot play, game does not have enough players.`;
    } else {
      const game = CinkDao.getById(playerCink0.gameId);

      if (game.activePlayerId !== playerId) {
        // throw error if the player is not active
        throw `This is not turn of the Player ${playerId}.`;
      } else {
        const player = PlayerDao.getById(playerId);
        const gameUpdate = {};

        if (card) {
          // check if the player has the card
          const playerCard = playerCink0.cardList.find(([kind, num]) => kind === card[0] && num === card[1]);
          if (!playerCard) {
            throw `Card ${JSON.stringify(card)} is not in player's (${playerId}) hand.`;
          } else {
            const playerCardList = playerCink0.cardList;

            // remove card from player
            playerCardList.splice(playerCardList.indexOf(card), 1);
            player.cardList = playerCardList;

            // add card to game
            gameUpdate.cardList = [...(game.cardList || []), card];

            PlayerCinkDao.update({
              id: playerCink0.id,
              playerId: playerCink0.playerId,
              cardList: player.cardList,
            });
          }
        } else {
          // TODO check if the player cannot play
          const checkNoCard = false;
          if (checkNoCard) {
            throw `Player ${playerId} has correct card in hand.`;
          }

          // remove bank from player
          const newBank = player.bank - game.bet;
          if (newBank < 0) {
            gameUpdate.looserList = game.looserList || [];
            gameUpdate.looserList.push(playerId);
          } else {
            player.bank = newBank;
            PlayerDao.update({ id: playerId, bank: player.bank });
            gameUpdate.bank = game.bank + game.bet;
          }
        }

        // set next active player
        const activePlayerIndex = playerCink.findIndex(pg => pg.id === playerId);
        const newActivePlayerIndex = activePlayerIndex === 3 ? 0 : activePlayerIndex + 1;
        gameUpdate.activePlayerId = playerCink[newActivePlayerIndex].id;

        CinkDao.update({ ...gameUpdate, id: game.id });

        dtoOut.player = { id: playerId, name: player.name, bank: player.bank, cardList: player.cardList };
        dtoOut.game = { ...game, ...gameUpdate };
      }
    }

    return dtoOut;
  }
}

class Player {
  static create({ name, color, bank = 20 }) {
    return PlayerDao.create({ name, color, bank });
  }

  static get({ id }) {
    return PlayerDao.getById(id);
  }

  constructor(data = {}) {
    this.data = data;
    this._cardList = data.cardList || [];
  }

  get id() {
    return this.data.id;
  }

  get name() {
    return this.data.name;
  }

  toObject() {
    return { ...this.data, cardList: this.cards };
  }

  addCard(card) {
    this._cardList.push(card);
    return card;
  }

  get cards() {
    return this._cardList;
  }
}

export { Cink, Player };
