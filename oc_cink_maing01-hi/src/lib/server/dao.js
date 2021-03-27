import Tools from "./tools";

class Dao {
  static PREFIX_ID = "ocCink-localServer-";

  static load(dbId) {
    let storage = localStorage.getItem(dbId);
    return storage ? JSON.parse(storage) : [];
  }

  static save(dbId, list) {
    localStorage.setItem(dbId, JSON.stringify(list));
  }

  static getById(id) {
    return this.list().find(item => item.id === id);
  }

  static list() {
    return Dao.load(this.ID);
  }

  static create(item) {
    item = JSON.parse(JSON.stringify(item));
    item.id = Tools.generateId();

    // TODO mock db indexes
    if (this.UNIQ) {
      this.UNIQ.forEach(key => {
        if (item[key] == null) throw new Error(`Parameter ${key} must be set.`);
      });
    }

    // TODO lock
    const list = this.list(this.ID);

    // TODO mock db indexes
    const uniq = ["id", ...(this.UNIQ ? this.UNIQ : [])];
    list.forEach(it => {
      if (uniq.map(key => it[key] === item[key]).indexOf(false) === -1) {
        throw new Error(`Parameters [${uniq.join(", ")}] must be unique.`);
      }
    });

    if (!this.isCreateValid || this.isCreateValid(item, list)) {
      list.push(item);
      this.save(this.ID, list);
      return item;
    }
  }

  static update(data) {
    const list = this.list(this.ID);
    const itemI = list.findIndex(({ id }) => id === data.id);
    list[itemI] = { ...list[itemI], ...data };
    this.save(this.ID, list);
  }
}

export class PlayerCinkDao extends Dao {
  static ID = Dao.PREFIX_ID + "playerCink";
  static UNIQ = ["playerId"];

  static isCreateValid(item, list) {
    if (list.filter(it => it.gameId === item.gameId).length > 4) {
      const msg = `Cannot be more than 4 players in a game.`;
      console.error(msg, item);
      throw new Error(msg);
    }

    return true;
  }

  static listByPlayer(playerId) {
    const list = this.list();
    const playerCink = list.find(({ playerId: player }) => player === playerId);
    return playerCink ? list.filter(({ gameId }) => gameId === playerCink.gameId) : [];
  }

  static listByGame(gameId) {
    const list = this.list();
    return list.filter(({ gameId: game }) => game === gameId) || [];
  }

  static findEmptyGame() {
    const list = this.list();

    const games = {};
    list.forEach(it => {
      games[it.gameId] = games[it.gameId] || [];
      games[it.gameId].push(it);
    });

    let result = [];
    for (let gameId in games) {
      if (games[gameId].length < 4) {
        result = games[gameId];
        break;
      }
    }

    return result;
  }

  static updateByPlayer({ playerId, ...data }) {
    const list = this.list();
    const playerCink = list.find(({ playerId: player }) => player === playerId);
    if (!playerCink) {
      const msg = `Player ${playerId} is not playing in any game.`;
      console.error(msg, { playerId, ...data });
      throw new Error(msg);
    }
    return this.update({ ...data, id: playerCink.id });
  }
}

export class PlayerDao extends Dao {
  static ID = Dao.PREFIX_ID + "player";

  static listByIdList(idList) {
    const list = this.list();
    return list.filter(({ id }) => idList.indexOf(id) > -1);
  }
}

export class CinkDao extends Dao {
  static ID = Dao.PREFIX_ID + "cink";
}
