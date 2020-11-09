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
    const { cards, selectedCard, bank } = props;

    const attrs = Utils.VisualComponent.getAttrs(props, Config.Css.css`
      padding: 2px;
      ${Tools.getMinMediaQueries("m", `
        padding: 8px;
      `)}
    `);

    const cardMatrix = Object.keys(cards).map(kind => (
      cards[kind]
    ));

    return (
      <Uu5Elements.Card {...attrs} meaning="positive" significance="highlighted">
        <Bank>{bank}</Bank>
        <CardTable cards={cardMatrix} selectedCard={selectedCard} />
      </Uu5Elements.Card>
    );
  },
});

export default UserHand;
