document.addEventListener('DOMContentLoaded', () => {
    // HTML Elements හඳුනා ගැනීම
    const themeBtn = document.getElementById('themeToggle');
    const body = document.getElementById('mainBody');
    const searchInput = document.getElementById('searchInput');
    const exportBtn = document.getElementById('exportBtn');
    const wordListContainer = document.getElementById('wordList');
    const wordCountText = document.getElementById('wordCountText');

    // 1. කලින් සේව් කරපු Theme එක ඇප්ලයි කිරීම
    chrome.storage.local.get(['theme'], (result) => {
        if (result.theme === 'dark') {
            body.classList.add('dark-mode');
            if (themeBtn) themeBtn.innerText = "☀️ Light";
        }
    });

    // 2. Theme Toggle (Dark/Light Mode)
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            themeBtn.innerText = isDark ? "☀️ Light" : "🌙 Dark";
            chrome.storage.local.set({ theme: isDark ? 'dark' : 'light' });
        });
    }

    // 3. Search කිරීම (Real-time Filter)
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderList(e.target.value.toLowerCase());
        });
    }

    // 4. Excel (CSV) Export කිරීම
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToCSV);
    }

    // වචන ලිස්ට් එක පෙන්වන ප්‍රධාන Function එක
    function renderList(searchTerm = "") {
        if (!wordListContainer) return;
        wordListContainer.innerHTML = '';

        chrome.storage.local.get({ words: [] }, (result) => {
            const allWords = result.words;

            // මුළු වචන ගණන පෙන්වීම
            if (wordCountText) {
                wordCountText.innerText = `Total Words: ${allWords.length}`;
            }

            // සර්ච් එක අනුව වචන පෙරීම
            const filteredWords = allWords.filter(item => 
                item.word.toLowerCase().includes(searchTerm) || 
                item.definition.toLowerCase().includes(searchTerm)
            );

            if (filteredWords.length === 0) {
                wordListContainer.innerHTML = '<p style="text-align:center; opacity:0.6; margin-top:20px;">No words found.</p>';
                return;
            }

            // අලුත්ම වචන උඩට එන ලෙස පෙන්වීම
            filteredWords.slice().reverse().forEach((item) => {
                // Delete කිරීමේදී නිවැරදි Index එක ලබා ගැනීමට මුල් Array එකේ Index එක සොයා ගැනීම
                const originalIndex = allWords.indexOf(item);
                const wordDiv = document.createElement('div');
                wordDiv.className = 'word-item';
                
                wordDiv.innerHTML = `
                    <div class="word-title">${item.word}</div>
                    <div style="font-size:14px; opacity:0.9; margin-bottom:10px; color: var(--primary-color);">
                        ${item.definition}
                    </div>
                    <div class="btn-group">
                        <button class="listen-btn" data-word="${item.word}">Listen 🔊</button>
                        <button class="delete-btn" data-index="${originalIndex}">Delete</button>
                    </div>
                `;
                wordListContainer.appendChild(wordDiv);
            });

            attachButtonEvents();
        });
    }

    // Button Events සම්බන්ධ කිරීම
    function attachButtonEvents() {
        // Delete Function
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = () => {
                const indexToDelete = btn.getAttribute('data-index');
                deleteWord(indexToDelete);
            };
        });

        // Listen Function (Smart TTS)
        document.querySelectorAll('.listen-btn').forEach(btn => {
            btn.onclick = () => {
                const textToSpeak = btn.getAttribute('data-word');
                const utterance = new SpeechSynthesisUtterance(textToSpeak);
                
                // ඉංග්‍රීසි අකුරු ඇත්නම් පමණක් English Voice එක දීම
                if(/[a-zA-Z]/.test(textToSpeak)) {
                    utterance.lang = 'en-US';
                }
                
                window.speechSynthesis.speak(utterance);
            };
        });
    }

    // වචනයක් මකා දැමීම
    function deleteWord(index) {
        chrome.storage.local.get({ words: [] }, (result) => {
            let words = result.words;
            words.splice(index, 1);
            chrome.storage.local.set({ words: words }, () => {
                const currentSearch = searchInput ? searchInput.value.toLowerCase() : "";
                renderList(currentSearch);
            });
        });
    }

    // Excel (CSV) වලට පේළි මාරු නොවී Export කිරීම
    function exportToCSV() {
        chrome.storage.local.get({ words: [] }, (result) => {
            const words = result.words;
            if (words.length === 0) return alert("Export කිරීමට වචන නැත!");

            // සිංහල අකුරු සඳහා UTF-8 BOM එක
            let csvContent = "\uFEFF"; 
            csvContent += '"Original Word","Sinhala Meaning","Date"\n';

            words.forEach(item => {
                // දත්ත Quotes ඇතුළට දමා පේළි මාරුවීම වැළැක්වීම
                let word = `"${item.word.toString().replace(/"/g, '""')}"`;
                let meaning = `"${item.definition.toString().replace(/"/g, '""')}"`;
                let date = `"${item.date.toString().replace(/"/g, '""')}"`;
                
                csvContent += `${word},${meaning},${date}\n`;
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "My_Vocabulary_List.csv";
            link.click();
        });
    }

    // මුලින්ම ලිස්ට් එක පෙන්වීම
    renderList();
});