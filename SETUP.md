# Index auto-check — setup

## Install
Copy this whole structure into the root of the `vdo-team` repo:

```
vdo-team/
  .github/workflows/index-check.yml
  scripts/scan-index.mjs
  index.html            (already exists)
```

## One-time repo setting
GitHub blocks Actions from opening PRs by default. Turn it on:
**Repo → Settings → Actions → General → Workflow permissions →
check "Allow GitHub Actions to create and approve pull requests" → Save.**

## What happens on push
1. Push any `.html` file to `main`.
2. The workflow scans the repo root for `.html` files not yet linked from `index.html`.
3. If it finds any, it opens a PR named **"Index: new page(s) detected"** with a stub
   entry already added under a new **"Needs description"** category — title
   auto-generated from the filename, description left as a placeholder.
4. You edit the stub's title/description/category in the PR (or after merging),
   write the real copy, move it into the right grouping, and merge.

## What it will never do
- Never merges automatically — always a PR, always reviewed
- Never rewrites or removes existing entries
- Never touches anything but `index.html`

If a page is intentionally internal-only and shouldn't be indexed (a draft, a
scratch file), just close the PR without merging — the stub only exists on
that branch until you do.
