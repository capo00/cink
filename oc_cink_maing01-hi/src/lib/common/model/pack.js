import Card, { ICONS } from "./card";
import Tools from "../../tools";

function generatePack(numbers) {
  const pack = [];

  Object.keys(ICONS).forEach(kind => {
    numbers.forEach(num => pack.push(new Card(kind, num)));
  });

  return pack;
}

const PACK_ONE = Object.freeze(generatePack([7, 8, 9, 10, 11, 12, 13, 14]));

class Pack {
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

export { PACK_ONE };
export default Pack;
