const app = document.getElementById("app");

const galMessages = [
  "え、今日も来たじゃ〜ん🤣💕",
  "ビジュ良すぎ案件🫶✨",
  "まぢ今日も盛ってこ💖",
  "ガチえらいんだけど🥹💕",
  "その調子で優勝しよ〜🤣",
  "1問だけでも勝ち✌️✨",
  "うちら今日も最強じゃん💅",
  "まぢテンアゲなんだけど💕",
  "来てくれてあざます🫶",
  "ノリでいこノリで🤣"
];

const customers = [
  "🐰 ぴょんみ",
  "🐱 にゃみ",
  "🐻 くまち",
  "🦊 きつねぴ",
  "🐼 ぱんだち"
];

const goodMessages = [
  "え、天才🤣💕",
  "優勝〜〜〜💖",
  "ガチで才能ある🫶",
  "その調子すぎる🤣",
  "盛れてる盛れてる✨",
  "つよ🤣💕",
  "センスしかない💅",
  "最高なんだけど🥹",
  "神です👏💕",
  "まぢナイス〜🩷"
];

const badMessages = [
  "焦げたww🤣🍞",
  "逆におもろい🤣💕",
  "ドンマイすぎる😂",
  "ま、次いこ🫶",
  "惜し〜〜🤣",
  "ノーカンノーカン💖",
  "気にしな〜い✨",
  "あるある🤣",
  "まだ始まったばっか💕",
  "つぎ勝てばOK✌️"
];

let berry = 0;
let bakedBreads = [];

async function showShop() {

  const response = await fetch("words.json");
  const words = await response.json();

  const word =
    words[Math.floor(Math.random() * words.length)];

  const wrongWords = words
    .filter(w => w.id !== word.id)
    .sort(() => Math.random() - 0.5);

  const choices = [
    word.japanese,
    wrongWords[0].japanese,
    wrongWords[1].japanese,
    wrongWords[2].japanese
  ].sort(() => Math.random() - 0.5);

  const gal =
    galMessages[
      Math.floor(Math.random() * galMessages.length)
    ];

  const customer =
    customers[
      Math.floor(Math.random() * customers.length)
    ];

  app.innerHTML = `
    <div class="title-box">

      <div class="mini">
        🍓 Berry ${berry}
      </div>

      <h1>まぢパン。</h1>

      <p class="sub">
        GAL BAKERY 💅🥐
      </p>

      <div class="gal-talk">
        ${gal}
      </div>

      <div
        style="
          font-size:28px;
          margin-top:20px;
          margin-bottom:10px;
        "
      >
        ${customer}
      </div>

      <div
        style="
          font-size:26px;
          font-weight:bold;
          margin-bottom:24px;
        "
      >
        "${word.english}, please!"
      </div>

      <div
        style="
          font-size:14px;
          margin-bottom:10px;
        "
      >
        🥐 Collection
      </div>

      <div
        style="
          min-height:40px;
          font-size:30px;
          margin-bottom:24px;
        "
      >
        ${bakedBreads.join(" ")}
      </div>

      <div id="buttons"></div>

    </div>
  `;

  const buttons = document.getElementById("buttons");

  choices.forEach(choice => {

    const button = document.createElement("button");

    button.textContent = choice;

    button.style.marginBottom = "12px";

    button.onclick = () => {

      if (choice === word.japanese) {

        berry += 10;

        const breads = [
          "🥐",
          "🥖",
          "🍞",
          "🥯",
          "🥨"
        ];

        const bread =
          breads[
            Math.floor(Math.random() * breads.length)
          ];

        bakedBreads.push(bread);

        const msg =
          goodMessages[
            Math.floor(Math.random() * goodMessages.length)
          ];

        alert(`💖 ${msg}\n\n+10 Berry\n${bread} GET✨`);

      } else {

        const msg =
          badMessages[
            Math.floor(Math.random() * badMessages.length)
          ];

        alert(`${msg}\n\n正解：${word.japanese}`);

      }

      showShop();

    };

    buttons.appendChild(button);

  });

}

document
  .getElementById("startButton")
  .addEventListener("click", showShop);