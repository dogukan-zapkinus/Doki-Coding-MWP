let currentLang = localStorage.getItem("dokicoding_lang") || "tr";
let currentTheme = localStorage.getItem("dokicoding_theme") || "dark";
let pythonProgress = parseInt(localStorage.getItem("dokicoding_python_progress")) || 0; 
let currentStepIndex = null;
let selectedOptionIndex = null;
let currentView = 'languages'; 

// Gelişmiş Ses Motoru
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime); 
        osc.frequency.setValueAtTime(554, audioCtx.currentTime + 0.1); 
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.2); 
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.4);
    } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.3);
    }
}

const langToggle = document.getElementById("lang-toggle");
const themeToggle = document.getElementById("theme-toggle");
const viewLanguages = document.getElementById("view-languages");
const viewRoadmap = document.getElementById("view-roadmap");
const viewLesson = document.getElementById("view-lesson");

function init() {
    updateStaticUI();
    showView(currentView);
}

function updateStaticUI() {
    langToggle.innerText = currentLang === "en" ? "🇹🇷 TR" : "🇬🇧 EN";
    themeToggle.innerText = currentTheme === "dark" ? "☀️" : "🌙";
    document.getElementById("lang-select-title").innerText = i18n[currentLang].chooseLang;
    document.getElementById("btn-login").innerText = i18n[currentLang].login;
    document.getElementById("btn-signup").innerText = i18n[currentLang].signup;
    document.getElementById("app-footer").innerText = i18n[currentLang].footerText;
}

function showView(viewName) {
    currentView = viewName;
    viewLanguages.classList.add("hidden");
    viewRoadmap.classList.add("hidden");
    viewLesson.classList.add("hidden");

    if (viewName === 'languages') {
        viewLanguages.classList.remove("hidden");
        renderLanguages();
    }
    if (viewName === 'roadmap') {
        viewRoadmap.classList.remove("hidden");
        renderRoadmap();
    }
    if (viewName === 'lesson') {
        viewLesson.classList.remove("hidden");
        startLesson(currentStepIndex);
    }
}

window.alertAuth = function() {
    alert(i18n[currentLang].comingSoon + " 🦊");
};

function renderLanguages() {
    const grid = document.getElementById("language-grid");
    grid.innerHTML = "";

    availableLanguages.forEach(lang => {
        const btn = document.createElement("button");
        const baseStyle = "flex flex-col items-center justify-center p-6 rounded-3xl border-4 transition-all ";
        
        if (lang.locked) {
            btn.className = baseStyle + "locked border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900";
            btn.onclick = () => alert(i18n[currentLang].lockedMsg);
        } else {
            btn.className = baseStyle + `border-slate-200 dark:border-slate-700 bg-white dark:bg-darkcard hover:border-orange-400 dark:hover:border-orange-500 hover:-translate-y-2 hover:shadow-xl cursor-pointer`;
            btn.onclick = () => showView('roadmap');
        }

        btn.innerHTML = `
            <i class="${lang.icon} colored text-6xl mb-4 ${lang.locked ? 'opacity-50 grayscale' : ''}"></i>
            <span class="font-black text-xl text-slate-700 dark:text-slate-300">${lang.name}</span>
            ${lang.locked ? `<span class="mt-2 text-xs font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">🔒 ${i18n[currentLang].comingSoon}</span>` : ''}
        `;
        grid.appendChild(btn);
    });
}

