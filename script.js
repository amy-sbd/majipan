const app = document.getElementById("app");

const SAVE_KEY = "majipan_save_v2";

let berry = 0;
let todayCorrect = 0;
let galExp = 0;
let galLevel = 1;
let combo = 0;

let missionClaimed = {
  correct3: false,
  combo5: false
};

const galLines = [
  "え、今日も来たじゃ〜ん🤣💕",
  "ガチ助かるんだけど〜🩷",
  "今日ビジュ良くない？✨",
  "優勝すぎる😂💕",
  "まぢ神〜！！✨",
  "それ盛れてる〜🤣🩷",
  "そのノリ、まぢ強い💅",
  "一問だけでも勝ちなんよ✨"
];

const correctLines = [
  "え、天才なんだけど🤣💕",
  "それ正解〜💅✨",
  "うますぎ案件💖",
  "ガチで優勝🫶",
  "センスありすぎ🤣",
  "まぢ強いじゃん✨"
];

const missLines = [
  "焦げたww🤣",
  "惜しすぎる〜😂💕",
  "ま、次いこ🫶",
  "逆におもろい🤣",
  "ノーカンノーカン💖",
  "次で盛り返そ💕"
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

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function addGalExp(amount) {
  galExp += amount;

  const needed = galLevel * 100;

  if (galExp >= needed) {
    galExp -= needed;
    galLevel++;
    return true;
  }

  return false;
}

function loadGame() {
  const saved = localStorage.getItem(SAVE_KEY);

  if (!saved) return;

  try {
    const data = JSON.parse(saved);

    berry = data.berry || 0;
    galExp = data.galExp || 0;
    galLevel = data.galLevel || 1;
    combo = data.combo || 0;

    if (data.todayKey === getTodayKey()) {
      todayCorrect = data.todayCorrect || 0;
      missionClaimed = data.missionClaimed || {
        correct3: false,
        combo5: false
      };
    }

  } catch {
    berry = 0;
    todayCorrect = 0;
    galExp = 0;
    galLevel = 1;
    combo = 0;
  }
}

function saveGame() {
  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify({
      berry,
      todayCorrect,
      missionClaimed,
      galExp,
      galLevel,
      combo,
      todayKey: getTodayKey()
    })
  );
}

function resetGame() {
  const ok = confirm("データをリセットする？");

  if (!ok) return;

  berry = 0;
  todayCorrect = 0;
  galExp = 0;
  galLevel = 1;
  combo = 0;

  missionClaimed = {
    correct3: false,
    combo5: false
  };

  localStorage.removeItem(SAVE_KEY);
  showTitle();
}

function showStatusMini() {
  return `
<div class="mini">
  🍓 Berry：${berry}<br>
  💅 ギャル力 Lv.${galLevel} / EXP ${galExp}/${galLevel * 100}<br>
  🔥 Combo：${combo}
</div>
`;
}

function showTitle() {
  app.innerHTML = `
<div class="title-box">

  <div class="mini">💖✨ WELCOME ✨💖</div>

  <h1>まぢパン。</h1>

  <p class="sub">GAL BAKERY 💅🥐</p>

  <div class="gal-talk">
    「${randomItem(galLines)}」
  </div>

  ${showStatusMini()}

  <button id="startButton">🩷 START 🩷</button>

  <button id="missionButton" style="margin-top:12px;background:#ff9f43;">
    🔥 ミッション
  </button>

  <button id="resetButton" style="margin-top:12px;background:#999;">
    データリセット
  </button>

</div>
`;

  document.getElementById("startButton").onclick = showShop;
  document.getElementById("missionButton").onclick = showMissions;
  document.getElementById("resetButton").onclick = resetGame;
}

function showMissions() {
  app.innerHTML = `
<div class="shop-card">

  <h1>🔥 ミッション</h1>

  ${showStatusMini()}

  <div class="gal-talk">
    今日も盛ってこ〜💖
  </div>

  <p>今日3問正解：${todayCorrect}/3</p>
  <button id="missionCorrect3">
    ${missionClaimed.correct3 ? "受け取り済み" : "報酬を受け取る 🍓 +50"}
  </button>

  <p style="margin-top:24px;">5コンボ達成：${combo}/5</p>
  <button id="missionCombo5">
    ${missionClaimed.combo5 ? "受け取り済み" : "報酬を受け取る 🍓 +100"}
  </button>

  <button id="homeButton" style="margin-top:24px;background:#999;">
    HOME
  </button>

</div>
`;

  document.getElementById("missionCorrect3").onclick = () => {
    if (todayCorrect >= 3 && !missionClaimed.correct3) {
      berry += 50;
      const leveled = addGalExp(30);
      missionClaimed.correct3 = true;
      saveGame();

      showResult(
        leveled ? "💅 レベルアップ!!" : "🔥 ミッション達成",
        "今日3問クリア💖<br>🍓 +50 Berry / EXP +30"
      );
    }
  };

  document.getElementById("missionCombo5").onclick = () => {
    if (combo >= 5 && !missionClaimed.combo5) {
      berry += 100;
      const leveled = addGalExp(50);
      missionClaimed.combo5 = true;
      saveGame();

      showResult(
        leveled ? "💅 レベルアップ!!" : "🔥 コンボミッション達成",
        "5コンボ達成💖<br>🍓 +100 Berry / EXP +50"
      );
    }
  };

  document.getElementById("homeButton").onclick = showTitle;
}

async function showShop() {
  const response = await fetch("words.json");
  const words = await response.json();

  const word = randomItem(words);

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

  <h1>💅 まぢパン。</h1>

  ${showStatusMini()}

  <div class="gal-talk">
    「${randomItem(galLines)}」
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
        todayCorrect++;
        combo++;

        let comboBonus = 0;

        if (combo > 0 && combo % 3 === 0) {
          comboBonus = 20;
        }

        berry += 10 + comboBonus;

        const leveled = addGalExp(10);

        saveGame();

        showResult(
          leveled ? "💅 レベルアップ!!" : "🎉 正解〜💖",
          randomItem(correctLines) +
          "<br>🍓 +10 Berry / EXP +10" +
          (comboBonus > 0 ? "<br>🔥 Combo Bonus +20 Berry" : "")
        );

      } else {
        combo = 0;
        saveGame();

        showResult(
          "🤣 惜しい〜",
          randomItem(missLines) +
          "<br>正解は「" + word.japanese + "」だよ💕<br>Comboはリセット！"
        );
      }
    };

    buttons.appendChild(button);
  });
}

function showResult(title, message) {
  app.innerHTML = `
<div class="shop-card">

  <h1>${title}</h1>

  ${showStatusMini()}

  <div class="gal-talk">
    ${message}
  </div>

  <button id="nextButton">🩷 NEXT 🩷</button>

  <button id="homeButton" style="margin-top:12px;background:#999;">
    HOME
  </button>

</div>
`;

  document.getElementById("nextButton").onclick = showShop;
  document.getElementById("homeButton").onclick = showTitle;
}

loadGame();
showTitle();