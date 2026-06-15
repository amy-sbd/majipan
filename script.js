const app = document.getElementById("app");

const SAVE_KEY = "majipan_save_v8";

let berry = 0;
let todayCorrect = 0;
let galExp = 0;
let galLevel = 1;
let combo = 0;

let currentQuestion = 0;
let setCorrect = 0;
let setBerry = 0;

let wordStats = {};
let trainingMode = false;

let avatarItems = {};
let equippedItems = {};

const avatarCatalog = [
  { key: "ribbon", emoji: "🎀", name: "Ribbon", price: 50, shop: true, rarity: "N" },
  { key: "glasses", emoji: "🕶", name: "Glasses", price: 80, shop: true, rarity: "N" },
  { key: "lip", emoji: "💄", name: "Lip", price: 120, shop: true, rarity: "R" },
  { key: "bag", emoji: "👜", name: "Bag", price: 200, shop: true, rarity: "R" },
  { key: "tiara", emoji: "👑", name: "Tiara", price: 150, shop: true, rarity: "SR" },

  { key: "catears", emoji: "🐱", name: "Cat Ears", price: 0, shop: false, rarity: "R" },
  { key: "starpin", emoji: "⭐", name: "Star Pin", price: 0, shop: false, rarity: "R" },
  { key: "wings", emoji: "🪽", name: "Angel Wings", price: 0, shop: false, rarity: "SR" },
  { key: "aura", emoji: "🌈", name: "Rainbow Aura", price: 0, shop: false, rarity: "SR" },
  { key: "devil", emoji: "😈", name: "Devil Mood", price: 0, shop: false, rarity: "SR" },
  { key: "berrycrown", emoji: "🍓👑", name: "Berry Crown", price: 0, shop: false, rarity: "SSR" },
  { key: "galaxy", emoji: "🌌", name: "Galaxy Aura", price: 0, shop: false, rarity: "SSR" },
  { key: "queen", emoji: "💎👑", name: "Queen Set", price: 0, shop: false, rarity: "SSR" }
];

const GACHA_COST = 80;

const galLines = [
  "え、今日も来たじゃ〜ん🤣💕",
  "ガチ助かるんだけど〜🩷",
  "今日ビジュ良くない？✨",
  "優勝すぎる😂💕",
  "まぢ神〜！！✨",
  "それ盛れてる〜🤣🩷",
  "一問だけでも勝ちなんよ✨"
];

const bossLines = [
  "ここから本番なんだけど🔥",
  "スペル書けたらガチ強い💅",
  "FINALいくよ、集中〜👑",
  "ここ決めたらまぢ優勝✨"
];

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function addGalExp(amount) {
  galExp += amount;
  const needed = galLevel * 100;

  if (galExp >= needed) {
    galExp -= needed;
    galLevel++;
  }
}

function normalizeAvatarData() {
  avatarCatalog.forEach((item) => {
    if (avatarItems[item.key] === undefined) {
      avatarItems[item.key] = false;
    }

    if (equippedItems[item.key] === undefined) {
      equippedItems[item.key] = false;
    }
  });
}

function getRarityStyle(rarity) {
  if (rarity === "SSR") {
    return "background:linear-gradient(90deg,#8e2de2,#ffcc00);color:white;";
  }

  if (rarity === "SR") {
    return "background:#8f5cff;color:white;";
  }

  if (rarity === "R") {
    return "background:#ff77bb;color:white;";
  }

  return "background:#ddd;color:#333;";
}

