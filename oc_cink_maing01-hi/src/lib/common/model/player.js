export const INITIAL_BANK = 20;

class Player {
  constructor(name, data = {}) {
    this.name = name;
    this._bank = data.bank || INITIAL_BANK;
    this.color = data.color;
    this.cardList = [];
    this.looser = false;
  }

  get cards() {
    return this.cardList;
  }

  addCard(card) {
    this.cardList.push(card);
    return card;
  }

  removeCard(card) {
    this.cardList.splice(this.cardList.findIndex(c => c === card), 1);
    return card;
  }

  clearCards() {
    this.cardList = [];
  }

  get bank() {
    return this._bank;
  }

  decreaseBank(count = 1) {
    this._bank = this._bank - count;
    if (this._bank < 0) {
      count = count + this._bank;
      this._bank = 0;
    }
    return count;
  }

  increaseBank(count = 1) {
    this._bank = this._bank + count;
    return count;
  }

  findAvailableCard(cards) {
    let card;

    if (cards) {
      for (let i = 0; i < this.cards.length; i++) {
        const availableCard = cards.find(c => c === this.cards[i]);
        if (availableCard) {
          card = availableCard;
          break;
        }
      }
    } else {
      card = this.cards[0];
    }

    return card;
  }

  play() {
    // waiting
  }
}

export default Player;
