interface Window {
  pvs: PVS;
}


interface PVS {
  initTOC(): void;
  addExternalLinkAttributes(): void;
  initCodeHighlight(options: codeHighlightOptions): void;
}

type codeHighlightOptions = {
  clipboardButton?: boolean,
  clipboardButtonCopiedBadge?: string,
  clipboardButtonErrorBadge?: null,
  lineNumbers?: boolean,
  languageBadge: boolean,
  shikiUrl?: string, // default: "https://cdn.jsdelivr.net/npm/shiki@3.13/+esm",
  themes?: {
    light?: string,
    dark?: string,
  },
}
