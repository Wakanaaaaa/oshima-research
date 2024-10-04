// 特定の単語を除外して配列に追加する汎用関数
const addWordsExcluding = (data, excludeWord, docID) => {
  const fieldsArray = [];
  for (const [key, value] of Object.entries(data)) {
    if (value !== excludeWord) {
      fieldsArray.push({ key, value, episodeID: docID });
    }
  }
  return fieldsArray;
};

// 重複を取り除く汎用関数
const removeDuplicates = (array, key = "value") => {
  const uniqueItems = new Map();
  array.forEach((item) => {
    if (!uniqueItems.has(item[key])) {
      uniqueItems.set(item[key], item);
    }
  });
  return Array.from(uniqueItems.values());
};
