# Setup wizard captures

The first-run slideshow on the landing page (`#setup`) plays these in order.
Drop the screenshots in with exactly these names:

| File              | Wizard step        |
|-------------------|--------------------|
| `01-welcome.png`  | 1 · Welcome        |
| `02-engine.png`   | 2 · Engine         |
| `03-hotkey.png`   | 3 · Hotkey         |
| `04-overlay.png`  | 4 · Overlay        |
| `05-test.png`     | 5 · Test           |
| `06-voice.png`    | 6 · Voice          |
| `07-done.png`     | 7 · Done           |

Capture the whole app window — the slideshow adds no chrome of its own, because
these already carry the title bar and the wizard's step rail.

The stage is `aspect-ratio: 1340 / 1096` and the images are `object-fit: contain`,
so shots that share one size sit still as the slideshow advances. If your captures
use a different ratio, update `.ss-stage` in `css/wizard.css` to match rather than
letting each slide letterbox differently.

A file that is not here yet shows a "Screenshot not found" panel naming the path,
so the section stays legible until every capture has landed.
