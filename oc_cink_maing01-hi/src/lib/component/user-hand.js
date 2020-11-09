import { createVisualComponent, Utils } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Config from "../config";
import Tools from "../tools";
import CardTable from "./card-table";
import Bank from "./bank";

const UserHand = createVisualComponent({
  displayName: Config.TAG + "UserHand",

  propTypes: {},

  defaultProps: {},

  render(props) {
    const { state, cards, bank, onBankClick, onCardClick } = props;

    // TODO fg after fix in uu5 Card
    let meaning, handleOnBankClick, handleOnCardClick, significance, fg;
    switch (state) {
      case "active":
        meaning = "primary";
        significance = "highlighted";
        handleOnBankClick = onBankClick;
        handleOnCardClick = onCardClick;
        fg = "#fff";
        break;
      case "winner":
        meaning = "warning";
        significance = "highlighted";
        break;
    }

    const attrs = Utils.VisualComponent.getAttrs(props, Config.Css.css`
      padding: 2px 4px;
      ${Tools.getMinMediaQueries("m", `
        padding: 8px;
      `)}
    `);

    return (
      <Uu5Elements.Card {...attrs} meaning={meaning} significance={significance}>
        <div className={Config.Css.css`margin-bottom: 8px; color: ${fg};`}>
          <Bank onClick={handleOnBankClick}>{bank}</Bank>
        </div>
        <CardTable
          cards={[cards]}
          onClick={handleOnCardClick}
          rowCount={1}
        />
      </Uu5Elements.Card>
    );
  },
});

export default UserHand;