function renderRoadmap() {
    const pathContainer = document.getElementById("roadmap-path");
    pathContainer.innerHTML = '<div class="roadmap-line h-full top-0"></div>';

    pythonRoadmap.forEach((step, index) => {
        const isCompleted = index < pythonProgress;
        const isCurrent = index === pythonProgress;
        
        const wrapper = document.createElement("div");
        wrapper.className = "relative flex items-center justify-center w-full";
        
        const offset = Math.sin(index) * 60; 
        
        const node = document.createElement("button");
        node.style.transform = `translateX(${offset}px)`;
        
        // Seviye Numarası Etiketi
        const levelLabel = document.createElement("div");
        levelLabel.className = "absolute text-slate-400 dark:text-slate-500 font-black text-xl";
        levelLabel.style.transform = `translateX(${offset - 60}px)`;
        levelLabel.innerText = `${index + 1}.`;

        let classes = "path-node relative w-20 h-20 rounded-full border-[6px] flex items-center justify-center z-10 font-black text-3xl shadow-lg ";
        
        if (isCompleted) {
            classes += "bg-green-400 border-green-500 text-white shadow-green-500/50 cursor-pointer hover:scale-110";
            node.innerHTML = "⭐";
            node.onclick = () => { currentStepIndex = index; showView('lesson'); };
        } else if (isCurrent) {
            classes += "bg-orange-400 border-orange-500 text-white shadow-orange-500/50 animate-bounce cursor-pointer";
            node.innerHTML = step.type === 'lesson' ? "📖" : "⚔️";
            node.onclick = () => { currentStepIndex = index; showView('lesson'); };
            levelLabel.classList.add("text-orange-500");
        } else {
            classes += "locked bg-slate-200 border-slate-300 dark:bg-slate-700 dark:border-slate-600 text-slate-400";
            node.innerHTML = "🔒";
        }

        node.className = classes;
        wrapper.appendChild(levelLabel);
        wrapper.appendChild(node);
        pathContainer.appendChild(wrapper);
    });
}

document.getElementById("back-to-langs").onclick = () => showView('languages');
document.getElementById("back-to-roadmap").onclick = () => showView('roadmap');

function startLesson(index) {
    selectedOptionIndex = null;
    
    const pb = document.getElementById("progress-bar");
    const percentage = Math.round(((index + 1) / pythonRoadmap.length) * 100);
    pb.style.width = `${percentage}%`;

    const step = pythonRoadmap[currentStepIndex];
    const contentArea = document.getElementById("content-area");
    
    let isTest = step.type === 'test';
    let icon = isTest ? "🧠" : "💡";
    let colorTheme = isTest ? "orange" : "blue"; 

    let html = `
        <div class="animate-[popIn_0.4s_ease-out]">
            <div class="flex items-center gap-3 mb-6">
                <span class="text-4xl">${icon}</span>
                <h2 class="text-3xl font-black text-slate-800 dark:text-white tracking-tight">${step.title[currentLang]}</h2>
            </div>
            <div class="bg-${colorTheme}-50 dark:bg-${colorTheme}-900/30 border-l-8 border-${colorTheme}-500 p-6 mb-8 rounded-r-3xl">
                <p class="text-xl text-slate-700 dark:text-${colorTheme}-100 font-medium leading-relaxed">${step.theory[currentLang]}</p>
            </div>
            <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">${step.question[currentLang]}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8" id="options-container">
    `;

    step.options.forEach((opt, idx) => {
        html += `
            <button class="option-btn border-4 border-slate-100 dark:border-slate-700 dark:bg-slate-800 rounded-3xl p-5 text-left font-bold text-slate-700 dark:text-slate-300 text-lg hover:border-${colorTheme}-400 dark:hover:border-${colorTheme}-500 focus:outline-none transition-colors" onclick="selectOption(${idx})" id="option-${idx}">
                ${opt}
            </button>
        `;
    });

    html += `
            </div>
            <div id="feedback-area" class="min-h-[4rem] mb-6 flex items-center font-black text-xl rounded-2xl px-6 py-4 hidden"></div>
            <button id="action-btn" class="w-full bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 font-black py-5 rounded-3xl text-2xl cursor-not-allowed transition-all" disabled onclick="handleAction()">
                ${i18n[currentLang].check}
            </button>
        </div>
    `;

    contentArea.innerHTML = html;
}

