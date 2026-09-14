// --- Application State ---
// Retrieve user preferences and progress from localStorage
let currentLang = localStorage.getItem("dokicoding_lang") || "en";
let currentLessonIndex = parseInt(localStorage.getItem("dokicoding_progress")) || 0;
let selectedOptionIndex = null;

// --- DOM Elements ---
const appTitle = document.getElementById("app-title");
const langToggle = document.getElementById("lang-toggle");
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

// --- Interface Render Functions ---
function updateStaticUI() {
    appTitle.innerText = i18n[currentLang].appTitle;
    progressText.innerText = i18n[currentLang].progress;
    langToggle.innerText = currentLang === "en" ? "🇹🇷 Türkçe Yap" : "🇬🇧 Switch to EN";
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
        <h2 class="text-3xl font-extrabold text-slate-800 mb-4">${lesson.title[currentLang]}</h2>
        
        <div class="bg-indigo-50/50 border-l-4 border-indigo-500 p-5 mb-8 rounded-r-2xl">
            <p class="text-lg text-slate-700 leading-relaxed">${lesson.theory[currentLang]}</p>
        </div>
        
        <h3 class="text-xl font-bold text-slate-800 mb-5">${lesson.question[currentLang]}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8" id="options-container">
    `;

    // Render answer options
    lesson.options.forEach((opt, index) => {
        html += `
            <button 
                class="option-btn border-2 border-slate-200 rounded-2xl p-5 text-left font-mono text-slate-700 text-lg hover:border-indigo-400 hover:bg-indigo-50 focus:outline-none"
                onclick="selectOption(${index})"
                id="option-${index}"
            >
                ${opt}
            </button>
        `;
    });

    html += `
        </div>
        
        <div id="feedback-area" class="min-h-[3rem] mb-6 flex items-center font-bold text-lg rounded-xl px-5 py-3 hidden"></div>
        
        <button 
            id="action-btn"
            class="w-full bg-slate-200 text-slate-400 font-bold py-4 rounded-2xl text-xl cursor-not-allowed transition-all duration-200"
            disabled
            onclick="handleAction()"
        >
            ${i18n[currentLang].check}
        </button>
    `;

    contentArea.innerHTML = html;
}

function renderCompletedState() {
    progressContainer.classList.add("hidden");
    contentArea.innerHTML = `
        <div class="text-center py-12 fade-in">
            <div class="text-7xl mb-6">🎉</div>
            <h2 class="text-3xl font-extrabold text-green-500 mb-4">${i18n[currentLang].completed}</h2>
            <button 
                class="bg-indigo-600 text-white font-bold py-4 px-10 rounded-full text-xl hover:bg-indigo-700 transition shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-lg mt-8 hover:-translate-y-1"
                onclick="restartCourse()"
            >
                ${i18n[currentLang].restart}
            </button>
        </div>
    `;
}

// --- User Interaction Logic ---
window.selectOption = function(index) {
    const lesson = lessons[currentLessonIndex];
    
    // Clear previous selections
    lesson.options.forEach((_, i) => {
        const btn = document.getElementById(`option-${i}`);
        btn.classList.remove("border-indigo-600", "bg-indigo-50", "text-indigo-700");
        btn.classList.add("border-slate-200");
    });

    // Highlight selected option
    selectedOptionIndex = index;
    const selectedBtn = document.getElementById(`option-${index}`);
    selectedBtn.classList.remove("border-slate-200");
    selectedBtn.classList.add("border-indigo-600", "bg-indigo-50", "text-indigo-700");

    // Enable check button
    const actionBtn = document.getElementById("action-btn");
    actionBtn.disabled = false;
    actionBtn.classList.remove("bg-slate-200", "text-slate-400", "cursor-not-allowed");
    actionBtn.classList.add("bg-indigo-600", "text-white", "hover:bg-indigo-700", "shadow-[0_4px_14px_0_rgba(79,70,229,0.39)]");
};

window.handleAction = function() {
    const actionBtn = document.getElementById("action-btn");
    const isChecking = actionBtn.innerText === i18n[currentLang].check;

    if (isChecking) {
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

    // Lock options
    lesson.options.forEach((_, i) => {
        document.getElementById(`option-${i}`).disabled = true;
    });

    if (selectedOptionIndex === lesson.correctAnswerIndex) {
        // Correct answer state
        feedbackArea.classList.add("bg-green-100", "text-green-700");
        feedbackArea.innerText = i18n[currentLang].correct;
        
        selectedBtn.classList.replace("border-indigo-600", "border-green-500");
        selectedBtn.classList.replace("bg-indigo-50", "bg-green-50");
        selectedBtn.classList.replace("text-indigo-700", "text-green-700");

        // Update button for next step
        actionBtn.innerText = i18n[currentLang].next;
        actionBtn.classList.replace("bg-indigo-600", "bg-green-500");
        actionBtn.classList.replace("hover:bg-indigo-700", "hover:bg-green-600");
        actionBtn.classList.replace("shadow-[0_4px_14px_0_rgba(79,70,229,0.39)]", "shadow-[0_4px_14px_0_rgba(34,197,94,0.39)]");
    } else {
        // Wrong answer state
        feedbackArea.classList.add("bg-red-100", "text-red-700");
        feedbackArea.innerText = i18n[currentLang].wrong;
        
        selectedBtn.classList.replace("border-indigo-600", "border-red-500");
        selectedBtn.classList.replace("bg-indigo-50", "bg-red-50");
        selectedBtn.classList.replace("text-indigo-700", "text-red-700");
        
        // Reset after delay
        setTimeout(() => {
            feedbackArea.classList.add("hidden");
            feedbackArea.classList.remove("bg-red-100", "text-red-700");
            
            selectedBtn.classList.replace("border-red-500", "border-indigo-600");
            selectedBtn.classList.replace("bg-red-50", "bg-indigo-50");
            selectedBtn.classList.replace("text-red-700", "text-indigo-700");

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
        setTimeout(renderCompletedState, 500);
    } else {
        renderLesson();
    }
}

window.restartCourse = function() {
    currentLessonIndex = 0;
    localStorage.setItem("dokicoding_progress", 0);
    init();
};

// --- Event Listeners ---
langToggle.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "tr" : "en";
    localStorage.setItem("dokicoding_lang", currentLang);
    init();
});

// Boot Application
init();
