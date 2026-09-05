# voxctrl Website

Marketing and documentation website for [voxctrl](https://github.com/jrufer/voxctrl) — a programmable
voice input broker for Linux and Windows.

Static HTML, no build step. The site is served under the `/voxctrl/` path; the root `index.html` is a
copy of `voxctrl/index.html` so the domain root serves the landing page too.

## Structure

```
index.html             # Copy of voxctrl/index.html, served at the domain root
voxctrl/index.html     # Landing page (hero, first-run walkthrough, settings, pipeline, features)
voxctrl/docs/          # Documentation pages (16)
voxctrl/css/           # base · components · docs · wizard · responsive
voxctrl/js/            # landing.js (incl. the first-run walkthrough player), docs.js
voxctrl/assets/        # Overlay clips, GIFs, images, favicon
voxctrl/public/        # llms.txt, favicons, icon sprite
changelog.md           # Release history, mirrors the app repo
```

## Local development

Any static server works, but it must serve the repository root, because every asset is referenced from
`/voxctrl/…`:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000/voxctrl/](http://localhost:8000/voxctrl/).

## Keeping content in sync

Feature claims on this site are meant to match the app repo. When a release lands, check these against
the code rather than the previous copy:

- Delivery types — `crates/voxctrl-routing/src/models.rs` (`DeliveryType`)
- Gestures — `crates/voxctrl-routing/src/models.rs` (`GestureType`)
- Config defaults — `crates/voxctrl-config/src/lib.rs`
- Wizard steps, engines, model sizes, TTS engines — `src/lib/Wizard/wizard-data.ts`
- Overlay styles — `src/lib/Overlay/`

The landing page's static `v0.4.0` labels are overwritten at runtime by the latest GitHub tag; they are
only the fallback when that request fails.

## The first-run walkthrough

The `#setup` section on the landing page is a hand-built recreation of the app's seven-step setup
wizard in HTML/CSS — not screenshots — so it stays crisp, responsive and theme-consistent. It plays
itself through the steps and can be paused or stepped manually. Markup lives in `voxctrl/index.html`,
styles in `voxctrl/css/wizard.css`, and the player in `voxctrl/js/landing.js`.
