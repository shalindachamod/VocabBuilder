# 📝 Quick Sinhala Context Translator

An easy-to-use web extension that helps you find Sinhala meanings of English words instantly while browsing. Simply highlight a word, right-click, and get the translation!

---

## ✨ Features
* 🖱️ **Context Menu Integration:** No need to open a separate tab; just right-click and translate.
* 🚀 **Instant Meaning:** Get the Sinhala definition of any selected text quickly.
* 🌐 **Works on Any Site:** Use it on news sites, blogs, or documentation.
* ⚡ **Lightweight:** Minimal impact on browser performance.

---

## 🛠️ Tech Stack
* **JavaScript:** Core logic and Context Menu API.
* **JSON:** Manifest file configuration.
* **HTML/CSS:** (If you have a popup UI included).

---

## 🚀 How to Install (For Developers)

Since this is an unpacked extension, follow these steps to use it:

1. **Download** this repository as a ZIP file and extract it to your computer.
2. Open your Chrome browser and go to `chrome://extensions/`.
3. Enable **"Developer mode"** by clicking the toggle in the top-right corner.
4. Click the **"Load unpacked"** button.
5. Select the folder where you extracted the extension files.
6. Now, select any word on a website, right-click, and use the extension!

---

## 📸 Screenshots
*(Once you upload, add a screenshot showing the right-click menu and the translation result here!)*

---

## ⚙️ How It Works
1. The extension uses the `chrome.contextMenus` API to add a custom item to your browser's right-click menu.
2. When triggered, it captures the selected text and fetches the Sinhala translation (via an internal dictionary or translation API).
3. The result is displayed as an alert, a popup, or within a side panel.

## ⚙️ How to Install (Development Mode):
1. Download this repository as a ZIP and extract it.
2.Open Chrome and go to chrome://extensions/.
3.Turn on "Developer mode" (top right).
4.Click "Load unpacked" and select the folder you extracted.

---

## 👨‍💻 Developed By
**Shalinda Chamod**
* [LinkedIn](https://www.linkedin.com/in/shalinda-chamod-452a23385/)
* [GitHub](https://github.com/YOUR_GITHUB_USERNAME)

---
