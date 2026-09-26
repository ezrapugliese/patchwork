const body = document.body;
const leftToggle = document.querySelector('.left-toggle');
const rightToggle = document.querySelector('.right-toggle');
const switcherDialog = document.querySelector('#switcher-dialog');
const discordDialog = document.querySelector('#discord-dialog');
const activityDialog = document.querySelector('#activity-dialog');
const toolbarStatus = document.querySelector('#toolbar-status');
const activityList = document.querySelector('#activity-list');
const contentFrame = document.querySelector('iframe[name="content-frame"]');
const activityItems = [];

const setToggleState = (button, isOpen) => {
    button.setAttribute('aria-expanded', String(isOpen));
    button.style.borderColor = isOpen ? 'var(--accent)' : 'var(--border)';
};

const closeSidebars = () => {
    body.classList.remove('sidebar-left-open', 'sidebar-right-open');
    if (leftToggle) setToggleState(leftToggle, false);
    if (rightToggle) setToggleState(rightToggle, false);
};

if (leftToggle) {
    leftToggle.addEventListener('click', () => {
        const isOpen = !body.classList.contains('sidebar-left-open');
        body.classList.remove('sidebar-right-open');
        body.classList.toggle('sidebar-left-open', isOpen);
        setToggleState(leftToggle, isOpen);
        if (rightToggle) setToggleState(rightToggle, false);
    });
}

if (rightToggle) {
    rightToggle.addEventListener('click', () => {
        const isOpen = !body.classList.contains('sidebar-right-open');
        body.classList.remove('sidebar-left-open');
        body.classList.toggle('sidebar-right-open', isOpen);
        setToggleState(rightToggle, isOpen);
        if (leftToggle) setToggleState(leftToggle, false);
    });
}

document.addEventListener('click', (event) => {
    if (!event.target.closest('.sidebar-toggle') && !event.target.closest('#sidebar-left') && !event.target.closest('#sidebar-right')) {
        closeSidebars();
    }
});

const openDialog = (dialog) => {
    if (dialog && !dialog.open) dialog.showModal();
};

document.querySelectorAll('.dialog-close').forEach((button) => {
    button.addEventListener('click', () => button.closest('dialog').close());
});

document.querySelectorAll('.toolbar-dialog').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
    });
});

document.querySelector('#switcher-button')?.addEventListener('click', () => openDialog(switcherDialog));
document.querySelector('#activity-button')?.addEventListener('click', () => openDialog(activityDialog));

document.querySelector('#switcher-alters-link')?.addEventListener('click', () => switcherDialog.close());
document.querySelector('#discord-settings-link')?.addEventListener('click', () => discordDialog.close());

document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openDialog(switcherDialog);
    }
});

document.querySelector('#discord-sync-button')?.addEventListener('click', () => openDialog(discordDialog));

// ── in-page search ──────────────────────────────────────────────
// #page-search is a <search> element, not a <form>, so it never dispatches a
// submit event. The button and the Enter key are wired up directly instead.
const searchInput = document.querySelector('#search-query');

const reportSearchFailure = () => {
    toolbarStatus.textContent = 'the current page cannot be searched.';
};

const searchCurrentPage = () => {
    const query = searchInput?.value.trim() ?? '';

    if (!query) {
        toolbarStatus.textContent = 'enter a search here.';
        return;
    }

    if (!contentFrame) {
        reportSearchFailure();
        return;
    }

    try {
        const contentWindow = contentFrame.contentWindow;
        const found = contentWindow.find(query, false, false, true);
        toolbarStatus.textContent = found
            ? `found "${query}" on this page.`
            : `did not find a match for "${query}" on this page.`;
    } catch {
        reportSearchFailure();
    }
};

document.querySelector('.search-submit')?.addEventListener('click', searchCurrentPage);

searchInput?.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    searchCurrentPage();
});

// ── activity log ────────────────────────────────────────────────
const activityTypeLabels = {
    switch: 'Front switch',
    setting: 'Setting update',
    alter: 'Alter update'
};

