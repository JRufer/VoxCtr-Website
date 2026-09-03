# Changelog

## [v0.3.10] - 2026-09-03

Merge pull request #79: fix X11 event selection, release 0.3.10
Split the X11 event selection, or the server refuses every key (0.3.10)

---

## [v0.3.9] - 2026-09-03

Merge pull request #78: XInput 2.1 requirement and 0.3.9 release
Require XInput 2.1 for the X11 backend, and release 0.3.9

---

## [v0.3.8] - 2026-09-02

Merge pull request #76 from JRufer/claude/voxctrl-appimage-linux-compat-27p23v
AppImage: start on stock Mint 21 / Ubuntu 22.04 desktops; release 0.3.8

---

## [v0.3.7] - 2026-09-01

Merge pull request #70 from JRufer/feature/breeze-tts-2
Feature
Added the breeze TTS 2 engine
drastically improved the speed of Piper TTS

---

## [v0.3.6] - 2026-09-01

Feature: Added an optional overlay when a command is executed to let the user know that the command was picked up.
Updated version to v0.3.6

---

## [v0.3.5] - 2026-09-01

Bump version to 0.3.5 and update build artifacts

---

## [v0.3.4] - 2026-08-28

Update to V0.3.4

---

## [v0.3.3] - 2026-08-14

Merge pull request #69 from JRufer/claude/hotkey-listening-privacy-mi5bio
Deliver global shortcuts through the XDG portal instead of reading the keyboard

---

## [v0.3.2] - 2026-07-29

Add a chat output target for conversational LLM endpoints (#67)
Add a `chat` delivery type that POSTs to an OpenAI-compatible
`/v1/chat/completions` endpoint, carries the running conversation as context,
reads the reply back, and surfaces it — spoken via TTS, typed into the focused
window, copied to the clipboard, or discarded. This makes VoxCtrl a voice front
end for the same API Open WebUI talks to.
The existing targets could not do this: `http` discards the response body and
has nowhere for prior turns to accumulate, the OpenAI post-processing path is a
stateless filter whose output replaces the dictated text, and `pipe` +
`response_pipe` needs a bridge daemon that owns the history itself.
Conversations are keyed by target id and held outside the target, because
`OutputTargetRouter::reload` rebuilds every target when settings are saved.
Each carries its own lock so a slow model on one target cannot stall another.
A failed or empty completion rolls the unanswered turn back. A spoken reset
phrase clears the conversation hands-free.
Also fixes a pre-existing test-isolation race: `test_inject_target_success_and_failure`
and `test_clipboard_target_linux_cli` mutate the process-global `PATH` and
`WAYLAND_DISPLAY`, which made `test_clipboard_target_success` fail
intermittently on headless CI depending on thread interleaving.

---

## [v0.3.1] - 2026-07-12

Bump the version up to 0.3.1

---

## [v0.3.0] - 2026-07-06

Merge pull request #62 from JRufer/claude/moonlight-glibc-fix
Fix Moonshine Linux release link error on older glibc

---

## [v0.2.8] - 2026-07-06

Merge pull request #62 from JRufer/claude/moonlight-glibc-fix
Fix Moonshine Linux release link error on older glibc

---

## [v0.2.7] - 2026-06-27

Merge pull request #59 from JRufer/claude/quirky-lamport-0mcsk2
Replace Kokoro TTS engine with Pocket-TTS

---

## [v0.2.6] - 2026-06-19

Merge pull request #54 from JRufer/claude/serene-tesla-qdfow5
ci: stop bundling host graphics/Wayland libs in the AppImage (fixes overlay-once)

---

## [v0.2.4] - 2026-06-19

Merge pull request #52 from JRufer/claude/serene-tesla-qdfow5
Version bump to v0.2.4 + build releases on push to master

---

## [v0.2.3.3] - 2026-06-18

Merge pull request #48 from JRufer/claude/serene-tesla-qdfow5
fix(packaging): bundle voxctrl-overlay sidecar + update tray icon on main thread

---

## [v0.2.3.2] - 2026-06-17

fix: another pass at build script.

---

## [v0.2.3.1] - 2026-06-17

fix" windows build script

---

## [v0.2.3] - 2026-06-17

Version Bump to v0.2.3

---

## [v0.2.2] - 2026-06-14

Version Bump to v0.2.2

---

## [v0.2.1] - 2026-06-14

Version Bump to v0.2.1

---

## [v0.2.0] - 2026-06-11

Merge remote-tracking branch 'origin/development'

---

## [v0.1.12] - 2026-06-06

Merge branch 'development'

---

## [v0.1.11] - 2026-06-06

version bump to v0.1.11

---

## [v0.1.10] - 2026-06-03

bump version to v0.1.10

---

## [v0.1.9] - 2026-06-02

version bump

---

## [v0.1.8] - 2026-05-31

update version to v0.1.8

---

## [v0.1.7] - 2026-05-31

Merge branch 'claude/voice-model-folder-settings-vSnhJ' into development

---

## [v0.1.6] - 2026-05-31

fix: pass --bundles deb directly to tauri binary for Linux CUDA build
npm run tauri build -- --bundles deb sends --bundles to cargo (not tauri)
because everything after -- is treated as cargo args. Calling
node_modules/.bin/tauri build --bundles deb -- --features cuda
puts --bundles before the cargo separator so tauri sees it correctly.
https://claude.ai/code/session_01WPCPCafF4rYNGMB11XuEFS

---

## [v0.1.6] - 2026-05-30

fix: search workspace for bundle artifacts instead of hardcoded path
Tauri may place bundles under src-tauri/target or the workspace target
depending on CLI version and workspace config. Searching from the repo
root finds them either way. Also adds a diagnostic fallback on Windows
that lists all .exe/.msi files when the bundle directory search finds
nothing, making future failures easier to diagnose.
https://claude.ai/code/session_01WPCPCafF4rYNGMB11XuEFS

---

## [v0.1.6] - 2026-05-30

chore: bump version to 0.1.6
v0.1.4 and v0.1.5 tags existed at pre-fix commits; 0.1.6 ensures the
release build includes all Windows fixes (E0282 annotation, unused
import, correct bundle artifact path).
https://claude.ai/code/session_01WPCPCafF4rYNGMB11XuEFS

---

## [v0.1.6] - 2026-05-30

Fix correctly updated version number v0.1.3

---

## [v0.1.6] - 2026-05-30

Fix correctly updated version number v0.1.3

---

## [v0.1.5] - 2026-05-30

fix: annotate pos type to resolve E0282 on Windows
On Windows, the #[cfg(target_os = "linux")] blocks that use `pos` are
compiled out, leaving the compiler unable to infer the Option type.
Explicit annotation fixes the build without affecting Linux behaviour.
https://claude.ai/code/session_01WPCPCafF4rYNGMB11XuEFS

---

## [v0.1.4] - 2026-05-30

Feature: added support for selecting which monitor the overlay appears on. Also bumping the version to v0.1.4

---

## [v0.1.3] - 2026-05-26

updated version number

---

## [v0.1.2] - 2026-05-25

feat: update frontend styles and rebuild application assets

---

## [v0.1.1] - 2026-05-25

Merge pull request #33 from JRufer/claude/friendly-mccarthy-M5ZUT
UI fixes: Routing hotkey layout, History screen styling, and history enable/disable setting

---

## [v0.1.0] - 2026-05-24

fix: prep the app for appimage release,

---

All voxctrl releases are listed here. Entries are added automatically when a new
tag is pushed to the [voxctrl](https://github.com/jrufer/voxctrl) repository.

---
