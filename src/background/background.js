// VARIABLES

const CONTEXT_MENU_ID = "L8R_CONTEXT_MENU";
const DATE = formatDate(new Date());

// CHROME LISTENERS

chrome.contextMenus.onClicked.addListener(
    async function(info, tab) {
        if (info.menuItemId != CONTEXT_MENU_ID) {
            return;
        }
        let currentNotes = await getLocalStorage(DATE);
        if (currentNotes == undefined) {
            currentNotes = "";
        }
        currentNotes += currentNotes == "" ? info.selectionText : `\n\n${info.selectionText}`;
        await chrome.storage.local.set({
            [DATE]: currentNotes
        });
    }
);

// FUNCTIONS

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return [
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
        date.getFullYear(),
    ].join('/');
}

async function getLocalStorage(key) {
    let result = await chrome.storage.local.get(key);
    return key == null ? result : result[key];
}

function createContextMenu() {
    chrome.contextMenus.create({
        title: "Add %s to notes for L8R", 
        contexts:["selection"], 
        id: CONTEXT_MENU_ID
    });
}

// FUNCTION CALLS

createContextMenu();