function renderAvatar() {
  let top = "";
  let middle = "🙂";
  let bottom = "";

  if (equippedItems.galaxy) top += "🌌";
  if (equippedItems.aura) top += "🌈";
  if (equippedItems.queen) top += "💎👑";
  if (equippedItems.berrycrown) top += "🍓👑";
  if (equippedItems.tiara) top += "👑";
  if (equippedItems.catears) top += "🐱";
  if (equippedItems.ribbon) top += "🎀";
  if (equippedItems.starpin) top += "⭐";

  if (equippedItems.glasses) middle = "🕶🙂";
  if (equippedItems.devil) middle = "😈";
  if (equippedItems.lip) middle += "💄";
  if (equippedItems.wings) middle = "🪽" + middle + "🪽";

  if (equippedItems.bag) bottom += "👜";

  return `
<div style="font-size:42px;line-height:1.4;margin:18px 0;">
${top}<br>
${middle}<br>
${bottom}
</div>
`;
}

function getWordStat(word) {
  if (!wordStats[word.id]) {
    wordStats[word.id] = {
      stage: 1,
      mistakes: 0,
      correctStreak: 0,
      bossClear: 0,
      graduated: false
    };
  }

  return wordStats[word.id];
}

function chooseWord(words) {
  const weighted = [];

  words.forEach((word) => {
    const stat = getWordStat(word);
    let weight = 1;

    weight += stat.mistakes * 3;

    if (stat.stage === 3) {
      weight += 2;
    }

    if (stat.graduated) {
      weight = 1;
    }

    for (let i = 0; i < weight; i++) {
      weighted.push(word);
    }
  });

  return randomItem(weighted);
}

function loadGame() {
  const saved = localStorage.getItem(SAVE_KEY);

  if (!saved) {
    normalizeAvatarData();
    return;
  }

  try {
    const data = JSON.parse(saved);

    berry = data.berry || 0;
    todayCorrect = data.todayCorrect || 0;
    galExp = data.galExp || 0;
    galLevel = data.galLevel || 1;
    combo = data.combo || 0;
    wordStats = data.wordStats || {};
    avatarItems = data.avatarItems || {};
    equippedItems = data.equippedItems || {};

    normalizeAvatarData();

  } catch {
    normalizeAvatarData();
    console.log("save load error");
  }
}

function saveGame() {
  normalizeAvatarData();

  localStorage.setItem(
    SAVE_KEY,
    JSON.stringify({
      berry,
      todayCorrect,
      galExp,
      galLevel,
      combo,
      wordStats,
      avatarItems,
      equippedItems
    })
  );
}

function showStatusMini() {
  return `
<div class="mini">
🍓 Berry：${berry}<br>
💅 ギャル力 Lv.${galLevel}<br>
EXP：${galExp}/${galLevel * 100}<br>
🔥 Combo：${combo}
</div>
`;
}

function showTitle() {
  app.innerHTML = `
<div class="title-box">

<h1>まぢパン。</h1>

${renderAvatar()}

<p class="sub">GAL WORD BATTLE 💅✨</p>

<div class="gal-talk">
「${randomItem(galLines)}」
</div>

${showStatusMini()}

<button id="startButton">🩷 START</button>

<button id="trainingButton" style="margin-top:12px;background:#ff4d6d;">
🔥 苦手特訓
</button>

<button id="statusButton" style="margin-top:12px;background:#8f5cff;">
📊 単語ステータス
</button>

<button id="graduateButton" style="margin-top:12px;background:#d4af37;">
👑 卒業図鑑
</button>

<button id="shopButton" style="margin-top:12px;background:#00b894;">
🛍️ SHOP
</button>

<button id="gachaButton" style="margin-top:12px;background:#e84393;">
🎰 アバターガチャ ${GACHA_COST} Berry
</button>

</div>
`;

  document.getElementById("startButton").onclick = () => {
    trainingMode = false;
    currentQuestion = 0;
    setCorrect = 0;
    setBerry = 0;
    showShop();
  };

  document.getElementById("trainingButton").onclick = () => {
    trainingMode = true;
    currentQuestion = 0;
    setCorrect = 0;
    setBerry = 0;
    showShop();
  };

  document.getElementById("statusButton").onclick = showWordStatus;
  document.getElementById("graduateButton").onclick = showGraduationBook;
  document.getElementById("shopButton").onclick = showAvatarShop;
  document.getElementById("gachaButton").onclick = playAvatarGacha;
}

