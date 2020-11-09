import { createVisualComponent, Utils } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Config from "../config";

const Card = createVisualComponent({
  displayName: Config.TAG + "Card",

  render(props) {
    const { children, background, onClick, selected } = props;

    const attrs = Utils.VisualComponent.getAttrs(props, Config.Css.css`
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;

      cursor: ${onClick ? "pointer" : undefined};
      border: ${selected ? "2px solid black" : undefined};
    `);

    attrs.mainAttrs = attrs.mainAttrs || {};
    attrs.mainAttrs.onClick = onClick;

    return (
      <Uu5Elements.Card {...attrs} background={background}>
        {children}
      </Uu5Elements.Card>
    );
  },
});

export default Card;
