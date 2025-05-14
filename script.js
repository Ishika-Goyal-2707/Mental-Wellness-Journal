const entryInput = document.getElementById('journalEntry');
    const calendar = document.getElementById('calendar');
    const moodSelect = document.getElementById('mood');
    const popup = document.getElementById('feedbackPopup');

    const moodEmojis = {
      happy: '😊',
      neutral: '😐',
      sad: '😢',
      angry: '😠',
      excited: '🤩'
    };

    const moodQuotes = {
      happy: "Happiness is not something ready made. It comes from your own actions. — Dalai Lama",
      neutral: "Sometimes, not having a plan is the best plan of all. — Unknown",
      sad: "Tears come from the heart and not from the brain. — Leonardo da Vinci",
      angry: "Speak when you are angry and you will make the best speech you will ever regret. — Ambrose Bierce",
      excited: "The future belongs to those who believe in the beauty of their dreams. — Eleanor Roosevelt"
    };

    moodSelect.addEventListener('change', () => {
      const mood = moodSelect.value;
      const quoteBox = document.getElementById('quoteBox');
      if (moodQuotes[mood]) {
        quoteBox.textContent = moodQuotes[mood];
        quoteBox.style.opacity = 1;
      } else {
        quoteBox.textContent = '';
        quoteBox.style.opacity = 0;
      }
    });

    let currentEditDate = null;

    function saveEntry() {
      const text = entryInput.value.trim();
      const selectedMood = moodSelect.value;
      if (!text || !selectedMood) return alert('Please select a mood and write something.');

      const dateKey = currentEditDate || new Date().toISOString().split('T')[0];
      const entry = { text, mood: selectedMood };
      const entries = JSON.parse(localStorage.getItem('entries') || '{}');
      entries[dateKey] = entry;
      localStorage.setItem('entries', JSON.stringify(entries));
      entryInput.value = '';
      moodSelect.value = '';
      currentEditDate = null;
      renderCalendar();
      showFeedbackPopup();
    }

    function renderCalendar() {
      const entries = JSON.parse(localStorage.getItem('entries') || '{}');
      calendar.innerHTML = '';
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        const entry = entries[dateKey];
        const div = document.createElement('div');
        div.className = 'day';
        div.dataset.date = dateKey;
        div.onclick = () => editEntry(dateKey);

        if (entry && moodEmojis[entry.mood]) {
          div.innerText = moodEmojis[entry.mood];
          div.title = `${dateKey}\n${entry.text}`;
          div.classList.add(entry.mood);

          const delBtn = document.createElement('button');
          delBtn.className = 'delete-btn';
          delBtn.innerText = '×';
          delBtn.onclick = (e) => {
            e.stopPropagation();
            deleteEntry(dateKey);
          };
          div.appendChild(delBtn);
        } else {
          div.innerText = date.getDate();
          div.title = `${dateKey}\nNo entry`;
        }
        calendar.appendChild(div);
      }
    }

    function editEntry(dateKey) {
      const entries = JSON.parse(localStorage.getItem('entries') || '{}');
      const entry = entries[dateKey];
      if (entry) {
        entryInput.value = entry.text;
        moodSelect.value = entry.mood;
        currentEditDate = dateKey;
      } else {
        alert('No entry exists for this date. You can create one.');
        entryInput.value = '';
        moodSelect.value = '';
        currentEditDate = dateKey;
      }
    }

    function deleteEntry(dateKey) {
      const entries = JSON.parse(localStorage.getItem('entries') || '{}');
      delete entries[dateKey];
      localStorage.setItem('entries', JSON.stringify(entries));
      if (currentEditDate === dateKey) {
        currentEditDate = null;
        entryInput.value = '';
        moodSelect.value = '';
      }
      renderCalendar();
    }

    function exportEntries() {
      const entries = JSON.parse(localStorage.getItem('entries') || '{}');
      const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'mindhaven_entries.json';
      link.click();
    }

    function toggleTheme() {
      document.body.classList.toggle('dark');
    }

    function showFeedbackPopup() {
      popup.classList.add('active');
      setTimeout(() => {
        popup.classList.remove('active');
      }, 2000);
    }

    function closePopup() {
      popup.classList.remove('active');
    }

    renderCalendar();