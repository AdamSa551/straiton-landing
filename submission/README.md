# Submission note, print version

`Straiton-Submission-Note.pdf` is the rationale note as a designed A4 document,
for attaching to the LinkedIn reply. Its content is the same as
`../SUBMISSION-NOTE.md`, which stays the plain text source of truth.

It is drawn from the same token layer as the page: the `:root` block in
`submission-note.html` is lifted from `app/globals.css`, including the six
measured contrast corrections, so the document a reviewer reads is built from
the system it describes.

## Regenerating

Edit `submission-note.html`, then:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-sandbox \
  --virtual-time-budget=15000 \
  --run-all-compositor-stages-before-draw \
  --print-to-pdf-no-header \
  --print-to-pdf="submission/Straiton-Submission-Note.pdf" \
  "file://$PWD/submission/submission-note.html"
```

Chrome is used rather than a Markdown-to-PDF converter because the layout needs
real CSS: the full-bleed cover, the page-break control, and the print colour
adjust that keeps the ink grounds from being dropped by the print pipeline.

Fonts load from Google Fonts at render time and are embedded in the output, so
the PDF is self-contained. `--virtual-time-budget` is what gives them time to
arrive before the page is captured.
