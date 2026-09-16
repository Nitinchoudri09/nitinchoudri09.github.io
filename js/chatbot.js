// =====================================================
//  Nitin Choudri Portfolio – AI Chatbot
// =====================================================
//
//  PRODUCTION:  'https://nitinchoudri09-github-io.onrender.com'
//  LOCAL DEV:   'http://localhost:3001'
//
const BACKEND_URL = 'https://nitinchoudri09-github-io.onrender.com';
// =====================================================

const SUGGESTED_QUESTIONS = [
  'Who is Nitin Choudri?',
  'What projects has Nitin built?',
  'What is HirePilot?',
  'What technologies does Nitin know?',
  'Does Nitin have QA/testing experience?',
  'How can I contact Nitin?',
];

const WELCOME_MESSAGE =
  "Hi! 👋 I'm Nitin's AI portfolio assistant. Ask me about his projects, skills, or experience.";

class PortfolioChatbot {
  constructor() {
    this.isOpen = false;
    this.conversation = [];   // {role:'user'|'assistant', content:string}[]
    this.isTyping = false;
    this.suggestionsVisible = true;
    this.init();
  }

  /* ──────────────────────────────────────────────
     Init
  ────────────────────────────────────────────── */
  init() {
    this.injectHTML();
    this.bindElements();
    this.bindEvents();
    this.showWelcomeMessage();
    this.renderSuggestions();
  }

