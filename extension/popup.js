let enabled = false;

document.addEventListener("DOMContentLoaded", () => {

    const button = document.getElementById("toggleScanBtn");
    const status = document.getElementById("statusText");

    // Load saved state when popup opens
    chrome.storage.local.get(["verifAIEnabled"], (result) => {
        enabled = result.verifAIEnabled || false;
        updateUI();
    });

    button.addEventListener("click", async () => {
        enabled = !enabled;

        // Save state (IMPORTANT FIX)
        chrome.storage.local.set({ verifAIEnabled: enabled });

        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        chrome.tabs.sendMessage(tab.id, {
            type: "TOGGLE_VERIFAI",
            enabled
        });

        updateUI();
    });

    function updateUI() {
        if (enabled) {
            status.textContent = "Status: ON";
            button.textContent = "Disable VerifAI";
        } else {
            status.textContent = "Status: OFF";
            button.textContent = "Enable VerifAI";
        }
    }
});