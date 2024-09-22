document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');

    // Відображення заголовка
    setTimeout(() => {
        header.classList.add('visible');
    }, 100);

    // Збереження попередньо вибраної теми
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }
});

// Зміна фону та заголовка при натисканні на кнопку
const buttons = document.querySelectorAll('.theme-button');

// Створимо кольори для кожної теми
const themeColors = {
    'Виберіть першу тему квіза': '#FAD02E',
    'Виберіть другу тему квіза': '#E74C3C',
    'Виберіть третю тему квіза': '#8E44AD'
};

// Функція для застосування теми
function applyTheme(theme) {
    document.body.style.backgroundColor = themeColors[theme];
    const header = document.querySelector('header');
    header.textContent = theme + ' вибрано!';
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const selectedTheme = button.textContent;

        // Зміна кольору фону та заголовка
        applyTheme(selectedTheme);

        // Збереження теми в localStorage
        localStorage.setItem('selectedTheme', selectedTheme);

        // Показ кастомного спливаючого вікна
        showPopup(selectedTheme);
    });
});

// Функція для кастомного спливаючого вікна
function showPopup(theme) {
    const popup = document.getElementById('popup');
    const popupText = document.getElementById('popup-text');
    popupText.textContent = theme + ' вибрано!';

    popup.style.display = 'block';

    const closeBtn = document.getElementById('close-popup');
    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    // Закриття вікна через 3 секунди
    setTimeout(() => {
        popup.style.display = 'none';
    }, 3000);
}