function showAvatarShop() {
  let html = "";

  avatarCatalog.forEach((item) => {
    const owned = avatarItems[item.key];
    const equipped = equippedItems[item.key];

    html += `
<div style="margin:15px 0;padding:12px;border:1px solid #ddd;border-radius:12px;">
<div style="display:inline-block;padding:4px 10px;border-radius:999px;${getRarityStyle(item.rarity)}">
${item.rarity}
</div>
<br><br>
${item.emoji} ${item.name}<br>
${item.shop ? "💰 " + item.price : "🎰 ガチャ限定"}<br><br>

${
  item.shop
    ? `<button onclick="buyItem('${item.key}')">
        ${owned ? "購入済み" : "買う"}
      </button>`
    : `<button disabled>
        ${owned ? "入手済み" : "ガチャ限定"}
      </button>`
}

${owned ? `
<button onclick="toggleEquip('${item.key}')">
${equipped ? "外す" : "装備"}
</button>` : ""}
</div>
`;
  });

  app.innerHTML = `
<div class="shop-card">

<h1>🛍️ Avatar Shop</h1>

${renderAvatar()}

${showStatusMini()}

${html}

<button id="homeButton">HOME</button>

</div>
`;

  document.getElementById("homeButton").onclick = showTitle;
}

window.buyItem = function(key) {
  const item = avatarCatalog.find(i => i.key === key);

  if (!item.shop) return;
  if (avatarItems[key]) return;

  if (berry < item.price) {
    alert("Berry足りない🤣");
    return;
  }

  berry -= item.price;
  avatarItems[key] = true;

  saveGame();
  showAvatarShop();
};

window.toggleEquip = function(key) {
  if (!avatarItems[key]) return;

  equippedItems[key] = !equippedItems[key];

  saveGame();
  showAvatarShop();
};

function pickGachaItem() {
  const notOwned = avatarCatalog.filter((item) => !avatarItems[item.key]);

  if (notOwned.length === 0) {
    return null;
  }

  const pool = [];

  notOwned.forEach((item) => {
    let weight = 1;

    if (item.rarity === "N") weight = 45;
    if (item.rarity === "R") weight = 30;
    if (item.rarity === "SR") weight = 15;
    if (item.rarity === "SSR") weight = 5;

    for (let i = 0; i < weight; i++) {
      pool.push(item);
    }
  });

  return randomItem(pool);
}

function playAvatarGacha() {
  if (berry < GACHA_COST) {
    showResult(
      "🍓 Berry不足〜",
      GACHA_COST + " Berry ためてから来てね💖"
    );
    return;
  }

  const item = pickGachaItem();

  if (!item) {
    showResult(
      "🎰 コンプリート!!",
      "全部持ってるじゃん💖まぢ神✨"
    );
    return;
  }

  berry -= GACHA_COST;

  avatarItems[item.key] = true;
  equippedItems[item.key] = true;

  saveGame();

  app.innerHTML = `
<div class="shop-card">

<h1>🎰 ガチャ結果</h1>

<div style="display:inline-block;padding:8px 18px;border-radius:999px;font-size:22px;${getRarityStyle(item.rarity)}">
${item.rarity}
</div>

<div style="font-size:70px;margin:20px 0;">
${item.emoji}
</div>

<div class="gal-talk">
${item.name} GET💖<br>
${item.rarity === "SSR" ? "え、SSRはまぢ神引き🤣👑" : "さっそく装備したよ✨"}
</div>

${renderAvatar()}

<button id="homeButton">HOME</button>
<button id="shopButton" style="margin-top:12px;background:#00b894;">SHOP</button>

</div>
`;

  document.getElementById("homeButton").onclick = showTitle;
  document.getElementById("shopButton").onclick = showAvatarShop;
}

