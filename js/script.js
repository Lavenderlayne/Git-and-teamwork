let mainScreen = document.querySelector('.main-screen');
let difficulty_buttons = document.querySelectorAll('.difficulty-button');
let difficulty_block = document.querySelector('.difficulty-buttons');
let questionScreen = document.querySelector('.question-screen');
let questionText = document.querySelector('.question');
let answerButtons = document.querySelectorAll('.answer-button');
let timerDisplay = document.querySelector('.timer');
let statisticsDisplay = document.querySelector('.statistics');
let restartButton = document.querySelector('.restart-button');
let homeButton = document.querySelector('.home-button');
let skipButton = document.getElementById('skip-button');

let selectedQuiz = [];
let selectedTheme; // тема квіза
let currentDifficulty;
let countdownInterval;
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let totalAnswersCount = 0;
let questions_eng, questions_sport, questions_game, questions_geo;
let questions_eng2, questions_sport2, questions_game2, questions_geo2;
let questions_eng3, questions_sport3, questions_game3, questions_geo3;

const difficultyLevels = {
    easy: 15,
    medium: 10,
    hard: 5,
    impossible: 3
};


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }
}

async function getQuestions(file_name) {
    try {
        let response = await fetch(file_name);
        if (!response.ok) throw new Error('Мережевий запит завершився невдало');
        let questions = await response.json();
        return questions["questions"];
    } catch (error) {
        console.error('Помилка при отриманні запитань:', error);
    }
}

Promise.all([
    getQuestions("eng/questionseng1.json").then(questions => { questions_eng = questions; }),
    getQuestions("sport/questionssport1.json").then(questions => { questions_sport = questions; }),
    getQuestions("games/questionsgame1.json").then(questions => { questions_game = questions; }),
    getQuestions("geo/questionsgeo1.json").then(questions => { questions_geo = questions; }),

    getQuestions("eng/questionseng2.json").then(questions => { questions_eng2 = questions; }),
    getQuestions("sport/questionssport2.json").then(questions => { questions_sport2 = questions; }),
    getQuestions("games/questionsgame2.json").then(questions => { questions_game2 = questions; }),
    getQuestions("geo/questionsgeo2.json").then(questions => { questions_geo2 = questions; }),

    getQuestions("eng/questionseng3.json").then(questions => { questions_eng3 = questions; }),
    getQuestions("sport/questionssport3.json").then(questions => { questions_sport3 = questions; }),
    getQuestions("games/questionsgame3.json").then(questions => { questions_game3 = questions; }),
    getQuestions("geo/questionsgeo3.json").then(questions => { questions_geo3 = questions; }),
]).then(() => {
    console.log('Усі запитання завантажено');
});

document.querySelectorAll('.theme-button').forEach(button => {
    button.addEventListener('click', () => {
        selectedTheme = button.textContent.trim();

        shuffle(selectedQuiz);
        mainScreen.style.display = 'none';
        difficulty_block.style.display = 'block';
    });
});

difficulty_buttons.forEach(button => {
    button.addEventListener('click', function (event) {
        const selectedDifficulty = event.target.getAttribute('data-difficulty');
        if (selectedDifficulty === "easy" && selectedTheme == 'Англійська') {
            selectedQuiz = questions_eng;
        } else if (selectedDifficulty === "medium" && selectedTheme == 'Англійська') {
            selectedQuiz = questions_eng2;
        } else if (selectedDifficulty === "hard" && selectedTheme == 'Англійська') {
            selectedQuiz = questions_eng3;
        } else if (selectedDifficulty === "easy" && selectedTheme == 'Географія') {
            selectedQuiz = questions_geo;
        } else if (selectedDifficulty === "medium" && selectedTheme == 'Географія') {
            selectedQuiz = questions_geo2;
        } else if (selectedDifficulty === "hard" && selectedTheme == 'Географія') {
            selectedQuiz = questions_geo3;
        } else if (selectedDifficulty === "easy" && selectedTheme == 'Ігри') {
            selectedQuiz = questions_game;
        } else if (selectedDifficulty === "medium" && selectedTheme == 'Ігри') {
            selectedQuiz = questions_game2;
        } else if (selectedDifficulty === "hard" && selectedTheme == 'Ігри') {
            selectedQuiz = questions_game3;
        } else if (selectedDifficulty === "easy" && selectedTheme == 'Спорт') {
            selectedQuiz = questions_sport;
        } else if (selectedDifficulty === "medium" && selectedTheme == 'Спорт') {
            selectedQuiz = questions_sport2;
        } else if (selectedDifficulty === "hard" && selectedTheme == 'Спорт') {
            selectedQuiz = questions_sport3;
        } else {
            selectedQuiz = questions_game;
        }

        currentDifficulty = difficultyLevels[selectedDifficulty];

        localStorage.setItem('selectedDifficulty', selectedDifficulty);

        difficulty_block.style.display = 'none';
        questionScreen.style.display = 'block';
        startQuiz();
    });
});

