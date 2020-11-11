import { createVisualComponent, Utils } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Config from "../../config";
import CardStyle from "./card-style";

const numMap = { 11: "J", 12: "Q", 13: "K", 14: "A" };

const numStyle = {
  position: "absolute",
  fontSize: "0.8em",
};

const ICONS = {
  d: "mdi-cards-diamond",
  h: "mdi-cards-heart",
  s: "mdi-cards-spade",
  c: "mdi-cards-club",
};

// width x height = 3x5
const CardTwoHead = createVisualComponent({
  displayName: Config.TAG + "CardTwoHead",

  render(props) {
    const { kind, num } = props;
    const char = numMap[num] || num;

    const attrs = Utils.VisualComponent.getAttrs(props, Config.Css.css`
      color: ${["d", "h"].includes(kind) ? Uu5Elements.ColorSwatches.red.c500 : Uu5Elements.ColorSwatches.black};
    `);

    return (
      <CardStyle {...props} {...attrs}>
        <Uu5Elements.Icon className={Config.Css.css`font-size: 2em;`} icon={ICONS[kind]} />
        <span className={Config.Css.css({ ...numStyle, top: 4, left: 4 })}>{char}</span>
        <span className={Config.Css.css({ ...numStyle, bottom: 4, right: 4 })}>{char}</span>
      </CardStyle>
    );
  },
});

export { ICONS };

export default CardTwoHead;
