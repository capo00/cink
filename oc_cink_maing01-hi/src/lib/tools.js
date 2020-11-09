import { Utils } from "uu5g05";

const { ScreenSize } = Utils;

export default {
  getRandom(max, min = 0) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  getMinMediaQueries(screenSize, inner) {
    let result;

    switch (screenSize.toLowerCase()) {
      case "s":
        result = `@media screen and (min-width: ${ScreenSize.XS + 1}px) {${inner}}`;
        break;
      case "m":
        result = `@media screen and (min-width: ${ScreenSize.S + 1}px) {${inner}}`;
        break;
      case "l":
        result = `@media screen and (min-width: ${ScreenSize.M + 1}px) {${inner}}`;
        break;
      case "xl":
        result = `@media screen and (min-width: ${ScreenSize.L + 1}px) {${inner}}`;
        break;
    }

    return result;
  },
};
