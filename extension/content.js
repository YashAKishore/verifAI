let verifAIActive = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.type === "TOGGLE_VERIFAI") {
        verifAIActive = message.enabled;

        if (verifAIActive) {
            scanPage();
        } else {
            clearAll();
        }
    }
});

function scanPage() {
    const elements = document.querySelectorAll("p, h1, h2, h3, article, img");

    elements.forEach(el => {
        if (el.tagName === "IMG") {
            scanImage(el);
        } else {
            scanText(el);
        }
    });
}

function scanText(el) {
    const text = el.innerText?.toLowerCase() || "";

    if (!text) return;

    if (text.includes("miracle") || text.includes("lose weight fast")) {
        el.style.outline = "2px solid red";
    } else if (text.includes("sponsored") || text.includes("sale")) {
        el.style.outline = "2px solid orange";
    }
}

function scanImage(img) {
    const src = (img.src || "").toLowerCase();

    if (src.includes("genai") || src.includes("ai") || src.includes("generated")) {
        img.style.outline = "3px solid purple";
    }
}

function clearAll() {
    document.querySelectorAll("p, h1, h2, h3, article, img").forEach(el => {
        el.style.outline = "none";
    });
}