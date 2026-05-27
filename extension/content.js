let verifAIActive = false;

/* ==========================
   LISTENER
========================== */

chrome.runtime.onMessage.addListener((message) => {
    if (message.type !== "TOGGLE_VERIFAI") return;

    verifAIActive = message.enabled;

    if (verifAIActive) scanPage();
    else clearAllVerifAI();
});

/* ==========================
   SCAN
========================== */

function scanPage() {
    clearAllVerifAI();

    const selector = `
    /* Reddit */
    div[data-testid="post-container"],
    div[data-testid="comment"],
    div[data-click-id="text"],

    /* Generic modern apps */
    article,
    section,
    main,
    aside,

    /* Common text containers */
    p,
    h1, h2, h3, h4, h5, h6,
    li,
    span,

    /* Card / UI frameworks */
    .card,
    .post,
    .content,
    .article,
    .entry,
    .story,
    .text,
    .body,

    /* React / dynamic UIs */
    div[class*="post"],
    div[class*="article"],
    div[class*="content"],
    div[class*="comment"],
    div[class*="text"]
`;

    document.querySelectorAll(selector).forEach(el => {
        if (el.tagName === "IMG") scanImage(el);
        else scanText(el);
    });
}

/* ==========================
   TEXT SCAN (NO DOM MOVING)
========================== */

function scanText(el) {
    const text = (el.textContent || "").trim().toLowerCase();

    const wordCount = text.split(/\s+/).filter(Boolean).length;

    if (wordCount < 4) return;
    if (wordCount > 400) return;

    const red = RED_FLAGS.filter(f => text.includes(f));
    const orange = ORANGE_FLAGS.filter(f => text.includes(f));

    const labels = [];

    if (orange.length) labels.push("orange");
    if (red.length >= 2) labels.push("red");
    else if (red.length === 1) labels.push("yellow");
    else labels.push("green");

    el.dataset.verifaiRed = JSON.stringify(red);
    el.dataset.verifaiOrange = JSON.stringify(orange);

    applyBadges(el, labels);
}

/* ==========================
   IMAGE SCAN (SAFE WRAP ONLY HERE)
========================== */

function scanImage(img) {
    const src = (img.src || "").toLowerCase();

    const isAI = ["genai", "ai-", "generated", "deepfake", "synthetic"]
        .some(k => src.includes(k));

    if (isAI) applyBadges(img, ["purple"]);
}

/* ==========================
   BADGES
========================== */

function applyBadges(el, labels) {
    removeBadges(el);
    if (!labels?.length) return;

    const target = el.tagName === "IMG" ? wrapImage(el) : el;

    ensurePositioning(target);

    const container = document.createElement("div");
    container.className = "verifai-badge-container";

    labels.forEach(type => {
        const badge = document.createElement("span");

        badge.className = `verifai-badge ${type}`;
        badge.textContent = getIcon(type);

        const tooltip = getTooltip(type) || "No info available";

        // CRITICAL FIX: must set attribute (NOT just dataset)
        badge.setAttribute("data-tooltip", tooltip);

        badge.addEventListener("mouseenter", () => {
            const red = JSON.parse(el.dataset.verifaiRed || "[]");
            const orange = JSON.parse(el.dataset.verifaiOrange || "[]");

            const words =
                type === "red" ? red :
                    type === "yellow" ? red :
                        type === "orange" ? orange :
                            [];

            target.classList.add("verifai-highlight", `verifai-highlight-${type}`);
            highlightWords(target, words, type);
        });

        badge.addEventListener("mouseleave", () => {
            target.classList.remove(
                "verifai-highlight",
                "verifai-highlight-red",
                "verifai-highlight-orange",
                "verifai-highlight-yellow",
                "verifai-highlight-purple"
            );

            resetWords(target);
        });

        container.appendChild(badge);
    });

    target.appendChild(container);
}

