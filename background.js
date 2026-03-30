// 1. Context Menu එක සැකසීම
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "vocabTranslate",
    title: "Translate to Sinhala: '%s'",
    contexts: ["selection"]
  });
});

// 2. Click කළාම ක්‍රියාත්මක වන කොටස
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "vocabTranslate") {
    const selectedText = info.selectionText.trim();
    if (selectedText) {
      translateAndSave(selectedText);
    }
  }
});

// 3. Google Translate හරහා පරිවර්තනය කර Save කරන Function එක
async function translateAndSave(text) {
  try {
    // Google Translate (GTX) API එක භාවිතා කිරීම
    // sl=auto (Source Language Auto), tl=si (Target Language Sinhala)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=si&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url);
    const data = await response.json();

    // Google Translate එකෙන් එන දත්ත වල හැඩය: [[["Sinhala Word", "Original Word", ...], ...], ...]
    // අපිට අවශ්‍ය පරිවර්තනය තියෙන්නේ data[0][0][0] වලයි.
    let translatedText = "";
    
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      translatedText = data[0][0][0];
    } else {
      translatedText = "Translation failed";
    }

    // Browser Storage එකට දත්ත එකතු කිරීම
    chrome.storage.local.get({ words: [] }, (result) => {
      const currentWords = result.words;
      
      currentWords.push({
        word: text,
        definition: translatedText,
        date: new Date().toLocaleDateString()
      });

      chrome.storage.local.set({ words: currentWords }, () => {
        // Notification යැවීම
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon48.png", // icon48.png පින්තූරය ෆෝල්ඩරයේ තිබිය යුතුයි
          title: "Saved Successfully!",
          message: `"${text}" -> ${translatedText}`,
          priority: 2
        });
      });
    });

  } catch (error) {
    console.error("Translation Error:", error);
    // Error එකක් ආවොත් Notification එකක් මගින් දැනුම් දීම
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon48.png",
      title: "Translation Error",
      message: "Check your internet connection.",
      priority: 2
    });
  }
}