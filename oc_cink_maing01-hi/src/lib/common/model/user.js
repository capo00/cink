import Player, { INITIAL_BANK } from "./player";
import UserHand from "../component/user-hand";

const DATA_KEY = "ocCinkUserData";

function loadData() {
  let userData = localStorage.getItem(DATA_KEY);
  if (userData) {
    userData = JSON.parse(userData);
  } else {
    // backward compatibility
    const bank = localStorage.getItem("bank");
    userData = { bank: bank ? +bank : INITIAL_BANK };
  }
  return userData;
}

function saveData(data) {
  const storeData = loadData();
  localStorage.setItem(DATA_KEY, JSON.stringify({ ...storeData, ...data }));
}

function saveBank(bank) {
  saveData({ bank });
}

class User extends Player {
  constructor(name, data) {
    data = data || loadData();
    super(name, data);

    this.winCount = data.winCount || 0;
    this.gameCount = data.gameCount || 0;
  }

  addCard(card) {
    super.addCard(card);
    this.cardList = this.cards.sort((card1, card2) => {
      if (card1.kind < card2.kind) return -1;
      if (card1.kind > card2.kind) return 1;

      if (card1.num < card2.num) return -1;
      if (card1.num > card2.num) return 1;

      return 0;
    });
  }

  get cards() {
    return super.cards;
  }

  decreaseBank(count) {
    const r = super.decreaseBank(count);
    saveBank(this._bank);
    return r;
  }

  increaseBank(count) {
    const r = super.increaseBank(count);
    saveBank(this._bank);
    return r;
  }

  resetBank() {
    this._bank = INITIAL_BANK;
  }

  updateData(data) {
    saveData(data);
    data.gameCount !== undefined && (this.gameCount = data.gameCount);
    data.winCount !== undefined && (this.winCount = data.winCount);
  }

  render({ onCardClick, onBankClick, state }) {
    return (
      <UserHand
        cards={this.cards}
        bank={this._bank}
        state={state}
        onCardClick={onCardClick}
        onBankClick={onBankClick}

        gameCount={this.gameCount}
        winCount={this.winCount}
      />
    );
  }
}

export default User;
