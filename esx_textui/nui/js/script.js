const types = {
    success: { icon: "check_circle" },
    error: { icon: "error" },
    info: { icon: "info" },
};

const codes = {
    "~r~": "#c0392b",
    "~b~": "#378cbf",
    "~g~": "#2ecc71",
    "~y~": "yellow",
    "~p~": "purple",
    "~c~": "grey",
    "~m~": "#212121",
    "~u~": "black",
    "~o~": "#fb9b04",
};

const replaceColors = (str, obj) => {
    let strToReplace = str;
    for (const id in obj) {
        strToReplace = strToReplace.replace(new RegExp(id, "g"), obj[id]);
    }
    return strToReplace;
};

let currentTextUI = null;

const showTextUI = (data) => {
    // Remove existing TextUI if present
    if (currentTextUI) {
        currentTextUI.css("animation", "slideOut 0.3s ease-in forwards");
        setTimeout(() => currentTextUI.remove(), 300);
    }

    // Ensure message is a string and handle undefined/null
    const message = typeof data.message === "string" ? data.message : String(data.message || "No message provided");
    const type = data.type in types ? data.type : "info";

    // Replace color codes
    let formattedMessage = message;
    for (const color in codes) {
        if (message.includes(color)) {
            const objArr = {
                [color]: `<span style="color: ${codes[color]}">`,
                "~s~": "</span>",
            };
            formattedMessage = replaceColors(message, objArr);
        }
    }

    // Create TextUI element
    currentTextUI = $(`
        <div class="textui ${type}">
            <div class="innerText">
                <span class="material-symbols-outlined icon">${types[type].icon}</span>
                <p class="text">${formattedMessage}</p>
            </div>
        </div>
    `).appendTo(".textui-container");

    return currentTextUI;
};

const hideTextUI = () => {
    if (currentTextUI) {
        currentTextUI.css("animation", "slideOut 0.3s ease-in forwards");
        setTimeout(() => {
            currentTextUI.remove();
            currentTextUI = null;
        }, 300);
    }
};

$(document).ready(() => {
    // Ensure container exists
    if (!$(".textui-container").length) {
        $("body").append('<div class="textui-container"></div>');
    }

    // Listen for NUI messages
    window.addEventListener("message", (event) => {
        if (event.data) {
            if (event.data.action === "show" && event.data.message) {
                showTextUI({
                    type: event.data.type,
                    message: event.data.message,
                });
            } else if (event.data.action === "hide") {
                hideTextUI();
            }
        }
    });
});