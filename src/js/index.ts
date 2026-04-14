// Dynamic import for speed and our components
import "wind/assets/js/global";
import('./index/fontawesome');


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
  import('./index/shiki').then(s => s.loadShiki())

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


