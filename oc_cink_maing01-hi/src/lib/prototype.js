import { useState, useEffect, useRef, useWillMount } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import User from "./common/model/user";
import Opponent from "./common/model/opponent";
import Tools from "./tools";
import Round from "./cink/component/round";

const LOG = location.hostname === "localhost";

function log(...args) {
  LOG && console.log(...args);
}

const WIN_RATIO = 10;

function Game({ user, players, onEnd }) {
  const [playerIndex, setPlayerIndex] = useState(() => Tools.getRandom(3));
  const [looserCount, setLooserCount] = useState(0);

  return (
    <Round
      key={playerIndex}
      players={players}
      user={user}
      initialPlayerIndex={playerIndex}
      bet={1 + Math.floor(user.winCount / WIN_RATIO)}
      onEnd={(winner) => {
        if (user.bank <= 0) {
          user.updateData({ gameCount: 0, winCount: 0 });
          onEnd();
        } else {
          players.forEach((player, i) => {
            if (!player.bank) {
              log(`${player.name}: No bank. He is replaced.`, player.bank);
              players[i] = new Opponent(getRandomName());
              log(`${players[i].name}: New player replaced old one.`);
              setLooserCount(looserCount + 1);
            }
          });

          setPlayerIndex(playerIndex + 1 > 3 ? 0 : playerIndex + 1);
          winner === user && (user.winCount++);
          user.gameCount++;
          user.updateData({ gameCount: user.gameCount, winCount: user.winCount });
        }
      }}
    />
  );
}

const NAMES = [
  "Lenka", "Iva", "Tereza", "Lucie", "Jana", "Petra", "Ella", "Natálie", "Marie", "Klára",
  "Ondra", "Matěj", "Jakub", "Jan", "Petr", "Filip", "Karel", "Tomáš", "Jiří", "Pavel"
];

function getRandomName() {
  return NAMES[Tools.getRandom(NAMES.length - 1)];
}

function IncreaseBankButton({ onClick, user }) {
  function increaseBank() {
    user.resetBank();
    onClick();
  }

  return (
    <Uu5Elements.Button meaning="negative" size="xl" onClick={increaseBank} width="100%">
      Navýšit rozpočet
    </Uu5Elements.Button>
  );
}

export default function Prototype() {
  const user = new User("User");
  const players = [
    new Opponent(getRandomName()),
    new Opponent(getRandomName()),
    new Opponent(getRandomName()),
  ];

  const [num, setNum] = useState(0);

  function reload() {
    setNum(num + 1);
  }

  return (
    <div>
      {user.bank ? <Game key={num} user={user} players={players} onEnd={reload} /> : (
        <IncreaseBankButton onClick={reload} user={user} />
      )}
    </div>
  );
}
