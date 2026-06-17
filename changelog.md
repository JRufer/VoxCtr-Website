# Changelog

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
