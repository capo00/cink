import { createVisualComponent, PropTypes, Utils } from "uu5g05";
import Config from "../../config";
import { HEIGHT, HEIGHT_XS, WIDTH, WIDTH_XS } from "./card-style";
import Tools from "../../tools";

const CardTable = createVisualComponent({
  displayName: Config.TAG + "CardTable",

  propTypes: {
    cards: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
      num: PropTypes.number,
      kind: PropTypes.string,
      render: PropTypes.func,
    }))),
    selectedCard: PropTypes.object,
  },

  defaultProps: {
    cards: [],
    selectedCard: undefined,
    columnCount: 8,
    rowCount: 4,
  },

  render(props) {
    const { cards, selectedCard, columnCount, rowCount, onClick } = props;

    const attrs = Utils.VisualComponent.getAttrs(props, Config.Css.css`
      display: grid;
      grid-template-columns: repeat(${columnCount}, ${WIDTH_XS + 4}px);
      grid-template-rows: repeat(${rowCount}, ${HEIGHT_XS + 4}px);
      justify-content: center;
      gap: 4px;

      ${Tools.getMinMediaQueries("m", `
        grid-template-columns: repeat(${columnCount}, ${WIDTH + 4}px);
        grid-template-rows: repeat(${rowCount}, ${HEIGHT + 4}px);
        gap: 8px;
      `)}
    `);

    const table = Array.from({ length: rowCount }, () => []);
    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < columnCount; j++) {
        table[i][j] = cards?.[i]?.[j] || null;
      }
    }

    return (
      <div {...attrs}>
        {table.map((row, i) => {
          return row.map((card, j) => {
            return card ? card.render({ selected: card === selectedCard, onClick }) : <span key={"" + i + j} />;
          });
        })}
      </div>
    );
  },
});

export default CardTable;
