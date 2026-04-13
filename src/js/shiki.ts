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
  for (const code of document.querySelectorAll(PENDING_SHIKI_SELECTOR)) {
    loadShikiToCodeBlock(code, code.parentElement!!, highlighter)
  }
}

function loadShikiToCodeBlock(code: Element, pre: Element, highlighter: HighlighterCore) {
  const language: string = code.className.replace("language-", "") || "text";
  const rawCode = code.textContent;

  const hastRoot = codeToHast(highlighter, code.textContent, {
    lang: language,
    // rootStyle: 'has-line-numbers',
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
    transformers: [
      {
        pre(node: HElement) {
          this.addClassToHast(node, 'has-line-numbers')
          node.children.push(
            // Copy icon
            h('button', {class: 'copy-button', role: 'button', 'aria-label': 'Copy code'}, [
              COPY_ICON,
            ]),
            h('span', {class: 'language-badge'}, [language])
          )
        },
      }
    ]
  })

  const dom: Document = <Document>toDom(hastRoot)
  pre.replaceWith(dom)

  const copyBtn = dom.querySelector('.copy-button')!!
  const icon = copyBtn.querySelector('i')!!
  console.log(icon)
  copyBtn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(rawCode)
    copyBtn.innerHTML = CHECK_ICON_HTML;
    setTimeout(() => {
      copyBtn.innerHTML = COPY_ICON_HTML;
    }, 2000)
  })
}
