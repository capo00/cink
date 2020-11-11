import { createVisualComponent, Utils, useState, useRef, Fragment } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Config from "../../config";
import Tools from "../../tools";
import CardTable from "./card-table";
import Bank from "./bank";

function ValueTooltip({ tooltip, value, ...props }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  return (
    <Fragment>
      <span className={Config.Css.css`cursor: default;`} ref={ref} onClick={() => setOpen(!open)}>
        {value}
      </span>
      {open && (
        <Uu5Elements.Popover
          className={Config.Css.css`padding: 8px;`}
          element={ref.current}
          onClose={() => setOpen(false)}
        >
          {tooltip}
        </Uu5Elements.Popover>
      )}
    </Fragment>
  );
}

const UserHand = createVisualComponent({
  displayName: Config.TAG + "UserHand",

  propTypes: {},

  defaultProps: {},

  render(props) {
    const { state, cards, bank, onBankClick, onCardClick, gameCount, winCount } = props;

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
        <div className={Config.Css.css`
          display: flex;
          justify-content: space-between;
          font-size: 32px;
          margin-bottom: 8px; color: ${fg};
        `}>
          <Bank onClick={handleOnBankClick}>{bank}</Bank>
          <span>
            <ValueTooltip value={winCount} tooltip="Počet výher" />/<ValueTooltip value={gameCount} tooltip="Počet her" />
          </span>
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
