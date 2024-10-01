let mainScreen = document.querySelector('.main-screen');
let startScreen = document.querySelector('.start-screen');
let question = document.querySelector('.question');
let answers = document.querySelector('.answers');
let answer_buttons = document.querySelectorAll('.answer-button');
let statisticsDisplay = document.querySelector('.statistics');
let timerDisplay = document.querySelector('.timer');
let difficulty_buttons = document.querySelector('.difficulty-buttons')

async function getQuestions(file_name) {
    let response = await fetch(file_name)
    let questions = await response.json()
    return questions
}
let questions_eng = []
let questions_sport = []
let questions_game = []
let questions_geo = []

getQuestions("questions1.json").then(function (questions) {
    questions_eng = questions
})
getQuestions("questions2.json").then(function (questions) {
    questions_sport = questions
})
getQuestions("questions3.json").then(function (questions) {
    questions_game = questions
})
getQuestions("questions4.json").then(function (questions) {
    questions_geo = questions
})

// Додавання складності
const difficultyLevels = {
    easy: 15,  // 15 секунд на питання
    medium: 10, // 10 секунд на питання
    hard: 5    // 5 секунд на питання
};

let selectedQuiz = [];
let currentDifficulty = difficultyLevels.medium;  // Складність за замовчуванням

// Інші змінні
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let totalAnswersCount = 0;
let countdownInterval;
let questionLimit = 10;

// Обробник натискань для вибору тем
document.querySelectorAll('.theme-button').forEach(button => {
    button.addEventListener('click', () => {
        const selectedTheme = button.textContent;
        applyTheme(selectedTheme);

        // Вибір квіза на основі вибраної теми
        switch (selectedTheme) {
            case 'Виберіть першу тему квіза':
                selectedQuiz = questions_eng;
                break;
            case 'Виберіть другу тему квіза':
                selectedQuiz = questions_sport;
                break;

            case 'Виберіть другу тему квіза':
                selectedQuiz = questions_game;
                break;
            default:
                selectedQuiz = questions_geo;
        }

        // Приховуємо екран вибору теми і показуємо екран питань
        mainScreen.style.display = 'none';
        difficulty_buttons.style.display = 'none';
        document.querySelector('.question-screen').style.display = 'block';

        startQuiz();
    });
});

// Обробник натискання для вибору складності
document.querySelector('.difficulty-buttons').addEventListener('click', function (event) {
    const selectedDifficulty = event.target.textContent;

    if (selectedDifficulty === 'Легко') {
        currentDifficulty = difficultyLevels.easy;
    } else if (selectedDifficulty === 'Середньо') {
        currentDifficulty = difficultyLevels.medium;
    } else if (selectedDifficulty === 'Важко') {
        currentDifficulty = difficultyLevels.hard;
    }

    // Збереження складності в localStorage
    localStorage.setItem('selectedDifficulty', selectedDifficulty);
    startQuiz();
});

// Функція для запуску квіза
function startQuiz() {
    currentQuestionIndex = 0;
    correctAnswersCount = 0;
    totalAnswersCount = 0;
    displayNextQuestion();
    startCountdown();
}

// Функція показу наступного питання
function displayNextQuestion() {
    if (currentQuestionIndex < selectedQuiz.length) {
        const currentQuestion = selectedQuiz[currentQuestionIndex];

        // Оновлення тексту питання та варіантів відповідей
        question.textContent = `${currentQuestionIndex + 1}/${selectedQuiz.length}: ${currentQuestion.question}`;

        answer_buttons.forEach((button, index) => {
            button.textContent = currentQuestion.answers[index];
            button.style.background = ''; // Скидання фону для нових відповідей
        });
        currentQuestionIndex++;
    } else {
        endQuiz();
    }
}

// Логіка таймера для кожного питання
function startCountdown() {
    let countdownTime = currentDifficulty;
    timerDisplay.innerHTML = `Залишилось: ${countdownTime} сек`;

    countdownInterval = setInterval(() => {
        countdownTime--;
        timerDisplay.innerHTML = `Залишилось: ${countdownTime} сек`;

        if (countdownTime <= 0) {
            clearInterval(countdownInterval);
            totalAnswersCount++;
            displayNextQuestion();
            startCountdown(); // Запустити таймер для наступного питання
        }
    }, 1000);
}

// Обробка натискання на відповідь
answer_buttons.forEach(button => {
    button.addEventListener('click', function () {
        const currentQuestion = selectedQuiz[currentQuestionIndex - 1];
        totalAnswersCount++;

        if (button.innerHTML === currentQuestion.correct) {
            correctAnswersCount++;
            button.style.background = '#13fa0f'; // зелений для правильної відповіді

            // Додавання звуку правильної відповіді
            const correctSound = new Audio('correct.mp3');
            correctSound.play();
        } else {
            button.style.background = '#e74c3c'; // червоний для неправильної відповіді

            // Додавання звуку неправильної відповіді
            const incorrectSound = new Audio('incorrect.mp3');
            incorrectSound.play();
        }

        setTimeout(displayNextQuestion, 1000);
    });
});

document.querySelectorAll('.theme-button').forEach(button => {
    button.addEventListener('click', () => {
        const selectedTheme = button.textContent;
        applyTheme(selectedTheme);

        // Select quiz based on chosen theme
        switch (selectedTheme) {
            case 'English':
                selectedQuiz = questions1.json;
                break;
            case 'Sport':
                selectedQuiz = questions_sport;
                break;
            case 'Game':  // Add this case for geography
                selectedQuiz = questions_game;
                break;
            case 'Geography':  // Add this case for geography
                selectedQuiz = questions_geo;
                break;
            default:
                selectedQuiz = quiz1;
        }

        // Hide theme selection screen and show question screen
        mainScreen.style.display = 'none';
        document.querySelector('.question-screen').style.display = 'block';

        startQuiz();
    });
});


// Функція завершення квіза
function endQuiz() {
    clearInterval(countdownInterval); // Зупиняємо таймер
    question.textContent = 'Квіз завершено!';
    answers.innerHTML = ''; // Очищення варіантів відповідей
    timerDisplay.innerHTML = ''; // Приховуємо таймер
    statisticsDisplay.textContent = `Ви відповіли правильно на ${correctAnswersCount} з ${totalAnswersCount} питань!`;
}

// Функція зміни теми та стилю фону
function applyTheme(theme) {
    const themeColors = {
        'Виберіть першу тему квіза': '#365486',
        'Виберіть другу тему квіза': '#E74C3C',
        'Виберіть третю тему квіза': '#8E44AD',
        'Виберіть четверту тему квіза': '#8E44AD',
    };

    document.body.style.backgroundColor = themeColors[theme];
    const header = document.querySelector('header');
    header.textContent = theme + ' вибрано!';
}

