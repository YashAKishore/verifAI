![Status](https://img.shields.io/badge/status-active-green)
![Type](https://img.shields.io/badge/type-chrome_extension-blue)

# VerifAI – Browser Content Risk Detection Extension

VerifAI is a Chrome extension that performs real-time analysis of webpage content to classify text and images based on potential misinformation signals, advertising indicators, and AI-generated content heuristics. It is designed as a rule-based content transparency tool for web browsing environments.

---

## Live Demo (No Installation Required)

A fully interactive demonstration of the system is available here:

👉 https://yashakishore.github.io/verifAI/test-pages/pages/

This demo simulates:
- Content scanning behaviour
- Risk classification system
- Badge and highlight UI interactions
- Example misinformation and advertisement cases

---

## Features

- Real-time webpage scanning of selected DOM elements
- Risk classification system:
    - Green (Reliable)
    - Yellow (Low confidence / minor signals)
    - Red (High misinformation risk)
    - Orange (Advertising / sponsored content)
    - Purple (AI-generated image heuristic)
- Keyword-based misinformation detection
- Advertising and sponsored content detection
- AI-generated image heuristics (URL-based detection)
- Hover-based explanations via tooltips
- Word-level highlighting of detected trigger phrases

---

## How It Works

VerifAI operates using a rule-based content analysis pipeline:

1. Extracts text content from relevant DOM elements
2. Matches content against predefined risk keyword sets
3. Applies weighted classification rules to determine risk level
4. Injects visual badges into the webpage UI
5. Enables interactive hover states:
    - Explains classification reasoning
    - Highlights triggering keywords in context

---

## Installation (Chrome Extension – Developer Mode)

To run the full extension locally:

1. Download or clone this repository
2. Open Google Chrome and navigate to:
3. 3. Enable **Developer Mode** (top-right toggle)
4. Click **Load unpacked**
5. Select the `/extension` folder from this repository
6. Pin the extension for easy access

---

## Download (ZIP)

If you cannot clone the repository, you can download the full project as a ZIP file:

[![Download ZIP](https://img.shields.io/badge/Download-ZIP-blue)](https://github.com/YashAKishore/verifAI/archive/refs/heads/main.zip)

This includes:
- Chrome extension source code
- Test pages demo environment
- README and supporting assets

To install after downloading:
1. Extract the ZIP file
2. Follow the installation steps under "Installation (Chrome Extension – Developer Mode)"

---

## Test Pages (Controlled Evaluation Environment)

The repository includes a dedicated testing environment:

👉 https://yashakishore.github.io/verifAI/test-pages/pages/

This environment provides:
- Simulated news articles
- Controlled misinformation examples
- Advertising/sponsored content samples
- AI-generated text and image examples
- Consistent DOM structure for testing detection accuracy

It is designed to ensure reliable evaluation even if the extension cannot be installed due to browser restrictions.

---

## Tech Stack

- JavaScript (Vanilla)
- Chrome Extensions API (Manifest V3)
- HTML / CSS
- DOM Tree Parsing & Mutation Handling

---

## Limitations

- Rule-based system (no machine learning model integration)
- Potential false positives in short or ambiguous text
- Performance depends on DOM complexity of visited sites
- Dynamic content platforms (e.g. Reddit, infinite scroll feeds) require MutationObserver enhancements for full coverage

