# ChatGPT Table of Contents Extension

A Chrome extension that automatically generates and displays a table of contents for ChatGPT conversations in a convenient right sidebar.

This fork of [WindZZzzZZzz/gpt-toc-extension](https://github.com/WindZZzzZZzz/gpt-toc-extension)
includes compatibility fixes for current ChatGPT pages and a redesigned sidebar
with compact prompt summaries, heading counts, active-item highlighting, and
light/dark themes. The compatibility fix was contributed separately in
[upstream PR #20](https://github.com/WindZZzzZZzz/gpt-toc-extension/pull/20).

**Download:** [Source ZIP](https://github.com/quantai1314/gpt-toc-extension/archive/refs/heads/main.zip).
Extract it, then load the folder containing `manifest.json` in Chrome.
For a standalone UI demo, open `ui-preview.html` from the extracted folder.

## Features

- **Automatic TOC Generation**: Automatically detects headings (H1-H6) in ChatGPT responses
- **Smart Navigation**: Click any TOC item to jump directly to that section
- **Real-time Updates**: TOC updates automatically as new content is generated
- **Visual Feedback**: Highlights the target section when navigating
- **Operation Friendly**: Allow users to collapse sections in TOC

## Installation

### Method 1: Load as Unpacked Extension (Recommended for Development)

1. **Download or Clone** this repository to your local machine
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** by toggling the switch in the top-right corner
4. **Click "Load unpacked"** and select the folder containing this extension
5. **Navigate to ChatGPT** at `https://chatgpt.com/`
6. **Click the "目录" button** in the top-right corner of the page

### Method 2: Install from Chrome Web Store (When Available)

The store listing below is the upstream extension. This fork's redesign is
distributed through this repository; use the unpacked installation above.

- **Navigate to [Chrome Web Store](https://chromewebstore.google.com/detail/jjpmfdjghngpncajeffgdpfcedlpkdmg?utm_source=item-share-cb)**
- **Install the Extension** by clicking "Add to Chrome" button
- **Navigate to ChatGPT** at `https://chat.openai.com/`
- **Look for the "📋 TOC" button** in the top-right corner of the page

## Usage

1. **Open ChatGPT** and start a conversation
2. **Wait for the response** to be generated
3. **Click the "目录" button** in the top-right corner to open the sidebar
4. **Browse the table of contents** - headings are automatically detected and organized
5. **Click any TOC item** to jump to that section in the conversation
6. **Close the sidebar** by clicking the "×" button or the toggle button again

## How It Works

The extension:

1. **Monitors the page** for new content using MutationObserver
2. **Scans for headings** in ChatGPT assistant responses using multiple selectors
3. **Filters content** to only include headings from assistant messages
4. **Organizes headings** by their hierarchy (H1-H6) with proper indentation
5. **Provides navigation** with smooth scrolling and visual highlighting

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

### Standalone UI preview

Open `ui-preview.html` directly in a browser to review the visual redesign.
It is self-contained, uses sample conversation text, and supports light/dark
themes, heading navigation, keyboard activation, and collapsing sections.

The extension uses the local `content.js` and `styles.css`. `preview.html` is the
preview template; run `node build-preview.cjs` after edits to regenerate the
portable `ui-preview.html`. The redesign is included in this fork, separately
from the compatibility-only upstream PR #20.

### ChatGPT compatibility

The current ChatGPT UI can use `data-markdown-text-style="assistant-message"`
instead of `data-message-author-role="assistant"`. This copy supports both,
uses the preceding user message for each response, and updates the TOC when
messages stream, change, or disappear. Only messages currently present in the
page DOM can be indexed; virtualized history outside the DOM is not fetched.

After editing, reload **ChatGPT Table of Contents** in `chrome://extensions/`,
then refresh the ChatGPT tab. If the installed copy is in another directory,
load this directory as the unpacked extension and disable the old copy.

For regression checks, serve the repository locally:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/tests/regression.html`.
The page runs browser tests for current/legacy markup, streaming, navigation,
empty states, target replacement, literal text rendering, and observer loops.

If you encounter any issues or have questions:
1. Open an issue on GitHub
2. Check the browser console for error messages
