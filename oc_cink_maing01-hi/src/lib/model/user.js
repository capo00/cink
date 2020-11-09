import Player from "./player";
import UserHand from "../component/user-hand";

function saveBank(bank) {
  localStorage.setItem("bank", bank);
}

class User extends Player {
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

  render({ onCardClick, onBankClick, state }) {
    return (
      <UserHand
        cards={this.cards}
        bank={this._bank}
        state={state}
        onCardClick={onCardClick}
        onBankClick={onBankClick}
      />
    );
  }
}

export default User;
