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

    if (matches(text, RED_FLAGS)) {
        el.style.outline = "2px solid red";
    }
    else if (matches(text, ORANGE_FLAGS)) {
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

function matches(text, list) {
    return list.some(flag => text.includes(flag));
}

const RED_FLAGS = [
    "miracle",
    "doctors hate",
    "secret hack",
    "guaranteed results",
    "no diet",
    "no exercise",
    "click now",
    "instant results",
    "rapid weight loss",
    "lose 10kg",
    "burn fat fast",
    "5 days",
    "7 days",
    "hidden cure",
    "weight loss trick",
    "shocking",
    "this one trick",
    "you won't believe"
];

const ORANGE_FLAGS = [
    "sponsored",
    "ad",
    "advertisement",
    "sale",
    "discount",
    "deal",
    "limited offer",
    "shop now",
    "visit store",
    "promo",
    "affiliate",
    "partner content",
    "recommended",
    "trending deal"
];

scanPage();