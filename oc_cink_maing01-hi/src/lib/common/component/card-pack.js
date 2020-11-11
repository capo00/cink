import { createVisualComponent, Utils } from "uu5g05";
import Config from "../../config";
import CardBack from "./card-back";

const CardPack = createVisualComponent({
  displayName: Config.TAG + "CardPack",

  propTypes: {},

  defaultProps: {
    count: 1,
    overlayLeft: 0,
    onClick: undefined,
  },

  render(props) {
    const { count, overlayLeft, onClick } = props;

    let cards = [];
    if (overlayLeft) {
      for (let i = 0; i < count; i++) {
        cards.push(
          <CardBack key={i} onClick={onClick ? () => onClick(i) : undefined} overlayLeft={overlayLeft}>
            {count}
          </CardBack>
        );
      }
    } else {
      cards = (
        <CardBack onClick={onClick ? () => onClick() : undefined} overlayLeft={overlayLeft}>
          {count}
        </CardBack>
      );
    }

    const attrs = Utils.VisualComponent.getAttrs(props);

    return (
      <span {...attrs}>
        {cards}
      </span>
    );
  },
});

export default CardPack;
