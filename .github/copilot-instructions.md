# Copilot instructions for this repo

## Project shape
- This repo is a tiny static web page, not a framework app. The entry point is `hello.html`; styling lives in `hello.css`.
- There is no package.json, build step, bundler, or test runner. Treat it as a plain HTML/CSS/vanilla JS project.
- The page is intentionally simple: a form with a name input, a button, and a greeting area that updates from JavaScript.

## Key files and patterns
- `hello.html` contains the DOM structure, stylesheet link, and the inline behavior in a `<script>` block.
- The current interaction pattern expects specific IDs: `fname` for the input and `greeting` for the output paragraph.
- `hello.css` is the single stylesheet. Keep global selectors simple (`body`, `p`, `h1`) unless adding a clearly scoped class/id.
- Prefer lightweight, direct DOM manipulation (`document.getElementById(...)`) over introducing libraries or frameworks.

## Coding conventions
- Keep styling and behavior change small and local. Do not add a framework, build tooling, or dependency manager to a project this simple.
- When updating the greeting logic, keep the same DOM contract as the existing code (`id="fname"`, `id="greeting"`, button click handler).
- Preserve the current HTML structure and semantic elements: form, label, input, and button. Avoid overcomplicating the markup.
- Use inline JS in `hello.html` for small interactive pieces; do not move it into separate JS files unless the project expands significantly.

## Workflow and validation
- Open `hello.html` directly in a browser for quick validation, or serve the folder locally with `python3 -m http.server` from the repo root.
- Check the result visually after any UI or behavior change; there are no automated tests to run.
- If you add new elements, make sure the associated CSS selectors and JS references match the exact IDs or class names used in the markup.

## AI-agent guidance
- Keep changes compatible with the current static-file setup. Favor edits to `hello.html` and `hello.css` over introducing new architecture.
- Before adding new features, verify whether they can be implemented using the existing simple HTML/CSS/JS model rather than introducing a framework.
- If this project grows, prefer a minimal architectural evolution (e.g., separate JS module) rather than adopting a full app stack without clear need.
