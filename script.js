const app = document.getElementById("app");

const SAVE_KEY = "majipan_save_v1";

let bakedBreads = [];
let berry = 0;

const galLines = [
  "え、今日も来たじゃ〜ん🤣💕",
  "ガチ助かるんだけど〜🩷",
  "今日ビジュ良くない？✨",
  "パン焼いてこ〜🥐💅",
  "優勝すぎる😂💕",
  "まぢ神〜！！✨",
  "それ盛れてる〜🤣🩷"
];

const customers = [
  "🐰 うさぎちゃん",
  "🐻 くまちゃん",
  "🐱 ねこちゃん",
  "🦊 きつねちゃん",
  "🐼 パンダちゃん",
  "🐹 ハムちゃん",
  "🐶 わんちゃん"
];

const normalBreads = [
  "🥖",
  "🍞",
  "🥐",
  "🥯",
  "🥨"
];

const rareBreads = [
  "🌈🍞",
  "👑🥯",
  "💎🥐",
  "✨🥖",
  "🦄🥨"
];

const gachaBreads = [
  "🍓🥐",
  "🍫🍞",
  "🎀🥯",
  "🌈🥨",
  "💎🍩",
  "👑🥐"
];

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function loadGame() {
  const saved = localStorage.getItem(SAVE_KEY);

  if (!saved) {
    return;
  }

  try {
    const data = JSON.parse(saved);

    bakedBreads = data.bakedBreads || [];
    berry = data.berry || 0;

  } catch (error) {
    bakedBreads = [];
    berry = 0;
  }
}

function saveGame() {
  const data = {
    bakedBreads,
    berry
  };

  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

function resetGame() {
  const ok = confirm("データをリセットする？");

  if (!ok) {
    return;
  }

  bakedBreads = [];
  berry = 0;
  localStorage.removeItem(SAVE_KEY);

  showTitle();
}

function showTitle() {
  app.innerHTML = `
<div class="title-box">

  <div class="mini">
    💖✨ WELCOME ✨💖
  </div>

  <h1>まぢパン。</h1>

  <p class="sub">
    GAL BAKERY 💅🥐
  </p>

  <div class="gal-talk">
    「${randomItem(galLines)}」
  </div>

  <div class="mini">
    🍓 Berry：${berry}
  </div>

  <button id="startButton">
    🩷 START 🩷
  </button>

  <button id="gachaButton" style="margin-top:12px;background:#8f5cff;">
    🎁 ガチャ 30 Berry
  </button>

  <button id="resetButton" style="margin-top:12px;background:#999;">
    データリセット
  </button>

</div>
`;

  document
    .getElementById("startButton")
    .addEventListener("click", showShop);

  document
    .getElementById("gachaButton")
    .addEventListener("click", playGacha);

  document
    .getElementById("resetButton")
    .addEventListener("click", resetGame);
}

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

  app.innerHTML = `
<div class="shop-card">

  <h1>🥐 まぢパン。</h1>

  <div class="mini">
    🍓 Berry：${berry}
  </div>

  <div class="gal-talk">
    「${randomItem(galLines)}」
  </div>

  <h3>💖 今日焼いたパン 💖</h3>

  <div
    style="
      font-size:40px;
      min-height:60px;
      margin-bottom:20px;
    "
  >
    ${bakedBreads.join(" ")}
  </div>

  <h2>${randomItem(customers)}</h2>

  <p style="font-size:28px;">
    <b>${word.english}</b>, please 💕
  </p>

  <div id="buttons"></div>

</div>
`;

  const buttons = document.getElementById("buttons");

  choices.forEach((choice) => {
    const button = document.createElement("button");

    button.textContent = choice;
    button.style.display = "block";
    button.style.margin = "12px auto";
    button.style.width = "240px";

    button.onclick = () => {

      if (choice === word.japanese) {

        const isRare = Math.random() < 0.08;
        const bread = isRare
          ? randomItem(rareBreads)
          : randomItem(normalBreads);

        bakedBreads.push(bread);

        if (isRare) {
          berry += 50;
          saveGame();
          showResult(
            "🤯 レアパンGET!!",
            bread,
            "🍓 +50 Berry<br>激アツ〜🔥"
          );
        } else {
          berry += 10;
          saveGame();
          showResult(
            "🎉 正解〜💖",
            bread,
            "🍓 +10 Berry"
          );
        }

      } else {

        showResult(
          "🤣 惜しい〜",
          "🍞",
          "正解は「" + word.japanese + "」だよ💕"
        );

      }

    };

    buttons.appendChild(button);
  });
}

function playGacha() {
  if (berry < 30) {
    showResult(
      "🍓 Berry不足〜",
      "🥺",
      "30 Berry ためてから来てね💕"
    );
    return;
  }

  berry -= 30;

  const bread = randomItem(gachaBreads);

  bakedBreads.push(bread);
  saveGame();

  showResult(
    "🎁 ガチャ結果",
    bread,
    "新しいパンGET〜💖"
  );
}

function showResult(title, bread, message) {
  app.innerHTML = `
<div class="shop-card">

  <h1>${title}</h1>

  <div style="font-size:64px;margin:24px 0;">
    ${bread}
  </div>

  <div class="gal-talk">
    ${message}
  </div>

  <button id="nextButton">
    🩷 NEXT 🩷
  </button>

  <button id="homeButton" style="margin-top:12px;background:#999;">
    HOME
  </button>

</div>
`;

  document
    .getElementById("nextButton")
    .addEventListener("click", showShop);

  document
    .getElementById("homeButton")
    .addEventListener("click", showTitle);
}

loadGame();
showTitle();