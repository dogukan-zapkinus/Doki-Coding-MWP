// --- Application State ---
let currentLang = localStorage.getItem("dokicoding_lang") || "en";
let currentLessonIndex = parseInt(localStorage.getItem("dokicoding_progress")) || 0;
let selectedOptionIndex = null;
let isDark = document.documentElement.classList.contains("dark");

// --- DOM Elements ---
const appTitle = document.getElementById("app-title");
const langToggle = document.getElementById("lang-toggle");
const themeToggle = document.getElementById("theme-toggle");
const contentArea = document.getElementById("content-area");
const progressBar = document.getElementById("progress-bar");
const progressContainer = document.getElementById("progress-container");
const progressText = document.getElementById("progress-text");
const progressPercentage = document.getElementById("progress-percentage");

// --- Core Initialization ---
function init() {
    updateStaticUI();
    if (currentLessonIndex >= lessons.length) {
        renderCompletedState();
    } else {
        renderLesson();
    }
}

// --- UI Updaters ---
function updateStaticUI() {
    progressText.innerText = i18n[currentLang].progress;
    langToggle.innerText = currentLang === "en" ? "🇹🇷 TR" : "🇬🇧 EN";
    themeToggle.innerText = isDark ? "☀️" : "🌙";
}

function updateProgress() {
    progressContainer.classList.remove("hidden");
    const percentage = Math.round((currentLessonIndex / lessons.length) * 100);
    progressBar.style.width = `${percentage}%`;
    progressPercentage.innerText = `${percentage}%`;
}

function renderLesson() {
    updateProgress();
    selectedOptionIndex = null;
    const lesson = lessons[currentLessonIndex];
    
    let html = `
        <div class="pop-in">
            <h2 class="text-4xl font-black text-slate-800 dark:text-white mb-6 tracking-tight">${lesson.title[currentLang]}</h2>
            
            <div class="bg-indigo-50 dark:bg-indigo-900/30 border-l-8 border-indigo-500 p-6 mb-10 rounded-r-3xl">
                <p class="text-xl text-slate-700 dark:text-indigo-100 font-medium leading-relaxed">${lesson.theory[currentLang]}</p>
            </div>
            
            <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">${lesson.question[currentLang]}</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10" id="options-container">
    `;

    lesson.options.forEach((opt, index) => {
        html += `
            <button 
                class="option-btn border-4 border-slate-100 dark:border-slate-700 dark:bg-slate-800 rounded-3xl p-6 text-left font-mono font-bold text-slate-700 dark:text-slate-300 text-lg hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none transition-colors"
                onclick="selectOption(${index})"
                id="option-${index}"
            >
                ${opt}
            </button>
        `;
    });

    html += `
            </div>
            
            <div id="feedback-area" class="min-h-[4rem] mb-8 flex items-center font-black text-xl rounded-2xl px-6 py-4 hidden pop-in"></div>
            
            <button 
                id="action-btn"
                class="w-full bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 font-black py-5 rounded-3xl text-2xl cursor-not-allowed transition-all"
                disabled
                onclick="handleAction()"
            >
                ${i18n[currentLang].check}
            </button>
        </div>
    `;

    contentArea.innerHTML = html;
}

function renderCompletedState() {
    progressContainer.classList.add("hidden");
    contentArea.innerHTML = `
        <div class="text-center py-16 pop-in">
            <div class="text-8xl mb-8 animate-bounce">🏆</div>
            <h2 class="text-5xl font-black text-green-500 dark:text-green-400 mb-6">${i18n[currentLang].completed}</h2>
            <p class="text-xl text-slate-500 dark:text-slate-400 mb-10 font-bold">Harika bir başlangıç yaptın!</p>
            <button 
                class="bg-indigo-500 text-white font-black py-5 px-12 rounded-full text-2xl hover:bg-indigo-600 transition shadow-[0_10px_30px_rgba(99,102,241,0.4)] active:scale-95"
                onclick="restartCourse()"
            >
                ${i18n[currentLang].restart}
            </button>
        </div>
    `;
}

