const body = document.body;
const leftToggle = document.querySelector('.left-toggle');
const rightToggle = document.querySelector('.right-toggle');
const switcherDialog = document.querySelector('#switcher-dialog');
const discordDialog = document.querySelector('#discord-dialog');
const activityDialog = document.querySelector('#activity-dialog');
const toolbarStatus = document.querySelector('#toolbar-status');
const activityList = document.querySelector('#activity-list');
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

document.querySelector('#page-search')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = document.querySelector('#search-query').value.trim();
    if (!query) {
        toolbarStatus.textContent = 'enter a search here.';
        return;
    }

    try {
        const contentWindow = document.querySelector('iframe[name="content-frame"]').contentWindow;
        const found = contentWindow.find(query, false, false, true);
        toolbarStatus.textContent = found ? `found “${query}” on this page.` : `did not find a match for “${query}” on this page.`;
    } catch {
        toolbarStatus.textContent = 'the current page cannot be searched.';
    }
});

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

window.patchworkActivity = { record: recordActivityChange };
renderActivity();

