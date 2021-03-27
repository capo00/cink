import { Cink } from "./server/api";
import Tools from "./server/tools";

const JOIN_INTERVAL = 30; // in seconds

export default {
  async join(dtoIn) {
    let dtoOut;
    const now = new Date();
    while (new Date() - now < JOIN_INTERVAL * 1000) {
      dtoOut = await Cink.join(dtoIn);
      if (dtoOut.players.length === 4 || new Date() - now + 5 * 1000 >= JOIN_INTERVAL * 1000) break;
      await Tools.wait(5);
    }

    if (dtoOut?.players?.length !== 4) {
      dtoOut = await Cink.join({ ...dtoIn, force: true });
    }

    return dtoOut;
  },
};
