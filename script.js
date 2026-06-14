const app = document.getElementById("app");

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

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function showTitle() {

  const line = randomItem(galLines);

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
        「${line}」
      </div>

      <button id="startButton">
        🩷 START 🩷
      </button>

    </div>
  `;

  document
    .getElementById("startButton")
    .addEventListener("click", showShop);

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

      <div class="gal-talk">
        「${randomItem(galLines)}」
      </div>

      <h2>
        ${randomItem(customers)}
      </h2>

      <p style="font-size:28px;margin:25px 0;">
        <b>${word.english}</b>, please 💕
      </p>

      <div id="buttons"></div>

    </div>
  `;

  const buttons = document.getElementById("buttons");

  choices.forEach(choice => {

    const button = document.createElement("button");

    button.textContent = choice;
    button.style.display = "block";
    button.style.margin = "12px auto";
    button.style.width = "240px";

    button.onclick = () => {

      if (choice === word.japanese) {

        alert("🎉 きゃーー💕 正解なんだけど〜✨");

      } else {

        alert(`🤣 ちょ待って〜！正解は「${word.japanese}」だよ💦`);

      }

      showShop();

    };

    buttons.appendChild(button);

  });

}

showTitle();