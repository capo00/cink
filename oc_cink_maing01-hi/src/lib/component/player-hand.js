import { createVisualComponent, Utils, useScreenSize, Fragment } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Config from "../config";
import Bank from "./bank";
import CardPack from "./card-pack";

const PlayerHand = createVisualComponent({
  displayName: Config.TAG + "PlayerHand",

  propTypes: {},

  defaultProps: {},

  render(props) {
    const { name, state, cardCount, bank } = props;
    const screenSize = useScreenSize();

    let meaning, significance;
    switch (state) {
      case "active":
        meaning = "primary";
        significance = "highlighted";
        break;
      case "winner":
        meaning = "warning";
        significance = "highlighted";
        break;
    }

    let bankSize, padding;
    if (["xs", "s"].indexOf(screenSize) > -1) {
      bankSize = 15;
      padding = 2;
    } else {
      padding = 8;
    }

    const attrs = Utils.VisualComponent.getAttrs(props, Config.Css.css({
      display: "grid",
      gap: 4,
      gridTemplateColumns: "1fr 1fr",
      padding,
    }));

    return (
      <Uu5Elements.Card {...attrs} meaning={meaning} significance={significance}>
        <div className={Config.Css.css`font-size: ${bankSize ? undefined : "32px"}; grid-column: 1 / 2; grid-row: 1;`}>
          {name}
        </div>
        <CardPack className={Config.Css.css`grid-column: 2; grid-row: 1 / 3; justify-self: end;`} count={cardCount} />
        <Bank size={bankSize} className={Config.Css.css`grid-column: 1 / 2; grid-row: 2;`}>{bank}</Bank>
      </Uu5Elements.Card>
    );
  },
});

export default PlayerHand;
