/**
 * @author Javier Huang
 * @license CC0-1.0
 */

// DOM ELEMENTS

let notesElement = document.getElementsByClassName('notes')[0];
let notesLegendElement = document.getElementsByClassName('notes-legend')[0];
let previousNotesElement = document.getElementsByClassName('previous-notes')[0];
let previousNotesDeleteElements = document.getElementsByClassName('previous-notes-delete');

// VARIABLES

const DATE = formatDate(new Date());

// DOM LISTENERS

window.addEventListener('load',
    async function() {
        notesLegendElement.innerHTML = DATE;
        await setDefaultNotes();
        await listPreviousNotes();
    }
);

notesElement.addEventListener('change',
    async function() {
        await chrome.storage.local.set({
            [DATE]: notesElement.value
        });
        location.reload();
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

async function setDefaultNotes() {
    let currentNotes = await getLocalStorage(DATE);
    if (currentNotes != undefined) {
        notesElement.value = currentNotes;
    }
}

async function listPreviousNotes() {
    let notes = await getLocalStorage(null);
    for (let note in notes) {
        let row = previousNotesElement.insertRow(1);
        let datesCell = row.insertCell(0);
        let actionsCell = row.insertCell(1);
        datesCell.innerHTML = note;
        let blob = new Blob([notes[note]], {
            type: "text/plain;charset=utf-8"
        });
        let blobUrl = URL.createObjectURL(blob);
        actionsCell.innerHTML = `
            <a class = "previous-notes-download" href = "${blobUrl}" download = "l8r_${note}">
                <span class = "material-symbols-outlined">download</span>
            </a>
            <span class = "previous-notes-delete" note = "${note}">
                <span class = "material-symbols-outlined">delete</span>
            </span>
        `;
    }

    for (let previousNotesDeleteElement of previousNotesDeleteElements) {
        previousNotesDeleteElement.addEventListener('click',
            async function() {
                await chrome.storage.local.remove(previousNotesDeleteElement.attributes[1].value);
                location.reload();
            }
        );
    }
}