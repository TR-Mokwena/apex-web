# Apex — LaTeX docs

Planning/design documents for the Apex ecosystem, kept as LaTeX (not part of the Next.js build).

## Contents
- `apex-integrations.tex` — candidate products to build alongside Apex (OmniConnect SA, Eclipse Bill, Eclipse Status, Eclipse Voice, Git/CI insights, Pulse, AI-over-WhatsApp, Eclipse Pay), with each one's Apex integration surface, SA angle, build effort and a priority summary.

## Build
Compile to PDF with any TeX distribution (TeX Live / MiKTeX):

```bash
pdflatex apex-integrations.tex
```

Uses only standard packages (`geometry`, `booktabs`, `array`, `enumitem`, `xcolor`, `titlesec`, `hyperref`).
