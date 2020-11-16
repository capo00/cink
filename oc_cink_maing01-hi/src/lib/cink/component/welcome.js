import { createVisualComponent, Utils } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import Config from "../../config";

const Welcome = createVisualComponent({
  displayName: Config.TAG + "Welcome",

  propTypes: {},

  defaultProps: {},

  render(props) {
    const { onPlay, onSetting } = props;

    const attrs = Utils.VisualComponent.getAttrs(props, Config.Css.css`
      height: 100vh;
      display: grid;
      grid-template-rows: 48px 48px;
      align-items: center;
      align-content: center;
      row-gap: 32px;
      padding: 16px;
    `);

    return (
      <div {...attrs}>
        <Uu5Elements.Button size="xl" onClick={onPlay} meaning="primary" significance="highlighted">
          Hraj
        </Uu5Elements.Button>
        <Uu5Elements.Button size="xl" onClick={onSetting} meaning="primary">
          Nastavení
        </Uu5Elements.Button>
      </div>
    );
  },
});

export default Welcome;