function startQuiz() {
    currentQuestionIndex = 0;
    correctAnswersCount = 0;
    totalAnswersCount = 0;
    progressBar.innerHTML = '';
    displayNextQuestion();
}

function displayNextQuestion() {
    clearInterval(countdownInterval);

    if (currentQuestionIndex < selectedQuiz.length) {
        const currentQuestion = selectedQuiz[currentQuestionIndex];
        questionText.textContent = `${currentQuestionIndex + 1}/${selectedQuiz.length}: ${currentQuestion.question}`;
        answerButtons.forEach((button, index) => {
            button.textContent = currentQuestion.answers[index];
            button.style.background = '';
            button.classList.remove('fade-in', 'fade-out');
        });
        currentQuestionIndex++;
        animateQuestionDisplay();
        startCountdown();
    } else {
        endQuiz();
    }
}

function startCountdown() {
    let countdownTime = currentDifficulty;
    timerDisplay.innerHTML = `Залишилось: ${countdownTime} сек`;

    countdownInterval = setInterval(() => {
        countdownTime--;
        timerDisplay.innerHTML = `Залишилось: ${countdownTime} сек`;

        if (countdownTime <= 0) {
            clearInterval(countdownInterval);
            totalAnswersCount++;

            answerButtons.forEach(button => {
                if (button.innerHTML.trim() === selectedQuiz[currentQuestionIndex - 1].correct.trim()) {
                    button.style.background = '#13fa0f';
                }
            });

            setTimeout(() => {
                displayNextQuestion();
            }, 1000);
        }
    }, 1000);
}

function animateQuestionDisplay() {
    questionText.classList.add('fade-in');
    setTimeout(() => {
        questionText.classList.remove('fade-in');
    }, 500);
}



function endQuiz() {
    questionScreen.style.display = 'none';
    statisticsDisplay.style.display = 'block';
    restartButton.style.display = "block";
    homeButton.style.display = "block";
    let result = Math.round((correctAnswersCount / selectedQuiz.length) * 100);
    statisticsDisplay.innerHTML = `<h2>Вікторина завершена!</h2><p>Ваш результат: ${result}% правильних відповідей.</p>`;

}


homeButton.addEventListener('click', () => {
    mainScreen.style.display = 'block'
    statisticsDisplay.style.display = 'none'
    homeButton.style.display = 'none'
    restartButton.style.display = 'none'
});


answerButtons.forEach(button => {
    button.addEventListener('click', function () {
        const currentQuestion = selectedQuiz[currentQuestionIndex - 1];
        if (button.innerHTML.trim() === currentQuestion.correct.trim()) {
            correctAnswersCount++;
            updateProgress(true);
            console.log("Правильно");
        } else {
            button.style.background = '#ff4d4d';
            updateProgress(false);
            console.log("Неправильно");
        }

        totalAnswersCount++;
        
        setTimeout(() => {
            displayNextQuestion();
        }, 1000);
    });
});

skipButton.addEventListener('click', () => {
    totalAnswersCount++;
    displayNextQuestion();
});