async function showWordStatus() {
  const response = await fetch("words.json");
  const words = await response.json();

  let html = "";

  words.forEach((word) => {
    const stat = getWordStat(word);

    html += `
<div style="margin:15px 0;padding:10px;border:1px solid #ddd;border-radius:12px;">
<b>${word.english}</b> / ${word.japanese}<br>
Stage：${stat.stage}<br>
苦手度：${stat.mistakes}<br>
連続正解：${stat.correctStreak}<br>
ボスクリア：${stat.bossClear}<br>
卒業：${stat.graduated ? "👑 済み" : "-"}
</div>
`;
  });

  app.innerHTML = `
<div class="shop-card">
<h1>📊 単語ステータス</h1>
${html}
<button id="homeButton">HOME</button>
</div>
`;

  document.getElementById("homeButton").onclick = showTitle;
}

async function showGraduationBook() {
  const response = await fetch("words.json");
  const words = await response.json();

  const graduatedWords = words.filter((word) => {
    const stat = getWordStat(word);
    return stat.graduated;
  });

  let html = "";

  if (graduatedWords.length === 0) {
    html = `
<div class="gal-talk">
まだ卒業単語はないよ💅
</div>
`;
  } else {
    graduatedWords.forEach((word) => {
      const stat = getWordStat(word);

      html += `
<div style="margin:15px 0;padding:12px;border:2px solid gold;border-radius:14px;background:#fffbea;">
👑 <b>${word.english}</b> / ${word.japanese}<br>
ボスクリア：${stat.bossClear}回
</div>
`;
    });
  }

  app.innerHTML = `
<div class="shop-card">
<h1>👑 卒業図鑑</h1>
${html}
<button id="homeButton">HOME</button>
</div>
`;

  document.getElementById("homeButton").onclick = showTitle;
}

function makeQuestion(words, word, stat) {
  let questionText = "";
  let correctAnswer = "";
  let choices = [];

  const wrongWords = words
    .filter(w => w.id !== word.id)
    .sort(() => Math.random() - 0.5);

  if (stat.stage === 1) {
    questionText = `<b>${word.english}</b><br>この意味は？`;
    correctAnswer = word.japanese;
    choices = [word.japanese, wrongWords[0].japanese, wrongWords[1].japanese, wrongWords[2].japanese];
  }

  if (stat.stage === 2) {
    questionText = `<b>${word.japanese}</b><br>英語で？`;
    correctAnswer = word.english;
    choices = [word.english, wrongWords[0].english, wrongWords[1].english, wrongWords[2].english];
  }

  if (stat.stage === 3) {
    questionText = `<b>${word.japanese}</b><br>スペル入力💖`;
    correctAnswer = word.english;
  }

  return {
    questionText,
    correctAnswer,
    choices: choices.sort(() => Math.random() - 0.5)
  };
}

