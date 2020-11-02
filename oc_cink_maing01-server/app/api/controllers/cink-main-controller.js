"use strict";
const CinkMainAbl = require("../../abl/cink-main-abl.js");

class CinkMainController {
  init(ucEnv) {
    return CinkMainAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new CinkMainController();
