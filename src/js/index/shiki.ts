import {createHighlighterCore, codeToHast, HighlighterCore} from '@shikijs/core';
import { createOnigurumaEngine } from '@shikijs/engine-oniguruma';
import { Element as HElement } from 'hast';
import { h } from 'hastscript';
import { toDom } from 'hast-util-to-dom'
import { toHtml } from 'hast-util-to-html';

const PENDING_SHIKI_SELECTOR = 'pre:not(.shiki) > code';

const COPY_ICON = h('i.fa-regular.fa-copy')
const COPY_ICON_HTML = toHtml(COPY_ICON)

const CHECK_ICON = h('i.fa-solid.fa-check')
const CHECK_ICON_HTML = toHtml(CHECK_ICON)

const highlighterPromise = createHighlighterCore({
  langs: [
    import('@shikijs/langs/go'),
    import('@shikijs/langs/kotlin'),
    import('@shikijs/langs/html'),
    import('@shikijs/langs/ruby'),
  ],
  themes: [
    import('@shikijs/themes/dracula-soft'),
  ],
  engine: createOnigurumaEngine(import('@shikijs/engine-oniguruma/wasm-inlined')),
})

// Shiki code highlighting
export async function loadShiki() {
  const highlighter = await highlighterPromise;
  for (const code of document.querySelectorAll(PENDING_SHIKI_SELECTOR)) {
    loadShikiToCodeBlock(code, code.parentElement!!, highlighter)
  }
}

function loadShikiToCodeBlock(code: Element, pre: Element, highlighter: HighlighterCore) {
  const language: string = code.className.replace("language-", "") || "text";
  const rawCode = code.textContent;

  const hastRoot = codeToHast(highlighter, code.textContent, {
    lang: language,
    themes: {
      light: 'dracula-soft',
      dark: 'dracula-soft',
    },
    transformers: [
      {
        pre(node: HElement) {
          this.addClassToHast(node, 'has-line-numbers')
          node.children.unshift(
            // Copy icon
            h('button', {class: 'code-badge copy-button', role: 'button', 'aria-label': 'Copy code'}, [
              COPY_ICON,
            ]),
            h('span', {class: 'code-badge language-badge'}, [language])
          )
        },
      }
    ]
  })

  const dom = (<Document>toDom(hastRoot)).children[0]
  pre.replaceWith(dom)

  const copyBtn = dom.querySelector('.copy-button')!!
  const icon = copyBtn.querySelector('i')!!
  copyBtn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(rawCode)
    copyBtn.innerHTML = CHECK_ICON_HTML;
    setTimeout(() => {
      copyBtn.innerHTML = COPY_ICON_HTML;
    }, 2000)
  })
}
