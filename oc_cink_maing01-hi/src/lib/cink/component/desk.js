import { createVisualComponent, Utils } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Config from "../../config";
import Tools from "../../tools";
import CardTable from "../../common/component/card-table";
import Bank from "../../common/component/bank";

const Desk = createVisualComponent({
  displayName: Config.TAG + "Desk",

  propTypes: {},

  defaultProps: {},

  render(props) {
    const { cards, selectedCard, bank } = props;

    const attrs = Utils.VisualComponent.getAttrs(props, Config.Css.css`
      padding: 2px 4px;
      ${Tools.getMinMediaQueries("m", `
        padding: 8px;
      `)}
    `);

    const cardMatrix = Object.keys(cards).map(kind => (
      cards[kind]
    ));

    return (
      <Uu5Elements.Card {...attrs} meaning="positive" significance="highlighted">
        <div className={Config.Css.css`margin-bottom: 4px; color: #fff;`}>
          <Bank>{bank}</Bank>
        </div>
        <CardTable cards={cardMatrix} selectedCard={selectedCard} />
      </Uu5Elements.Card>
    );
  },
});

export default Desk;
