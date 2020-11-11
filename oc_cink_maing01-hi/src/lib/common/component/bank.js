import { createVisualComponent, Utils } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Config from "../../config";

const Bank = createVisualComponent({
  displayName: Config.TAG + "Bank",

  propTypes: {},

  defaultProps: {
    size: 32,
  },

  render(props) {
    const { children, onClick, size, iconHidden } = props;

    const attrs = Utils.VisualComponent.getAttrs(props, Config.Css.css`
      font-size: ${size}px;
      cursor: ${onClick ? "pointer" : undefined};
      user-select: none;
    `);

    return (
      <span {...attrs} onClick={onClick}>
        {!iconHidden && <Uu5Elements.Icon icon="mdi-cash-multiple" />} {children} €
      </span>
    );
  },
});

export default Bank;