const renderActivity = () => {
    activityList.replaceChildren();

    if (activityItems.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'empty-activity';
        emptyMessage.textContent = 'No changes yet.';
        activityList.append(emptyMessage);
        return;
    }

    activityItems.slice().reverse().forEach((item) => {
        const entry = document.createElement('article');
        entry.className = 'activity-item';
        const heading = document.createElement('div');
        heading.className = 'activity-heading';
        const type = document.createElement('span');
        type.className = 'activity-type';
        type.textContent = activityTypeLabels[item.type] || item.type;
        const time = document.createElement('time');
        time.dateTime = item.createdAt.toISOString();
        time.textContent = item.createdAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        heading.append(type, time);
        const content = document.createElement('p');
        content.className = 'activity-description';
        content.textContent = item.description;
        entry.append(heading, content);

        if (typeof item.undo === 'function') {
            const undoButton = document.createElement('button');
            undoButton.className = 'undo-button';
            undoButton.type = 'button';
            undoButton.textContent = item.undone ? 'Undone' : 'Undo';
            undoButton.disabled = item.undone;
            undoButton.addEventListener('click', async () => {
                undoButton.disabled = true;
                try {
                    await item.undo();
                    item.undone = true;
                    renderActivity();
                } catch {
                    undoButton.disabled = false;
                    toolbarStatus.textContent = 'Could not undo that change.';
                }
            });
            entry.append(undoButton);
        }

        activityList.append(entry);
    });
};

const recordActivityChange = ({ type, description, undo }) => {
    if (!type || !description) return;
    const item = { type, description, undo, createdAt: new Date(), undone: false };
    activityItems.push(item);
    renderActivity();
    return item;
};

// ── messages from the page inside #content-frame ────────────────
// file:// documents report the origin "null", which is not a usable target.
const frameTargetOrigin = window.location.origin === 'null' ? '*' : window.location.origin;
const pendingFrameRequests = new Map();
let nextFrameRequestId = 0;

const requestFromFrame = (message) => new Promise((resolve, reject) => {
    if (!contentFrame?.contentWindow) {
        reject(new Error('The current page cannot be reached.'));
        return;
    }

    const requestId = ++nextFrameRequestId;
    pendingFrameRequests.set(requestId, { resolve, reject });
    contentFrame.contentWindow.postMessage(
        { ...message, source: 'patchwork', requestId },
        frameTargetOrigin
    );
});

const alterLabel = (alter) => alter?.displayName?.trim() || alter?.name?.trim() || 'unnamed alter';

const recordAlterSaved = (data) => {
    const alter = data.alter;
    if (!alter) return;

    const label = `"${alterLabel(alter)}"`;
    recordActivityChange({
        type: 'alter',
        description: data.isNew ? `Added alter ${label}.` : `Updated alter ${label}.`,
        undo: data.isNew
            ? () => requestFromFrame({ type: 'undo-alter-save', id: alter.id })
            : () => data.previous
                ? requestFromFrame({ type: 'restore-alter', alter: data.previous })
                : Promise.reject(new Error('The previous version is not available.'))
    });
};

const recordAlterDeleted = (data) => {
    const alter = data.alter;
    if (!alter) return;

    recordActivityChange({
        type: 'alter',
        description: `Deleted alter "${alterLabel(alter)}".`,
        undo: () => requestFromFrame({ type: 'restore-alter', alter })
    });
};

window.addEventListener('message', (event) => {
    if (!contentFrame || event.source !== contentFrame.contentWindow) return;

    const data = event.data;
    if (!data || typeof data !== 'object') return;

    if (data.type === 'frame-response') {
        const pending = pendingFrameRequests.get(data.requestId);
        if (!pending) return;
        pendingFrameRequests.delete(data.requestId);
        if (data.ok) pending.resolve();
        else pending.reject(new Error(data.error || 'The change could not be undone.'));
        return;
    }

    if (data.type === 'alter-saved') recordAlterSaved(data);
    if (data.type === 'alter-deleted') recordAlterDeleted(data);
});

window.patchworkActivity = { record: recordActivityChange };
renderActivity();