/* ==========================
   IMAGE WRAPPER ONLY (SAFE)
========================== */

function wrapImage(img) {
    if (img.parentElement.classList.contains("verifai-img-wrapper")) {
        return img.parentElement;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "verifai-img-wrapper";
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";

    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    return wrapper;
}

/* ==========================
   HIGHLIGHT (NO DOM RESTRUCTURE)
========================== */

function highlightWords(el, flags, type) {
    if (!flags?.length) return;

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node => {
        let text = node.nodeValue;

        let replaced = false;

        flags.forEach(word => {
            const regex = new RegExp(`\\b(${escapeRegex(word)})\\b`, "gi");

            if (regex.test(text)) {
                replaced = true;
            }

            text = text.replace(
                regex,
                `<span class="verifai-word-highlight" data-verifai-type="${type}">$1</span>`
            );
        });

        if (replaced) {
            const span = document.createElement("span");
            span.innerHTML = text;
            node.parentNode.replaceChild(span, node);
        }
    });
}

function resetWords(el) {
    const highlights = el.querySelectorAll(".verifai-word-highlight");

    highlights.forEach(span => {
        span.replaceWith(span.textContent);
    });
}

/* ==========================
   CLEANUP
========================== */

function clearAllVerifAI() {
    document.querySelectorAll(".verifai-badge-container")
        .forEach(el => el.remove());

    document.querySelectorAll("[data-verifai-original-html]")
        .forEach(el => {
            el.innerHTML = el.dataset.verifaiOriginalHtml;
        });
}

/* ==========================
   HELPERS
========================== */

function getContextMultiplier(textLength) {

    if (textLength < 40) return 2.0;      // very short → high uncertainty
    if (textLength < 120) return 1.5;
    if (textLength < 300) return 1.0;
    return 0.75;                          // long text → lower risk bias
}

function ensurePositioning(el) {
    if (getComputedStyle(el).position === "static") {
        el.style.position = "relative";
    }
}

function removeBadges(el) {
    const target = el.tagName === "IMG" ? el.parentElement : el;
    target?.querySelector(".verifai-badge-container")?.remove();
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getIcon(type) {
    return {
        red: "❗",
        yellow: "⚠",
        orange: "📢",
        green: "✔",
        purple: "🤖"
    }[type];
}

function getTooltip(type) {
    return {
        red: "High-risk misinformation",
        yellow: "Needs verification / more context",
        orange: "Advertising",
        green: "Reliable",
        purple: "AI image"
    }[type];
}

/* ==========================
   FLAG LISTS
========================== */

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
    "you won't believe",

    // added scam / misinformation patterns
    "life changing",
    "act now",
    "urgent action required",
    "limited time only",
    "risk free",
    "100% guaranteed",
    "no side effects",
    "doctor approved",
    "breakthrough cure",
    "scientists don't want you to know",
    "banned",
    "censored",
    "conspiracy revealed",
    "what they won't tell you",
    "secret formula",
    "proven method",
    "lose weight overnight",
    "melts fat",
    "flat stomach in days",
    "earn $5000 a week",
    "work from home guaranteed income",
    "get rich quick",
    "double your money",
    "investment hack",
    "crypto secret",
    "insider trick",
    "never fail system",
    "instant cash",
    "no experience needed",
    "expose",
    "leaked",
];

const ORANGE_FLAGS = [
    "sponsored",
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
    "trending deal",
    "offer",
    "secret pricing",
    "secret discount",

    // added modern ad / engagement markers
    "paid partnership",
    "ad",
    "promotion",
    "promoted",
    "boosted post",
    "brand collaboration",
    "collab",
    "in partnership with",
    "subscribe now",
    "buy now",
    "learn more",
    "sign up",
    "download now",
    "install now",
    "try for free",
    "free trial",
    "exclusive offer",
    "early access",
    "limited stock",
    "flash sale",
    "best price",
    "top pick",
    "editor's choice"
];