async function showShop() {
  if (currentQuestion >= 10) {
    showSetResult();
    return;
  }

  const response = await fetch("words.json");
  const words = await response.json();

  let playWords = words;

  if (trainingMode) {
    playWords = words.filter((word) => {
      const stat = getWordStat(word);
      return stat.mistakes >= 1;
    });

    if (playWords.length === 0) {
      app.innerHTML = `
<div class="shop-card">
<h1>🔥 苦手特訓</h1>
<div class="gal-talk">今は苦手単語ないじゃ〜ん💖</div>
<button id="homeButton">HOME</button>
</div>
`;
      document.getElementById("homeButton").onclick = showTitle;
      return;
    }
  }

  currentQuestion++;

  const word = chooseWord(playWords);
  const stat = getWordStat(word);
  const question = makeQuestion(words, word, stat);

  const isBoss = stat.stage === 3;

  app.innerHTML = `
<div class="shop-card" style="${
  isBoss
    ? "background:linear-gradient(180deg,#2b1055,#7597de);color:white;border:3px solid gold;"
    : ""
}">

<h1>${trainingMode ? "🔥 WEAK WORD TRAINING" : isBoss ? "👑 FINAL SPELL BATTLE" : "💅 まぢパン。"}</h1>

<div class="mini">
問題 ${currentQuestion}/10<br>
Stage：${stat.stage}<br>
苦手度：${stat.mistakes}<br>
卒業：${stat.graduated ? "👑" : "-"}
</div>

${showStatusMini()}

<div class="gal-talk">
「${isBoss ? randomItem(bossLines) : randomItem(galLines)}」
</div>

<p style="font-size:30px;">
${question.questionText}
</p>

<div id="answerArea"></div>

</div>
`;

  const answerArea = document.getElementById("answerArea");

  if (stat.stage === 3) {
    answerArea.innerHTML = `
<input
id="spellInput"
type="text"
style="
width:260px;
padding:18px;
font-size:26px;
border-radius:22px;
border:3px solid gold;
text-align:center;
box-shadow:0 0 18px rgba(255,215,0,.7);
"
>
<button id="spellButton">👑 CHECK</button>
`;

    document.getElementById("spellButton").onclick = () => {
      const value =
        document.getElementById("spellInput").value.trim().toLowerCase();

      if (value === question.correctAnswer.toLowerCase()) {
        handleCorrect(stat, true);
      } else {
        handleMiss(stat, question.correctAnswer);
      }
    };

  } else {
    question.choices.forEach((choice) => {
      const button = document.createElement("button");
      button.textContent = choice;

      button.onclick = () => {
        if (choice === question.correctAnswer) {
          handleCorrect(stat, false);
        } else {
          handleMiss(stat, question.correctAnswer);
        }
      };

      answerArea.appendChild(button);
    });
  }
}

function handleCorrect(stat, isBoss) {
  todayCorrect++;
  combo++;
  setCorrect++;

  stat.correctStreak++;

  if (!isBoss && stat.correctStreak >= 3 && stat.stage < 3) {
    stat.stage++;
    stat.correctStreak = 0;
  }

  if (isBoss) {
    stat.bossClear++;
    stat.graduated = true;
    stat.mistakes = 0;
    stat.correctStreak = 0;
  }

  const gain = isBoss ? 30 : 10;

  berry += gain;
  setBerry += gain;

  addGalExp(gain);

  saveGame();

  showResult(
    isBoss ? "👑 卒業クリア!!" : "🎉 正解",
    isBoss ? "この単語まぢ習得💖" : "ナイス💖"
  );
}

function handleMiss(stat, correctAnswer) {
  combo = 0;
  stat.mistakes++;
  stat.correctStreak = 0;

  if (stat.stage === 3) {
    stat.stage = 2;
    stat.graduated = false;
  }

  saveGame();

  showResult(
    "🤣 惜しい〜",
    "正解：" + correctAnswer
  );
}

function showResult(title, message) {
  app.innerHTML = `
<div class="shop-card">

<h1>${title}</h1>

${showStatusMini()}

<div class="gal-talk">
${message}
</div>

<button id="nextButton">NEXT</button>
<button id="homeButton" style="margin-top:12px;background:#999;">HOME</button>

</div>
`;

  document.getElementById("nextButton").onclick = showShop;
  document.getElementById("homeButton").onclick = showTitle;
}

function showSetResult() {
  app.innerHTML = `
<div class="shop-card">

<h1>📊 セット結果</h1>

<div class="gal-talk">
正解 ${setCorrect}/10<br>
🍓 ${setBerry}
</div>

<button id="nextSetButton">NEXT SET</button>
<button id="homeButton">HOME</button>

</div>
`;

  document.getElementById("nextSetButton").onclick = () => {
    currentQuestion = 0;
    setCorrect = 0;
    setBerry = 0;
    showShop();
  };

  document.getElementById("homeButton").onclick = showTitle;
}

loadGame();
showTitle();