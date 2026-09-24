const body = document.body;
const leftToggle = document.querySelector('.left-toggle');
const rightToggle = document.querySelector('.right-toggle');

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

