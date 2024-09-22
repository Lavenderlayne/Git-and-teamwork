document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    setTimeout(() => {
        header.classList.add('visible');
    }, 100);
});

const buttons = document.querySelectorAll('.theme-button');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        alert(button.textContent + ' вибрано!');
    });
});