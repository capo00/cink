import { useState, useEffect, useRef, useWillMount } from "uu5g05";
import Uu5Elements from "uu5g05-elements";
import User from "./model/user";
import Opponent from "./model/opponent";
import Tools from "./tools";
import Pack, { PACK_ONE } from "./model/pack";
import Desk from "./model/desk";
import Round from "./component/round";
import Config from "./config";

const LOG = location.hostname === "localhost";

function dealCards(players) {
  const pack = new Pack(PACK_ONE);
  return players.forEach(player => {
    for (let i = 0; i < 8; i++) {
      player.addCard(pack.removeRandomCard());
    }
  });
}

function log(...args) {
  LOG && console.log(...args);
}

// function Round({ user, players, initialPlayerIndex, onEnd }) {
//   const table = useRef(new Desk()).current;
//
//   const [playerIndex, setPlayerIndex] = useState(initialPlayerIndex);
//   const [winner, setWinner] = useState(null);
//
//   useWillMount(() => {
//     log(`Round: New round`, user, players, initialPlayerIndex);
//     [user, ...players].forEach((player, i) => {
//       table.increaseBank(player.decreaseBank());
//     });
//   });
//
//   function nextPlayer() {
//     let newPlayerIndex = playerIndex + 1;
//     setPlayerIndex(newPlayerIndex > 3 ? 0 : newPlayerIndex);
//   }
//
//   function nextRound() {
//     [user, ...players].forEach((player, i) => {
//       if (player === winner) {
//         if (winner.looser) {
//           // TODO
//           log(`${winner.name}: No bank for game, no winner.`, table.bank);
//         } else {
//           log(`${winner.name}: Winner.`, table.bank);
//           winner.increaseBank(table.bank);
//         }
//       } else {
//         winner.increaseBank(player.decreaseBank(player.cards.length));
//       }
//     });
//     onEnd();
//   }
//
//   function endRound(winner) {
//     setWinner(winner);
//     log(`${winner.name}: Winner.`);
//   }
//
//   function playCard(player, card) {
//     table.addCard(player.removeCard(card));
//
//     if (player.cards.length) {
//       nextPlayer();
//     } else {
//       endRound(player);
//     }
//   }
//
//   function playBank(player) {
//     table.increaseBank(player.decreaseBank());
//     nextPlayer();
//   }
//
//   useEffect(() => {
//     setTimeout(() => {
//       // playerIndex === 0 => user is playing => waiting on click from user
//       if (playerIndex !== 0) {
//         const activePlayer = players[playerIndex - 1];
//         const card = activePlayer.findAvailableCard(table.availableCards);
//
//         if (card) {
//           playCard(activePlayer, card);
//         } else {
//           playBank(activePlayer);
//         }
//       }
//     }, 1000);
//   }, [playerIndex]);
//
//   function userClick(card) {
//     if (table.isCardAvailable(card)) {
//       playCard(user, card);
//     } else {
//       console.warn("Cannot add this card to the table.", card);
//     }
//   }
//
//   function userBankClick() {
//     const availableCard = user.findAvailableCard(table.availableCards);
//     if (availableCard) {
//       console.warn("User has available card to play.", availableCard);
//     } else {
//       playBank(user);
//     }
//   }
//
//   return (
//     <div>
//       <div className={Config.Css.css`
//         display: grid;
//         grid-template-columns: repeat(3, 1fr);
//         grid-template-rows: 1fr;
//         gap: 8px;
//       `}>
//         {players.map((player, i) => (
//           player.render({ state: winner ? "winner" : (i + 1 === playerIndex ? "active" : null) })
//         ))}
//       </div>
//
//       {table.render()}
//
//       <div>
//         {user.render({
//           onCardClick: userClick,
//           onBankClick: userBankClick,
//           state: winner ? "winner" : (playerIndex === 0 ? "active" : null),
//         })}
//         {winner && (
//           <Uu5Elements.Button meaning="primary" size="xl" onClick={nextRound} width="100%">
//             Pokračovat
//           </Uu5Elements.Button>
//         )}
//       </div>
//     </div>
//   );
// }

const BANK = 20;

function loadBank() {
  let bank = localStorage.getItem("bank");
  if (bank) {
    bank = +bank;
  } else {
    // saveBank(BANK);
    bank = BANK;
  }
  return bank;
}

const NUMBERS = [7, 8, 9, 10, 11, 12, 13, 14];

function Game({ user, players, onEnd }) {
  const [playerIndex, setPlayerIndex] = useState(() => Tools.getRandom(3));
  dealCards([user, ...players]);

  return (
    <Round
      key={playerIndex}
      players={players}
      user={user}
      initialPlayerIndex={playerIndex}
      onEnd={() => {
        if (user.bank <= 0) {
          onEnd();
        } else {
          players.forEach((player, i) => {
            if (!player.bank) {
              log(`${player.name}: No bank. He is replaced.`, player.bank);
              players[i] = new Opponent(getRandomName(), BANK);
              log(`${players[i].name}: New player replaced old one.`);
            }
          });

          setPlayerIndex(playerIndex + 1 > 3 ? 0 : playerIndex + 1);
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
    user.increaseBank(BANK);
    onClick();
  }

  // TODO replace by g05
  return (
    <Uu5Elements.Button meaning="negative" size="xl" onClick={increaseBank} width="100%">
      Navýšit rozpočet
    </Uu5Elements.Button>
  )
}

export default function Prototype() {
  const user = new User("User", loadBank());
  const players = [
    new Opponent(getRandomName(), BANK),
    new Opponent(getRandomName(), BANK),
    new Opponent(getRandomName(), BANK),
  ];

  const [num, setNum] = useState(0);

  function reload() {
    setNum(num + 1);
  }

  return (
    <div>
      {user.bank ? <Game user={user} players={players} onEnd={reload} /> : (
        <IncreaseBankButton onClick={reload} user={user} />
      )}
    </div>
  );
}
