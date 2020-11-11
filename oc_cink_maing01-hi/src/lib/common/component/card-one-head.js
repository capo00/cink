import { createVisualComponent, Utils } from "uu5g05";
import Config from "../../config";
import Tools from "../../tools";
import Card from "./card";
import { WIDTH, WIDTH_XS } from "./card-style";

// width x height = 3x5
const CardOneHead = createVisualComponent({
  displayName: Config.TAG + "CardOneHead",

  render(props) {
    const { kind, num } = props;
    const attrs = Utils.VisualComponent.getAttrs(props);

    return (
      <Card {...props} {...attrs}>
        <img
          width={WIDTH_XS}
          className={Config.Css.css`
            ${Tools.getMinMediaQueries("m", `width: ${WIDTH}px;`)}
          `}
          src={`assets/cards/${kind + num}.jpg`}
          alt={kind + num}
        />
      </Card>
    );
  },
});

export default CardOneHead;
