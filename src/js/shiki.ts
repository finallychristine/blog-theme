import { createHighlighterCore, codeToHtml } from '@shikijs/core';
import { createOnigurumaEngine } from '@shikijs/engine-oniguruma';
import { Element, Root } from 'hast';
import { h } from 'hastscript';

const highlighterPromise = createHighlighterCore({
  langs: [
    import('@shikijs/langs/go'),
    import('@shikijs/langs/kotlin'),
  ],
  themes: [
    import('@shikijs/themes/github-light'),
    import('@shikijs/themes/github-dark'),
  ],
  engine: createOnigurumaEngine(import('@shikijs/engine-oniguruma/wasm-inlined')),
})

// Shiki code highlighting
export async function loadShiki() {
  const highlighter = await highlighterPromise;
  for (const code of document.querySelectorAll('pre:not(.shiki) > code')) {
    const language: string = code.className.replace("language-", "") || "text";

    const html = codeToHtml(highlighter, code.textContent, {
      lang: language,
      // rootStyle: 'has-line-numbers',
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      transformers: [
        {
          pre(node: Element) {
            this.addClassToHast(node, 'has-line-numbers')
            const x = h('.foo')
            node.children.push(
              // Copy icon
              h('button', { class: 'copy-button', role: 'button', 'aria-label': 'Copy code'}, [
                h('i.fa-regular.fa-copy')
              ]),
              h('span', { class: 'language-badge' }, [ language ])
            )
          },
        }
      ]
    })

    const pre = code.parentElement
    if (pre != null) {
      pre.outerHTML = html
    }
  }
}
