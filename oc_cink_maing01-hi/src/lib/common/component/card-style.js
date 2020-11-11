import { createHoc } from "uu5g05";
import Config from "../../config";
import Tools from "../../tools";
import Card from "./card";

export const WIDTH = 56;
export const WIDTH_XS = 36;
export const HEIGHT = 91;
export const HEIGHT_XS = 59;

const WIDTH_RATIO = 8;
const HEIGHT_RATIO = 13;

// width x height = 3x5
const CardStyle = createHoc({

  displayName: Config.TAG + "CardStyle",

  component: Card,

  getProps({ size, sizeXs, ...props }) {
    const width = size ? size * WIDTH_RATIO : undefined;
    const height = size ? size * HEIGHT_RATIO : undefined;
    const widthXs = sizeXs ? sizeXs * WIDTH_RATIO : undefined;
    const heightXs = sizeXs ? sizeXs * HEIGHT_RATIO : undefined;

    const classNames = [
      Config.Css.css`
        width: ${widthXs || WIDTH_XS}px;
        height: ${heightXs || HEIGHT_XS}px;
        font-size: 15px;

        ${Tools.getMinMediaQueries("m", `
          width: ${width || WIDTH}px;
          height: ${height || HEIGHT}px;
          font-size: 1.5em;
        `)}
      `,
    ];
    props.className && classNames.push(props.className);

    return {
      ...props,
      className: classNames.join(" "),
    };
  },
});

export default CardStyle;
