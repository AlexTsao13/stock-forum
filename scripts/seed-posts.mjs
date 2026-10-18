// 產生展示用的假文章資料
// 用法：
//   npm run seed           新增 30 筆假文章
//   npm run seed -- --clean 刪除所有由此腳本產生的假文章
import { readFileSync } from "node:fs";
import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";

const DB_NAME = "post_db";

// Node 18 不支援 --env-file，手動讀取 .env
function loadEnv() {
  try {
    const content = readFileSync(new URL("../.env", import.meta.url), "utf8");
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // 沒有 .env 就使用系統環境變數
  }
}

const authors = [
  { name: "價值投資老王", email: "wang@example.com" },
  { name: "ETF小資族", email: "etf.saver@example.com" },
  { name: "半導體觀察家", email: "semi.watcher@example.com" },
  { name: "技術線型阿明", email: "chart.ming@example.com" },
  { name: "存股媽媽", email: "dividend.mom@example.com" },
  { name: "美股夜貓子", email: "us.nightowl@example.com" },
].map((author) => ({ id: uuidv4(), ...author }));

const posts = [
  ["台積電法說會重點整理", "這次法說會提到先進製程需求依然強勁，CoWoS 產能持續擴充，毛利率指引也優於市場預期。大家怎麼看下半年的走勢？"],
  ["0050 和 006208 該選哪一檔？", "兩檔都是追蹤台灣 50 指數，主要差在內扣費用和成交量。小資族定期定額的話，大家會怎麼選？"],
  ["殖利率 6% 以上的存股清單分享", "整理了近五年配息穩定、殖利率超過 6% 的個股，主要集中在金融、電信和傳產，歡迎補充或討論。"],
  ["聯準會降息對台股的影響", "如果年底真的開始降息，資金可能回流新興市場。不過也要注意降息的原因是不是景氣轉弱，不能只看利多。"],
  ["新手第一次買股票該注意什麼？", "剛開戶想開始投資，想請教大家當初入門時踩過哪些坑？零股交易適合新手嗎？"],
  ["AI 伺服器供應鏈還有機會嗎？", "廣達、緯創、英業達漲了一大段，現在進場會不會太晚？還是應該往散熱、電源等周邊找機會？"],
  ["均線糾結後的突破怎麼判斷", "最近看到幾檔股票均線糾結很久，想問大家怎麼判斷是真突破還是假突破？成交量是不是關鍵？"],
  ["金融股今年配息預估", "壽險業今年獲利回升，預期配息會比去年好。目前比較看好的是富邦金和國泰金，大家有其他口袋名單嗎？"],
  ["美股財報季：輝達營收再創新高", "資料中心營收年增超過預期，但盤後股價反而下跌，市場的期待似乎已經非常高了。"],
  ["定期定額每月 3000 元的心得", "從三年前開始每月定期定額 3000 元買市值型 ETF，中間經歷大跌也沒停扣，目前報酬率大約 35%。"],
  ["高股息 ETF 填息狀況追蹤", "整理了幾檔熱門高股息 ETF 的填息天數，有些除息後很快就填息，有些則拖了好幾個月。"],
  ["航運股還能追嗎？", "紅海情勢讓運價再度上漲，貨櫃三雄股價也跟著反彈。但歷史經驗來看，航運股的波動非常大，要小心追高。"],
  ["分享我的停損原則", "我自己的原則是跌破進場價 8% 一定停損，不攤平虧損的部位。雖然常常停損後就反彈，但長期來看保住了本金。"],
  ["日圓貶值對日股投資的影響", "最近有在考慮投資日股 ETF，但日圓持續貶值會吃掉報酬。大家會選擇有避險的版本嗎？"],
  ["營收公布後的選股方法", "每月 10 號前公布營收，我會挑年增率連續三個月成長的公司，再搭配本益比篩選，分享給大家參考。"],
  ["債券 ETF 適合現在進場嗎？", "長天期美債 ETF 已經跌了一段時間，如果降息開始，債券價格有機會上漲。不過時間點很難抓。"],
  ["電動車產業鏈的長期展望", "雖然電動車銷量成長放緩，但電池、充電樁和車用半導體的需求長期來看還是向上的。"],
  ["融資餘額創新高要擔心嗎？", "最近融資餘額一直往上，散戶情緒偏熱。過去幾次融資過高後都有一波修正，大家會減碼嗎？"],
  ["生技股的投資風險", "生技股常常因為臨床試驗結果大漲大跌，消息面影響很大。建議只用小部位參與，不要重壓。"],
  ["我的資產配置分享：股六債四", "目前三十多歲，資產配置是股票 60%、債券 40%，每年再平衡一次。想聽聽大家不同年齡的配置。"],
  ["KD 指標鈍化怎麼看", "強勢股 KD 常常在高檔鈍化，如果看到 KD 超過 80 就賣，可能會錯過一大段漲幅，該怎麼搭配其他指標？"],
  ["除權息前買進划算嗎？", "很多人會在除息前買進想領股利，但其實要考慮股利所得稅和二代健保補充保費，不一定划算。"],
  ["記憶體報價回升的投資機會", "DRAM 和 NAND 報價連續幾季上漲，南亞科和華邦電的營收也開始轉好，是否是循環股的進場時機？"],
  ["美元定存 vs 美債 ETF", "手上有一筆美元，在猶豫要放美元定存還是買短天期美債 ETF，想請教大家的看法和考量。"],
  ["量價背離的實際案例", "分享最近看到的量價背離案例：股價創新高但成交量明顯萎縮，之後一週就回檔了 10%。"],
  ["退休金該怎麼投資？", "距離退休還有二十年，想開始規劃退休金。勞退自提 6% 和自己投資 ETF，哪個比較好？"],
  ["營建股受打房政策影響", "央行持續選擇性信用管制，營建股近期表現疲弱。但部分有穩定推案的建商，殖利率其實不錯。"],
  ["如何閱讀財報的現金流量表", "很多人只看 EPS，但現金流量表更能看出公司的真實獲利能力。營業現金流長期低於淨利要特別注意。"],
  ["台股萬點以上還能投資嗎？", "常聽到有人說指數太高不敢進場，但長期來看指數本來就會隨著企業獲利成長，重點是買進的方式和紀律。"],
  ["本週盤勢回顧與下週展望", "本週外資連續賣超，指數在月線附近震盪。下週有 CPI 數據公布，預計波動會加大，操作上建議保守一點。"],
];

async function main() {
  loadEnv();
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("找不到 MONGODB_URI，請確認 .env 設定");
  }

  const client = new MongoClient(uri);
  await client.connect();
  const collection = client.db(DB_NAME).collection("posts");

  try {
    if (process.argv.includes("--clean")) {
      const result = await collection.deleteMany({ isSeed: true });
      console.log(`已刪除 ${result.deletedCount} 筆假文章`);
      return;
    }

    // 讓文章時間分散在過去 30 天，第一筆最新
    const now = Date.now();
    const docs = posts.map(([title, content], index) => ({
      id: uuidv4(),
      title,
      content,
      createdAt: new Date(now - index * 24 * 60 * 60 * 1000 - index * 37 * 60 * 1000),
      author: authors[index % authors.length],
      isSeed: true,
    }));

    const result = await collection.insertMany(docs);
    console.log(`已新增 ${result.insertedCount} 筆假文章`);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
