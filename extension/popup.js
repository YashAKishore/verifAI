let enabled = false;

document.addEventListener("DOMContentLoaded", () => {

    const button = document.getElementById("toggleScanBtn");
    const status = document.getElementById("statusText");

    button.addEventListener("click", async () => {

        enabled = !enabled;

        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        chrome.tabs.sendMessage(tab.id, {
            type: "TOGGLE_VERIFAI",
            enabled
        });

        if (enabled) {
            status.textContent = "Status: ON";
            button.textContent = "Disable VerifAI";
        } else {
            status.textContent = "Status: OFF";
            button.textContent = "Enable VerifAI";
        }
    });
});