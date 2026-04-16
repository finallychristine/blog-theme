

export async function askAi() {
  // Claude button
  document.querySelectorAll('.ask-claude-btn').forEach(btn => {
    // Inject icon
    if (!btn.querySelector('.claude-icon')) {
      btn.insertAdjacentHTML('afterbegin', '<svg class="claude-icon"></svg>');
    }

    // Wire up click → open Claude with encoded prompt
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      if (!prompt) {
        return;
      }
      const url = `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
      window.open(url, '_blank', 'noopener');
    });
  });
}