  /* ──────────────────────────────────────────────
     Inject chatbot HTML into body
  ────────────────────────────────────────────── */
  injectHTML() {
    const html = `
      <!-- Chatbot Toggle -->
      <button class="chatbot-toggle" id="chatbotToggle"
        aria-label="Open AI Portfolio Assistant"
        title="Ask me about Nitin">
        <i class="fas fa-robot chatbot-icon-open" aria-hidden="true"></i>
        <i class="fas fa-times chatbot-icon-close" aria-hidden="true"></i>
        <span class="chatbot-badge" aria-hidden="true">AI</span>
      </button>

      <!-- Chat Window -->
      <div class="chatbot-window" id="chatbotWindow"
        role="dialog"
        aria-label="AI Portfolio Assistant"
        aria-modal="true"
        aria-hidden="true">

        <!-- Header -->
        <div class="chatbot-header">
          <div class="chatbot-header-info">
            <div class="chatbot-avatar" aria-hidden="true">
              <i class="fas fa-robot"></i>
              <span class="chatbot-status-dot"></span>
            </div>
            <div>
              <h4>Portfolio Assistant</h4>
              <span class="chatbot-subtitle">Powered by Gemini AI</span>
            </div>
          </div>
          <div class="chatbot-header-actions">
            <button class="chatbot-action-btn" id="chatbotClear"
              aria-label="Clear conversation" title="Clear chat">
              <i class="fas fa-trash-alt" aria-hidden="true"></i>
            </button>
            <button class="chatbot-action-btn" id="chatbotClose"
              aria-label="Close chat" title="Close">
              <i class="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div class="chatbot-messages" id="chatbotMessages"
          role="log" aria-live="polite" aria-label="Chat messages"></div>

        <!-- Suggested questions -->
        <div class="chatbot-suggestions" id="chatbotSuggestions"
          aria-label="Suggested questions"></div>

        <!-- Input row -->
        <div class="chatbot-input-area">
          <textarea
            class="chatbot-input"
            id="chatbotInput"
            placeholder="Ask me anything about Nitin..."
            rows="1"
            maxlength="500"
            aria-label="Type your message. Press Enter to send, Shift+Enter for new line."
          ></textarea>
          <button class="chatbot-send-btn" id="chatbotSend"
            aria-label="Send message">
            <i class="fas fa-paper-plane" aria-hidden="true"></i>
          </button>
        </div>

        <p class="chatbot-footer-note" aria-hidden="true">
          Answers based on Nitin's portfolio data only
        </p>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  /* ──────────────────────────────────────────────
     Cache DOM references
  ────────────────────────────────────────────── */
  bindElements() {
    this.toggleBtn   = document.getElementById('chatbotToggle');
    this.windowEl    = document.getElementById('chatbotWindow');
    this.messagesEl  = document.getElementById('chatbotMessages');
    this.inputEl     = document.getElementById('chatbotInput');
    this.sendBtn     = document.getElementById('chatbotSend');
    this.closeBtn    = document.getElementById('chatbotClose');
    this.clearBtn    = document.getElementById('chatbotClear');
    this.suggestionsEl = document.getElementById('chatbotSuggestions');
  }

  /* ──────────────────────────────────────────────
     Events
  ────────────────────────────────────────────── */
  bindEvents() {
    this.toggleBtn.addEventListener('click', () => this.toggleWindow());
    this.closeBtn.addEventListener('click', () => this.toggleWindow(false));
    this.clearBtn.addEventListener('click', () => this.clearChat());
    this.sendBtn.addEventListener('click', () => this.sendMessage());

    // Enter = send, Shift+Enter = newline
    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Auto-resize textarea
    this.inputEl.addEventListener('input', () => {
      this.inputEl.style.height = 'auto';
      this.inputEl.style.height = Math.min(this.inputEl.scrollHeight, 100) + 'px';
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.toggleWindow(false);
    });
  }

  /* ──────────────────────────────────────────────
     Toggle window open/close
  ────────────────────────────────────────────── */
  toggleWindow(forceState) {
    this.isOpen = forceState !== undefined ? forceState : !this.isOpen;
    this.windowEl.classList.toggle('chatbot-open', this.isOpen);
    this.toggleBtn.classList.toggle('chatbot-active', this.isOpen);
    this.windowEl.setAttribute('aria-hidden', String(!this.isOpen));

    if (this.isOpen) {
      setTimeout(() => this.inputEl.focus(), 350);
      this.scrollToBottom();
    }
  }

  /* ──────────────────────────────────────────────
     Suggested questions
  ────────────────────────────────────────────── */
  renderSuggestions() {
    this.suggestionsEl.innerHTML = SUGGESTED_QUESTIONS.map(q =>
      `<button class="chatbot-suggestion-btn" data-question="${this.escapeAttr(q)}">${this.escapeHtml(q)}</button>`
    ).join('');

    this.suggestionsEl.querySelectorAll('.chatbot-suggestion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.inputEl.value = btn.getAttribute('data-question');
        this.sendMessage();
      });
    });
  }

  hideSuggestions() {
    if (this.suggestionsVisible) {
      this.suggestionsEl.style.display = 'none';
      this.suggestionsVisible = false;
    }
  }

  /* ──────────────────────────────────────────────
     Welcome message
  ────────────────────────────────────────────── */
  showWelcomeMessage() {
    this.appendMessage('bot', WELCOME_MESSAGE, false);
  }

  /* ──────────────────────────────────────────────
     Append a message bubble to the chat
  ────────────────────────────────────────────── */
  appendMessage(role, content, track = true) {
    const row = document.createElement('div');
    row.className = `chatbot-msg chatbot-msg-${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'chatbot-bubble';
    bubble.innerHTML = this.formatContent(content);

    const time = document.createElement('span');
    time.className = 'chatbot-time';
    time.setAttribute('aria-label', `Sent at ${this.formatTime()}`);
    time.textContent = this.formatTime();

    row.appendChild(bubble);
    row.appendChild(time);
    this.messagesEl.appendChild(row);
    this.scrollToBottom();

    if (track) {
      this.conversation.push({
        role: role === 'bot' ? 'assistant' : 'user',
        content,
      });
    }
  }

  /* ──────────────────────────────────────────────
     Typing indicator
  ────────────────────────────────────────────── */
  showTypingIndicator() {
    const row = document.createElement('div');
    row.className = 'chatbot-msg chatbot-msg-bot chatbot-typing-msg';
    row.setAttribute('aria-label', 'AI is typing');
    row.innerHTML = `
      <div class="chatbot-bubble chatbot-typing" aria-hidden="true">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>`;
    this.messagesEl.appendChild(row);
    this.scrollToBottom();
    return row;
  }

  removeTypingIndicator(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  /* ──────────────────────────────────────────────
     Send message to backend
  ────────────────────────────────────────────── */
  async sendMessage() {
    const text = this.inputEl.value.trim();
    if (!text || this.isTyping) return;

    // Reset input
    this.inputEl.value = '';
    this.inputEl.style.height = 'auto';
    this.hideSuggestions();

    this.appendMessage('user', text);

    // Lock UI
    this.isTyping = true;
    this.sendBtn.disabled = true;
    this.inputEl.disabled = true;

    const typingEl = this.showTypingIndicator();

    try {
      const controller = new AbortController();
      // Increase timeout to 60 seconds (Render free tier can take up to 50s to wake up from sleep)
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversation: this.conversation.slice(-10),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error (${res.status})`);
      }

      const data = await res.json();
      this.removeTypingIndicator(typingEl);
      this.appendMessage('bot', data.reply || 'Sorry, I received an empty response.');

    } catch (err) {
      this.removeTypingIndicator(typingEl);

      let userMsg;
      if (err.name === 'AbortError') {
        userMsg = '⏱️ Request timed out. Please try again.';
      } else if (!navigator.onLine) {
        userMsg = '📶 You appear to be offline. Please check your connection.';
      } else {
        userMsg = `⚠️ ${err.message || 'Something went wrong. Please try again.'}`;
      }

      this.appendMessage('bot', userMsg);

    } finally {
      this.isTyping = false;
      this.sendBtn.disabled = false;
      this.inputEl.disabled = false;
      this.inputEl.focus();
    }
  }

  /* ──────────────────────────────────────────────
     Clear chat
  ────────────────────────────────────────────── */
  clearChat() {
    this.messagesEl.innerHTML = '';
    this.conversation = [];
    this.suggestionsEl.style.display = '';
    this.suggestionsVisible = true;
    this.showWelcomeMessage();
    this.renderSuggestions();
  }

  /* ──────────────────────────────────────────────
     Format AI content for display
  ────────────────────────────────────────────── */
  formatContent(raw) {
    // Escape HTML first
    let text = this.escapeHtml(raw);

    // Bold **text**
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Bullet points (• or - at line start)
    text = text.replace(/^[•\-] (.+)$/gm, '<li>$1</li>');
    // Wrap consecutive <li> in <ul>
    text = text.replace(/(<li>[\s\S]*?<\/li>)(\n<li>|$)/g, (m) => m);
    text = text.replace(/((?:<li>.*?<\/li>\n?)+)/g, '<ul>$1</ul>');

    // Clickable links
    text = text.replace(
      /(https?:\/\/[^\s<"]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Line breaks
    text = text.replace(/\n\n/g, '<br><br>');
    text = text.replace(/\n/g, '<br>');

    return text;
  }

  /* ──────────────────────────────────────────────
     Utilities
  ────────────────────────────────────────────── */
  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;');
  }

  formatTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  scrollToBottom() {
    requestAnimationFrame(() => {
      this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    });
  }
}

/* ─── Boot ─────────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new PortfolioChatbot());
} else {
  new PortfolioChatbot();
}
