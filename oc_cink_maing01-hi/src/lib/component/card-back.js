import { createHoc } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Config from "../config";
import CardStyle, { WIDTH, WIDTH_XS } from "./card-style";
import Tools from "../tools";

const CYAN = Uu5Elements.ColorSwatches.cyan;

// width x height = 3x5
const CardBack = createHoc({
  displayName: Config.TAG + "CardBack",

  defaultProps: {
    overlayLeft: 8,
    sizeXs: 3,
  },

  component: CardStyle,

  getProps({ className, overlayLeft, ...props }) {
    const classNames = [
      Config.Css.css`
        background: radial-gradient(circle, ${CYAN.c900} 0%, ${CYAN.c500} 100%);
        color: #fff;

        & + & {
          margin: 4px 0 4px -${WIDTH_XS - overlayLeft}px;
        }

        ${Tools.getMinMediaQueries("m", `
          & + & {
            margin: 4px 0 4px -${WIDTH - overlayLeft}px;
          }
        `)}
      `
    ];
    props.className && classNames.push(props.className);

    return {
      ...props,
      className: classNames.join(" "),
    };
  },
});

export default CardBack;
