![Status](https://img.shields.io/badge/status-active-green)
![Type](https://img.shields.io/badge/type-chrome_extension-blue)

# VerifAI – Browser Content Risk Detection Extension

VerifAI is a Chrome extension that scans webpage content in real time and classifies text and images based on potential misinformation, advertising signals, and AI-generated content indicators.

## Features

- Real-time webpage scanning
- Risk classification system (Green / Yellow / Red / Orange / Purple)
- Keyword-based misinformation detection
- Advertising / sponsored content detection
- AI-generated image heuristic detection
- Hover-based explanations with tooltips
- Word-level highlighting of flagged phrases
## How It Works

VerifAI scans DOM elements on active webpages and evaluates text content using a rule-based flag system.

1. Text is extracted from relevant page elements
2. Content is matched against predefined risk keyword lists
3. A weighted scoring system assigns a risk level
4. Badges are rendered on detected elements
5. Hover interactions highlight triggering words and explain classification

## Tech Stack

- JavaScript (Vanilla)
- Chrome Extension APIs
- HTML/CSS

## Limitations

- Rule-based detection (no machine learning model)
- May produce false positives in short text snippets
- Performance depends on DOM structure of websites
- Reddit and dynamic sites require more advanced mutation observation for full coverage