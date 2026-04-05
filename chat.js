// ── CT Holdings AI Chat Widget ──
// Proxy: https://ct-holdings.onrender.com/chat

const SYSTEM_PROMPT = `You are the helpful AI assistant for CT Holdings and Investments (Pty) Ltd, a South African bookkeeping and tax compliance firm.

Key facts:
- Registered company: 2025/230601/07, incorporated 17 March 2025
- Directors: Charlie Mokoena (+27 60 951 1263, csmokoena11@gmail.com) and Tlisetso Malemule (+27 64 883 3476, tisetsoclio98@gmail.com)
- Address: 3006 Thembelihle Street, Slovo-Winterveld, Pretoria, Gauteng, 0198
- Website: https://www.ctholdings.co.za

Services & Pricing (all excl. VAT):
- Bookkeeping Starter: R500/month (10-59 transactions, non-VAT registered)
- Bookkeeping Core SME: R1,500/month (60-150 transactions, VAT registered, includes VAT schedules, P&L, balance sheet)
- Bookkeeping SME + Payroll: R4,000+/month (multiple employees, full payroll, EMP201, management reports)
- Standard VAT Return: R1,200 + 10% consumables
- Complex VAT Return: R1,600 + 20% consumables
- Individual ITR12 tax return: R500 + 10% consumables
- Basic business tax return: R1,600 + 20% consumables
- Complex business tax return: R4,500+ + 20% consumables
- Books clean-up/backlog: R500-R2,000 once-off

Answer questions helpfully and concisely. Keep replies short — 2-4 sentences max unless more detail is needed. If someone asks to book or get a quote, direct them to https://www.ctholdings.co.za/quote.html or suggest calling/WhatsApping the directors. Do not make up information not listed above.`;

(function () {
  const aiFab   = document.getElementById('aiFab');
  const aiPanel = document.getElementById('aiPanel');
  const aiClose = document.getElementById('aiClose');
  const aiInput = document.getElementById('aiInput');
  const aiSend  = document.getElementById('aiSend');
  const aiMsgs  = document.getElementById('aiMessages');

  let chatOpen    = false;
  let chatHistory = [];

  function toggleChat() {
    chatOpen = !chatOpen;
    aiPanel.classList.toggle('open', chatOpen);
    if (chatOpen) setTimeout(() => aiInput.focus(), 300);
  }

  aiFab.addEventListener('click', toggleChat);
  aiFab.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') toggleChat(); });
  aiClose.addEventListener('click', toggleChat);

  function appendMsg(text, role) {
    const div = document.createElement('div');
    div.className = `ai-msg ${role}`;
    div.textContent = text;
    aiMsgs.appendChild(div);
    aiMsgs.scrollTop = aiMsgs.scrollHeight;
    return div;
  }

  async function sendMessage() {
    const text = aiInput.value.trim();
    if (!text) return;

    aiInput.value = '';
    aiInput.style.height = 'auto';
    aiSend.disabled = true;

    appendMsg(text, 'user');
    chatHistory.push({ role: 'user', content: text });

    const typingEl = appendMsg('Typing…', 'typing');

    try {
      const res = await fetch('https://ct-holdings.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: chatHistory,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const reply = data.reply || 'Sorry, I had trouble responding. Please try again.';

      typingEl.remove();
      appendMsg(reply, 'bot');
      chatHistory.push({ role: 'assistant', content: reply });

    } catch (err) {
      console.error('Chat error:', err);
      typingEl.remove();
      appendMsg('Something went wrong. Please try again or contact us directly.', 'bot');
    } finally {
      aiSend.disabled = false;
    }
  }

  aiSend.addEventListener('click', sendMessage);
  aiInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  aiInput.addEventListener('input', () => {
    aiInput.style.height = 'auto';
    aiInput.style.height = `${Math.min(aiInput.scrollHeight, 120)}px`;
  });
})();