window.selectOption = function(index) {
    const step = pythonRoadmap[currentStepIndex];
    let colorTheme = step.type === 'test' ? "orange" : "blue";

    step.options.forEach((_, i) => {
        const btn = document.getElementById(`option-${i}`);
        btn.classList.remove(`border-${colorTheme}-500`, `bg-${colorTheme}-50`, `dark:bg-${colorTheme}-900/40`, `text-${colorTheme}-700`, `dark:text-${colorTheme}-300`);
        btn.classList.add("border-slate-100", "dark:border-slate-700", "dark:bg-slate-800");
    });

    selectedOptionIndex = index;
    const selectedBtn = document.getElementById(`option-${index}`);
    selectedBtn.classList.remove("border-slate-100", "dark:border-slate-700", "dark:bg-slate-800");
    selectedBtn.classList.add(`border-${colorTheme}-500`, `bg-${colorTheme}-50`, `dark:bg-${colorTheme}-900/40`, `text-${colorTheme}-700`, `dark:text-${colorTheme}-300`);

    const actionBtn = document.getElementById("action-btn");
    actionBtn.disabled = false;
    actionBtn.classList.remove("bg-slate-200", "dark:bg-slate-700", "text-slate-400", "dark:text-slate-500", "cursor-not-allowed");
    actionBtn.classList.add(`bg-${colorTheme}-500`, "text-white", `hover:bg-${colorTheme}-600`);
};

window.handleAction = function() {
    const actionBtn = document.getElementById("action-btn");
    if (actionBtn.innerText === i18n[currentLang].check) {
        checkAnswer();
    } else {
        finishStep();
    }
};

function checkAnswer() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const step = pythonRoadmap[currentStepIndex];
    const feedbackArea = document.getElementById("feedback-area");
    const actionBtn = document.getElementById("action-btn");

    feedbackArea.classList.remove("hidden");
    step.options.forEach((_, i) => { document.getElementById(`option-${i}`).disabled = true; });

    if (selectedOptionIndex === step.correctAnswerIndex) {
        playSound('correct');
        feedbackArea.classList.add("bg-green-100", "dark:bg-green-900/50", "text-green-700", "dark:text-green-400");
        feedbackArea.innerText = "✨ " + i18n[currentLang].correct;
        
        actionBtn.innerText = i18n[currentLang].next;
        actionBtn.className = "w-full text-white font-black py-5 rounded-3xl text-2xl transition-all bg-green-500 hover:bg-green-600 shadow-[0_10px_20px_rgba(34,197,94,0.3)]";
    } else {
        playSound('wrong');
        feedbackArea.classList.add("bg-red-100", "dark:bg-red-900/50", "text-red-700", "dark:text-red-400");
        feedbackArea.innerText = "❌ " + i18n[currentLang].wrong;
        
        setTimeout(() => {
            feedbackArea.classList.add("hidden");
            feedbackArea.className = "min-h-[4rem] mb-6 flex items-center font-black text-xl rounded-2xl px-6 py-4 hidden";
            
            step.options.forEach((_, i) => { document.getElementById(`option-${i}`).disabled = false; });
            document.getElementById(`option-${selectedOptionIndex}`).className = "option-btn border-4 border-slate-100 dark:border-slate-700 dark:bg-slate-800 rounded-3xl p-5 text-left font-bold text-slate-700 dark:text-slate-300 text-lg transition-colors";
            actionBtn.innerText = i18n[currentLang].check;
            actionBtn.className = "w-full bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 font-black py-5 rounded-3xl text-2xl cursor-not-allowed transition-all";
            actionBtn.disabled = true;
        }, 1500);
    }
}

function finishStep() {
    if (currentStepIndex === pythonProgress) {
        pythonProgress++;
        localStorage.setItem("dokicoding_python_progress", pythonProgress);
    }
    if (pythonProgress >= pythonRoadmap.length) alert(i18n[currentLang].completed);
    showView('roadmap');
}

langToggle.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "tr" : "en";
    localStorage.setItem("dokicoding_lang", currentLang);
    updateStaticUI();
    showView(currentView); // Artık bulunduğu sayfadan dışarı atmıyor, ekranı yeniliyor.
});

themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("dokicoding_theme", currentTheme);
    updateStaticUI();
});

init();
