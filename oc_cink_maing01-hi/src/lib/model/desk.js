import DeskComponent from "../component/desk";
import { PACK_ONE } from "./pack";

class Desk {
  constructor() {
    this.cards = {};
    this.firstCard = null;
    this.availableCards = null;
    this.bank = 0;
  }

  isCardAvailable(card) {
    if (!Object.keys(this.cards).length) return true;
    return !!this.availableCards.find(c => c === card);
  }

  addCard(card) {
    let line;
    if (!this.firstCard) this.firstCard = card;

    if (this.cards[card.kind]) {
      line = this.cards[card.kind];
    } else {
      line = this.cards[card.kind] = Array(8).fill(null);
    }
    line[card.num - 7] = card;

    this._buildAvailableCards();
  }

  increaseBank(count = 1) {
    this.bank = this.bank + count;
    return this.bank;
  }

  render() {
    return (
      <DeskComponent cards={this.cards} selectedCard={this.firstCard} bank={this.bank} />
    )
  }

  _buildAvailableCards() {
    const availableCards = [];

    const currentKinds = Object.keys(this.cards);
    currentKinds.forEach(kind => {
      let firstCard = false;
      for (let i = 0; i < this.cards[kind].length; i++) {
        const card = this.cards[kind][i];
        if (card && !firstCard) {
          firstCard = card;
          if (card.num > 7) {
            const availableCard = PACK_ONE.find(c => c.num === card.num - 1 && c.kind === card.kind);
            availableCards.push(availableCard);
          }
        } else if (!card && firstCard) {
          const lastCard = this.cards[kind][i - 1];
          const availableCard = PACK_ONE.find(c => c.num === lastCard.num + 1 && c.kind === lastCard.kind);
          availableCards.push(availableCard);
          break;
        }
      }
    });

    const numCards = PACK_ONE.filter(c => c.num === this.firstCard.num && currentKinds.indexOf(c.kind) < 0);

    this.availableCards = [...availableCards, ...numCards];
  }
}

export default Desk;
