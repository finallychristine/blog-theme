// Dynamic import for speed and our components
import "wind/assets/js/global";
import('./index/fontawesome');

document.addEventListener('DOMContentLoaded', async () => {
  import('./index/shiki').then(s => s.loadShiki())
  import('./index/ask-ai').then(a => a.askAi())
})


