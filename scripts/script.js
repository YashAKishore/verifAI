let verifAIActive = false;

/**
 * Toggle main VerifAI system
 */
function runVerifAI() {
    verifAIActive = !verifAIActive;

    if (verifAIActive) {
        scanPage();
        showSystemMessage("VerifAI ACTIVE: Scanning content...");
    } else {
        clearAllVerifAI();
        showSystemMessage("VerifAI DEACTIVATED");
    }
}

/**
 * Scan entire page (only runs when active)
 */
function scanPage() {
    if (!verifAIActive) return;

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        const labels = classifyContent(text);
        applyBadge(card, labels);
    });

    scanImages();
}

/**
 * Content classification (rule-based mock AI)
 */
function classifyContent(text) {
    const redFlags = [
        "lose weight fast",
        "miracle",
        "doctors hate",
        "secret hack",
        "guaranteed",
        "no diet",
        "no exercise",
        "click now",
        "hidden",
        "leaked",
        "instant results",
        "rapid weight loss",
        "5 days",
        "7 days",
        "extreme",
        "burn fat fast"
    ];

    const adFlags = [
        "sponsored",
        "deal",
        "discount",
        "sale",
        "visit store"
    ];

    let redScore = 0;
    let adScore = 0;

    redFlags.forEach(flag => {
        if (text.includes(flag)) redScore++;
    });

    adFlags.forEach(flag => {
        if (text.includes(flag)) adScore++;
    });

    let labels = [];

    if (adScore > 0) labels.push("ad");

    if (redScore >= 2) {
        labels.push("danger");
    } else if (redScore === 1) {
        labels.push("warning");
    }

    if (labels.length === 0) {
        labels.push("safe");
    }

    return labels;
}

/**
 * Apply badges to a card
 */
function applyBadge(card, types) {

    // remove old container if exists
    const old = card.querySelector(".badge-container");
    if (old) old.remove();

    if (!Array.isArray(types)) types = [types];

    const container = document.createElement("div");
    container.className = "badge-container";

    types.forEach(type => {

        let badge = document.createElement("div");
        badge.classList.add("badge");

        let info = "";

        switch (type) {
            case "safe":
                badge.innerHTML = "✅";
                info = "Reliable content — no issues detected";
                break;

            case "warning":
                badge.innerHTML = "⚠️";
                info = "Uncertain content — requires verification";
                break;

            case "danger":
                badge.innerHTML = "❗";
                info = "High risk misinformation or scam indicators detected";
                break;

            case "ad":
                badge.innerHTML = "📢";
                info = "Advertising content detected";
                break;
        }

        badge.setAttribute("data-tooltip", info);
        container.appendChild(badge);
    });

    card.appendChild(container);
}

/**
 * Scan images for AI-generated indicators
 */
function scanImages() {
    if (!verifAIActive) return;

    const images = document.querySelectorAll(".card img");

    images.forEach(img => {
        const src = (img.getAttribute("src") || "").toLowerCase();

        const isGenAI =
            src.includes("genai") ||
            src.includes("ai-") ||
            src.includes("generated") ||
            src.includes("fake");

        applyImageBadge(img, isGenAI);
    });
}

/**
 * Apply AI image badge
 */
function applyImageBadge(img, isGenAI) {

    const old = img.parentElement.querySelector(".img-badge");
    if (old) old.remove();

    if (!verifAIActive || !isGenAI) return;

    const badge = document.createElement("div");
    badge.className = "img-badge";
    badge.innerHTML = "🤖 AI";

    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.innerText =
        "AI-generated or modified image detected based on filename patterns.";

    badge.appendChild(tooltip);

    const parent = img.parentElement;
    parent.style.position = "relative";
    parent.style.overflow = "visible"; // 🔥 IMPORTANT FIX

    parent.appendChild(badge);
}

/**
 * Fully reset system state
 */
function clearAllVerifAI() {
    document.querySelectorAll(".badge").forEach(b => b.remove());
    document.querySelectorAll(".img-badge").forEach(b => b.remove());
}

/**
 * UI message popup
 */
function showSystemMessage(msg) {
    const box = document.createElement("div");

    box.innerText = msg;
    box.style.position = "fixed";
    box.style.top = "15px";
    box.style.right = "15px";
    box.style.background = "#111";
    box.style.color = "#fff";
    box.style.padding = "10px 14px";
    box.style.borderRadius = "8px";
    box.style.fontSize = "13px";
    box.style.zIndex = "9999";
    box.style.opacity = "0.95";

    document.body.appendChild(box);

    setTimeout(() => box.remove(), 2000);
}

/**
 * Page switcher (SPA style)
 */
function showPage(pageId) {
    document.querySelectorAll(".page-section").forEach(sec => {
        sec.classList.remove("active-page");
    });

    document.getElementById(pageId).classList.add("active-page");

    showSystemMessage(`Switched to ${pageId.toUpperCase()} view`);
}