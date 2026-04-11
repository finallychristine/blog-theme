// Dynamic import for speed and our components
import {loadShiki} from "./shiki";

import('./fontawesome');



// The "pvs" framework created by the theme authors
// window.pvs?.initCodeHighlight({
//   clipboardButton: true,
//   lineNumbers: true,
//   languageBadge: true,
//   themes: {
//     light: 'github-light',
//     dark: 'github-dark',
//   },
// });
window.pvs?.initTOC();
window.pvs?.addExternalLinkAttributes();

document.addEventListener('DOMContentLoaded', async () => {
  const s = await import('./shiki')
  s.loadShiki() // don't care about awaiting loading shiki


  // Claude button
  document.querySelectorAll('.ask-claude-btn').forEach(btn => {
    // Inject icon
    if (!btn.querySelector('.claude-icon')) {
      btn.insertAdjacentHTML('afterbegin', '<object type="image/svg+xml" data="/assets/img/claude-icon.svg" "></object>');
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

})


