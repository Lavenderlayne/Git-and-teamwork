let mainScreen = document.querySelector('.main-screen');
let difficulty_buttons = document.querySelector('.difficulty-buttons');
let questionScreen = document.querySelector('.question-screen');
let questionText = document.querySelector('.question');
let answerButtons = document.querySelectorAll('.answer-button');
let timerDisplay = document.querySelector('.timer');
let statisticsDisplay = document.querySelector('.statistics');
let leaderboardDisplay = document.querySelector('.leaderboard');
let skipButton = document.getElementById('skip-button');
let muteButton = document.getElementById('mute-button');

let selectedQuiz = [];
let currentDifficulty;
let countdownInterval;
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let totalAnswersCount = 0;
let isMuted = false; // Mute state

const difficultyLevels = {
    easy: 15,
    medium: 10,
    hard: 5,
    impossible: 3
};

const audio = {
    correct: new Audio('correct.mp3'),
    incorrect: new Audio('incorrect.mp3'),
    background: new Audio('background.mp3')
};

audio.background.loop = true; // Loop background music

// Function to fetch questions from JSON files
async function getQuestions(file_name) {
    try {
        let response = await fetch(file_name);
        if (!response.ok) throw new Error('Network response was not ok');
        let questions = await response.json();
        return questions["questions"];
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

// Load questions from JSON files
Promise.all([
    getQuestions("questions1.json").then(questions => { questions_eng = questions; }),
    getQuestions("questions2.json").then(questions => { questions_sport = questions; }),
    getQuestions("questions3.json").then(questions => { questions_game = questions; }),
    getQuestions("questions4.json").then(questions => { questions_geo = questions; })
]).then(() => {
    console.log('All questions loaded');
});

// Theme selection event listener
document.querySelectorAll('.theme-button').forEach(button => {
    button.addEventListener('click', () => {
        const selectedTheme = button.textContent.trim();
        switch (selectedTheme) {
            case 'Англійська':
                selectedQuiz = questions_eng;
                break;
            case 'Спорт':
                selectedQuiz = questions_sport;
                break;
            case 'Ігри':
                selectedQuiz = questions_game;
                break;
            case 'Географія':
                selectedQuiz = questions_geo;
                break;
            default:
                selectedQuiz = [];
                break;
        }
        mainScreen.style.display = 'none';
        difficulty_buttons.style.display = 'block';
    });
});

// Difficulty selection event listener
difficulty_buttons.addEventListener('click', function (event) {
    const selectedDifficulty = event.target.dataset.difficulty;
    currentDifficulty = difficultyLevels[selectedDifficulty];

    localStorage.setItem('selectedDifficulty', selectedDifficulty);

    difficulty_buttons.style.display = 'none';
    questionScreen.style.display = 'block';
    startQuiz();
});

// Start quiz function
function startQuiz() {
    currentQuestionIndex = 0;
    correctAnswersCount = 0;
    totalAnswersCount = 0;
    audio.background.play(); // Play background music
    displayNextQuestion();
    startCountdown();
}

// Display the next question
function displayNextQuestion() {
    if (currentQuestionIndex < selectedQuiz.length) {
        const currentQuestion = selectedQuiz[currentQuestionIndex];
        questionText.textContent = `${currentQuestionIndex + 1}/${selectedQuiz.length}: ${currentQuestion.question}`;
        answerButtons.forEach((button, index) => {
            button.textContent = currentQuestion.answers[index];
            button.style.background = ''; // Reset background for new answers
            button.classList.remove('fade-in', 'fade-out'); // Reset animation classes
        });
        currentQuestionIndex++;
        animateQuestionDisplay(); // Animate question display
    } else {
        endQuiz();
    }
}

// Countdown timer for each question
function startCountdown() {
    let countdownTime = currentDifficulty;
    timerDisplay.innerHTML = `Залишилось: ${countdownTime} сек`;

    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        countdownTime--;
        timerDisplay.innerHTML = `Залишилось: ${countdownTime} сек`;

        if (countdownTime <= 0) {
            clearInterval(countdownInterval);
            totalAnswersCount++;
            displayNextQuestion();
            startCountdown(); // Start timer for the next question
        }
    }, 1000);
}

// Handle answer button clicks
answerButtons.forEach(button => {
    button.addEventListener('click', function () {
        const currentQuestion = selectedQuiz[currentQuestionIndex - 1];
        totalAnswersCount++;

        if (button.innerHTML === currentQuestion.correct) {
            correctAnswersCount++;
            button.style.background = '#13fa0f'; // Green for correct answer
            if (!isMuted) audio.correct.play(); // Play sound if not muted
        } else {
            button.style.background = '#e74c3c'; // Red for incorrect answer
            if (!isMuted) audio.incorrect.play(); // Play sound if not muted
        }

        // Delay before showing the next question
        setTimeout(() => {
            displayNextQuestion();
            startCountdown(); // Update timer for the next question
        }, 1000);
    });
});

// Handle skip button click
skipButton.addEventListener('click', function () {
    totalAnswersCount++;
    displayNextQuestion(); // Move to the next question immediately
});

// Mute button functionality
muteButton.addEventListener('click', () => {
    isMuted = !isMuted;
    muteButton.textContent = isMuted ? 'Unmute' : 'Mute'; // Toggle button text
    if (isMuted) {
        audio.background.pause(); // Stop background music if muted
    } else {
        audio.background.play(); // Play background music if unmuted
    }
});

// End quiz function
function endQuiz() {
    clearInterval(countdownInterval);
    audio.background.pause(); // Stop background music
    questionText.textContent = 'Квіз завершено!';
    answerButtons.forEach(button => button.style.display = 'none'); // Hide answer buttons
    timerDisplay.innerHTML = ''; // Hide timer
    statisticsDisplay.textContent = `Ви відповіли правильно на ${correctAnswersCount} з ${totalAnswersCount} питань!`;
    statisticsDisplay.style.display = 'block'; // Show statistics

    // Update and display leaderboard
    updateLeaderboard(correctAnswersCount);
}

// Update and display leaderboard
function updateLeaderboard(score) {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push(score);
    leaderboard.sort((a, b) => b - a); // Sort in descending order
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    // Display leaderboard
    leaderboardDisplay.innerHTML = `<h2>Лідерборд:</h2><ol>${leaderboard.map(score => `<li>${score}</li>`).join('')}</ol>`;
    leaderboardDisplay.style.display = 'block'; // Show leaderboard
}

// Animate question display
function animateQuestionDisplay() {
    questionText.classList.add('fade-in'); // Add fade-in class for animation
    setTimeout(() => {
        questionText.classList.remove('fade-in'); // Remove after animation
    }, 500); // Match this duration to your CSS animation duration
}
