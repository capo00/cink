import CardOneHead from "../component/card-one-head";
import CardTwoHead, { ICONS } from "../component/card-two-head";

class Card {
  constructor(kind, num) {
    this.kind = kind;
    this.num = num;
  }

  render({ onClick, selected, type = 1 } = {}) {
    const Component = type === 1 ? CardOneHead : CardTwoHead;

    return (
      <Component
        key={this.kind + this.num}
        kind={this.kind}
        num={this.num}
        onClick={onClick ? () => onClick(this) : undefined}
        selected={selected}
      />
    );
  }
}

export { ICONS };
export default Card;