// --- Interactions ---
window.selectOption = function(index) {
    const lesson = lessons[currentLessonIndex];
    
    lesson.options.forEach((_, i) => {
        const btn = document.getElementById(`option-${i}`);
        btn.classList.remove("border-indigo-500", "bg-indigo-50", "dark:bg-indigo-900/40", "text-indigo-700", "dark:text-indigo-300");
        btn.classList.add("border-slate-100", "dark:border-slate-700", "dark:bg-slate-800");
    });

    selectedOptionIndex = index;
    const selectedBtn = document.getElementById(`option-${index}`);
    selectedBtn.classList.remove("border-slate-100", "dark:border-slate-700", "dark:bg-slate-800");
    selectedBtn.classList.add("border-indigo-500", "bg-indigo-50", "dark:bg-indigo-900/40", "text-indigo-700", "dark:text-indigo-300");

    const actionBtn = document.getElementById("action-btn");
    actionBtn.disabled = false;
    actionBtn.classList.remove("bg-slate-200", "dark:bg-slate-700", "text-slate-400", "dark:text-slate-500", "cursor-not-allowed");
    actionBtn.classList.add("bg-indigo-500", "text-white", "hover:bg-indigo-600", "shadow-[0_10px_20px_rgba(99,102,241,0.3)]");
};

window.handleAction = function() {
    const actionBtn = document.getElementById("action-btn");
    if (actionBtn.innerText === i18n[currentLang].check) {
        checkAnswer();
    } else {
        nextLesson();
    }
};

function checkAnswer() {
    const lesson = lessons[currentLessonIndex];
    const feedbackArea = document.getElementById("feedback-area");
    const actionBtn = document.getElementById("action-btn");
    const selectedBtn = document.getElementById(`option-${selectedOptionIndex}`);

    feedbackArea.classList.remove("hidden");

    lesson.options.forEach((_, i) => {
        document.getElementById(`option-${i}`).disabled = true;
    });

    if (selectedOptionIndex === lesson.correctAnswerIndex) {
        feedbackArea.classList.add("bg-green-100", "dark:bg-green-900/50", "text-green-700", "dark:text-green-400");
        feedbackArea.innerText = "✨ " + i18n[currentLang].correct;
        
        selectedBtn.classList.replace("border-indigo-500", "border-green-500");
        
        actionBtn.innerText = i18n[currentLang].next;
        actionBtn.classList.replace("bg-indigo-500", "bg-green-500");
        actionBtn.classList.replace("hover:bg-indigo-600", "hover:bg-green-600");
        actionBtn.classList.replace("shadow-[0_10px_20px_rgba(99,102,241,0.3)]", "shadow-[0_10px_20px_rgba(34,197,94,0.3)]");
    } else {
        feedbackArea.classList.add("bg-red-100", "dark:bg-red-900/50", "text-red-700", "dark:text-red-400");
        feedbackArea.innerText = "❌ " + i18n[currentLang].wrong;
        
        selectedBtn.classList.replace("border-indigo-500", "border-red-500");
        
        setTimeout(() => {
            feedbackArea.classList.add("hidden");
            feedbackArea.classList.remove("bg-red-100", "dark:bg-red-900/50", "text-red-700", "dark:text-red-400");
            
            selectedBtn.classList.replace("border-red-500", "border-indigo-500");

            lesson.options.forEach((_, i) => {
                document.getElementById(`option-${i}`).disabled = false;
            });
        }, 1500);
    }
}

function nextLesson() {
    currentLessonIndex++;
    localStorage.setItem("dokicoding_progress", currentLessonIndex);
    
    if (currentLessonIndex >= lessons.length) {
        updateProgress();
        setTimeout(renderCompletedState, 300);
    } else {
        renderLesson();
    }
}

window.restartCourse = function() {
    currentLessonIndex = 0;
    localStorage.setItem("dokicoding_progress", 0);
    init();
};

// --- Listeners ---
langToggle.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "tr" : "en";
    localStorage.setItem("dokicoding_lang", currentLang);
    init();
});

themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("dokicoding_theme", isDark ? "dark" : "light");
    updateStaticUI();
});

init();
