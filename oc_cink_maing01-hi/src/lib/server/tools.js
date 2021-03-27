import { Utils } from "uu5g05";

export default {
  generateId(...args) {
    return Utils.String.generateId(...args);
  },

  getRandom(max, min = 0) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  async wait(sec) {
    return new Promise((resolve) => setTimeout(resolve, sec * 1000));
  },
};
