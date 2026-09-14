let currentLang = localStorage.getItem("doki_lang") || "tr";
let currentTheme = localStorage.getItem("doki_theme") || (
  matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light"
);
let currentView = "languages";
let activeLanguage = localStorage.getItem("doki_active_language") || "python";
let selectedIndex = null;
let checked = false;
let currentLessonIndex = 0;
let audioCtx = null;

document.documentElement.classList.toggle("dark", currentTheme === "dark");

const $ = (id) => document.getElementById(id);

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[c]));

const progressKey = () => `doki_progress_${activeLanguage}`;

const getProgress = () =>
  Number(localStorage.getItem(progressKey()) || 0);

const setProgress = (value) =>
  localStorage.setItem(
    progressKey(),
    String(Math.max(0, Math.min(25, value)))
  );

const t = (key) =>
  i18n[currentLang][key] ??
  i18n.tr[key] ??
  key;

/* -------------------------------------------------------
   FOX PURR SOUND
------------------------------------------------------- */

function purr(ok = true) {
  try {
    audioCtx ||= new (
      window.AudioContext ||
      window.webkitAudioContext
    )();

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();

    osc.type = "sine";

    osc.frequency.value = ok ? 105 : 78;

    lfo.frequency.value = 13;
    lfoGain.gain.value = 8;

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    gain.gain.setValueAtTime(0.0001, now);

    gain.gain.exponentialRampToValueAtTime(
      ok ? 0.16 : 0.1,
      now + 0.05
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + 0.55
    );

    lfo.start(now);
    osc.start(now);

    lfo.stop(now + 0.55);
    osc.stop(now + 0.55);

  } catch (_) {}
}

/* -------------------------------------------------------
   TOAST
------------------------------------------------------- */

function toast(text) {
  const x = document.createElement("div");

  x.className = "toast";
  x.textContent = text;

  document.body.appendChild(x);

  setTimeout(() => {
    x.remove();
  }, 2600);
}

/* -------------------------------------------------------
   FOX SVG
------------------------------------------------------- */

function fox() {
  return `
    <svg viewBox="0 0 80 80" aria-hidden="true">
      <path
        fill="#ff7a1a"
        d="M14 34 19 10l19 15L61 10l5 24c1 19-11 31-26 31S13 53 14 34Z"
      />

      <path
        fill="#fff"
        d="M25 41c8-10 22-10 30 0-2 12-8 17-15 17S27 53 25 41Z"
      />

      <circle
        cx="34"
        cy="39"
        r="2.6"
      />

      <circle
        cx="46"
        cy="39"
        r="2.6"
      />

      <path
        d="M38 47q2 2 4 0"
        fill="none"
        stroke="#252525"
        stroke-width="2.2"
        stroke-linecap="round"
      />
    </svg>
  `;
}

/* -------------------------------------------------------
   STATIC UI
------------------------------------------------------- */

function staticUI() {
  $("hero-title").textContent = t("chooseLang");

  $("hero-subtitle").textContent = t("subtitle");

  $("hero-byline").textContent =
    `${t("builtBy")} · ${t("localOnly")}`;

  $("streak-title").textContent =
    t("streak");

  $("streak-empty").textContent =
    t("streakEmpty");

  $("streak-note").textContent =
    t("streakNote");

  $("lang-title").textContent =
    t("chooseLang");

  $("lang-count").textContent =
    `${availableLanguages.length} languages · ${availableLanguages.length * 25} lessons`;

  $("help-btn").textContent =
    t("help");

  $("login-btn").textContent =
    t("login");

  $("signup-btn").textContent =
    t("signup");

  $("theme-btn").textContent =
    currentTheme === "dark"
      ? t("dark")
      : t("light");

  $("lang-btn").textContent =
    currentLang === "tr"
      ? "EN"
      : "TR";

  $("footer").textContent =
    `${t("builtBy")} · ${t("localOnly")}`;
}

/* -------------------------------------------------------
   ROUTING
------------------------------------------------------- */

function show(view) {
  currentView = view;

  ["languages", "roadmap", "lesson"].forEach((viewName) => {
    const element = $(`${viewName}-view`);

    if (element) {
      element.classList.toggle(
        "hidden",
        view !== viewName
      );
    }
  });

  staticUI();

  if (view === "languages") {
    renderLanguages();
  }

  if (view === "roadmap") {
    renderRoadmap();
  }

  if (view === "lesson") {
    renderLesson();
  }
}

/* -------------------------------------------------------
   LANGUAGE SCREEN
------------------------------------------------------- */

function renderLanguages() {
  const grid = $("language-grid");

  grid.innerHTML = "";

  availableLanguages.forEach((lang) => {
    const progress = Number(
      localStorage.getItem(
        `doki_progress_${lang.id}`
      ) || 0
    );

    const button = document.createElement("button");

    button.className = "lang-card";

    button.innerHTML = `
      <span class="open-dot"></span>

      <i
        class="lang-icon ${esc(lang.icon)} colored"
      ></i>

      <strong>
        ${esc(lang.name)}
      </strong>

      <div class="lang-meta">
        ${progress}/25 lessons
      </div>
    `;

    button.onclick = () => {
      activeLanguage = lang.id;

      localStorage.setItem(
        "doki_active_language",
        lang.id
      );

      currentLessonIndex = Math.min(
        Number(
          localStorage.getItem(progressKey()) || 0
        ),
        24
      );

      show("roadmap");
    };

    grid.appendChild(button);
  });
}

/* -------------------------------------------------------
   ROADMAP
------------------------------------------------------- */

function renderRoadmap() {
  const profile =
    languageProfiles[activeLanguage];

  const data =
    curricula[activeLanguage];

  const progress =
    getProgress();

  $("path-icon").className =
    `${profile.icon} colored`;

  $("path-name").textContent =
    profile.name;

  $("path-progress").textContent =
    `${progress}/25`;

  $("path-fill").style.width =
    `${progress / 25 * 100}%`;

  $("roadmap-back").textContent =
    t("back");

  const path =
    $("path");

  path.innerHTML =
    '<div class="path-line"></div>';

  data.forEach((lesson, index) => {
    const row =
      document.createElement("div");

    row.className =
      "node-row";

    const node =
      document.createElement("button");

    node.className =
      "node";

    if (index < progress) {
      node.classList.add("done");
    }

    if (index === progress) {
      node.classList.add("current");
    }

    node.textContent =
      String(index + 1);

    node.title =
      lesson.title[currentLang];

    node.onclick = () => {
      if (index <= progress) {
        currentLessonIndex =
          index;

        show("lesson");
      }
    };

    const label =
      document.createElement("span");

    label.className =
      "label";

    label.textContent =
      lesson.title[currentLang];

    row.append(
      node,
      label
    );

    path.appendChild(row);
  });
}

/* -------------------------------------------------------
   LESSON
------------------------------------------------------- */

function renderLesson() {
  const data =
    curricula[activeLanguage];

  const lesson =
    data[currentLessonIndex];

  selectedIndex = null;
  checked = false;

  $("lesson-back").textContent =
    t("back");

  $("lesson-num").textContent =
    `${t("lesson")} ${currentLessonIndex + 1}/25`;

  $("lesson-fill").style.width =
    `${((currentLessonIndex + 1) / 25) * 100}%`;

  const card =
    $("lesson-card");

  const foxLine =
    currentLessonIndex % 2 === 0
      ? t("foxHappy")
      : t("foxSad");

  let body = `
    <div class="fox-talk">

      <div class="fox-box">
        ${fox()}
      </div>

      <div class="bubble">
        <strong>
          Doğukan's fox
        </strong>

        ${esc(foxLine)}
      </div>

    </div>

    <h2>
      ${esc(lesson.title[currentLang])}
    </h2>

    <div class="theory">
      ${esc(lesson.theory[currentLang])}
    </div>

    <div class="question">
      ${esc(lesson.question[currentLang])}
    </div>
  `;

  if (lesson.type === "editor") {
    body += editorMarkup(lesson);
  } else {
    body += `
      <div class="options">

        ${lesson.options[currentLang]
          .map(
            (option, index) => `
              <button
                class="option"
                id="opt-${index}"
              >
                ${esc(option)}
              </button>
            `
          )
          .join("")}

      </div>

      <div
        id="feedback"
        class="feedback hidden"
      ></div>

      <div class="actions">

        <button
          id="check-btn"
          class="primary"
        >
          ${t("check")}
        </button>

        <button
          id="quit-btn"
          class="btn"
        >
          ${t("back")}
        </button>

      </div>
    `;
  }

  card.innerHTML =
    body;

  if (lesson.type === "editor") {
    wireEditor(lesson);
  } else {
    wireQuiz(lesson);
  }
}

/* -------------------------------------------------------
   QUIZ
------------------------------------------------------- */

function wireQuiz(lesson) {
  lesson.options[currentLang]
    .forEach((_, index) => {

      $(`opt-${index}`).onclick = () => {

        if (checked) {
          return;
        }

        selectedIndex =
          index;

        document
          .querySelectorAll(".option")
          .forEach((button) => {
            button.classList.remove(
              "selected"
            );
          });

        $(`opt-${index}`)
          .classList.add("selected");
      };
    });

  $("check-btn").onclick = () => {

    if (selectedIndex === null) {
      toast(t("check"));
      return;
    }

    checked = true;

    const buttons =
      [
        ...document.querySelectorAll(".option")
      ];

    buttons[
      lesson.correctAnswerIndex
    ].classList.add("good");

    if (
      selectedIndex ===
      lesson.correctAnswerIndex
    ) {

      purr(true);

      const feedback =
        $("feedback");

      feedback.className =
        "feedback good";

      feedback.textContent =
        t("correct");

      queueAdvance();

    } else {

      purr(false);

      buttons[
        selectedIndex
      ].classList.add("bad");

      const feedback =
        $("feedback");

      feedback.className =
        "feedback bad";

      feedback.textContent =
        t("wrong");

      $("check-btn").textContent =
        t("retry");

      $("check-btn").onclick =
        () => renderLesson();
    }
  };

  $("quit-btn").onclick =
    () => show("roadmap");
}

/* -------------------------------------------------------
   ADVANCE LESSON
------------------------------------------------------- */

function queueAdvance() {
  const next =
    currentLessonIndex + 1;

  if (
    next > getProgress()
  ) {
    setProgress(next);
  }

  $("check-btn").textContent =
    next >= 25
      ? t("pathComplete")
      : t("next");

  $("check-btn").onclick =
    () => {

      if (next >= 25) {
        show("roadmap");

        toast(
          t("pathComplete")
        );

        return;
      }

      currentLessonIndex =
        next;

      show("lesson");
    };
}

/* -------------------------------------------------------
   EDITOR
------------------------------------------------------- */

function editorMarkup(lesson) {
  return `
    <div class="editor-wrap">

      <div class="editor-top">

        <span>
          ${t("codeEditor")}
        </span>

        <div class="editor-tools">

          <button
            id="run-code"
          >
            ${t("run")}
          </button>

          <button
            id="reset-code"
          >
            ${t("reset")}
          </button>

        </div>

      </div>

      <textarea
        id="code-editor"
        class="code"
        spellcheck="false"
      ></textarea>

      <div
        id="editor-output"
        class="output"
      >
        ${t("editorHint")}
      </div>

    </div>

    <div class="actions">

      <button
        id="editor-back"
        class="btn"
      >
        ${t("back")}
      </button>

      <button
        id="editor-next"
        class="primary"
      >
        ${t("check")}
      </button>

    </div>
  `;
}

function norm(value) {
  return String(value)
    .toLowerCase()
    .replace(/\r/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function validate(code, lesson) {
  const normalized =
    norm(code);

  const checks =
    lesson.editor.checks || [];

  return checks.every(
    (item) =>
      normalized.includes(
        String(item).toLowerCase()
      )
  );
}

function wireEditor(lesson) {
  const textarea =
    $("code-editor");

  const output =
    $("editor-output");

  textarea.value =
    lesson.editor.starter;

  $("run-code").onclick = () => {

    const ok =
      validate(
        textarea.value,
        lesson
      );

    if (
      activeLanguage ===
      "javascript"
    ) {

      try {

        const logs = [];

        const oldConsoleLog =
          console.log;

        console.log =
          (...args) => {
            logs.push(
              args.join(" ")
            );
          };

        new Function(
          textarea.value
        )();

        console.log =
          oldConsoleLog;

        output.textContent =
          logs.join("\n") ||
          (
            ok
              ? t("runSuccess")
              : t("runNeedsWork")
          );

      } catch (error) {

        output.textContent =
          error.message;
      }

    } else {

      output.textContent =
        ok
          ? t("runSuccess")
          : t("runNeedsWork");
    }

    purr(ok);
  };

  $("reset-code").onclick = () => {

    textarea.value =
      lesson.editor.starter;

    output.textContent =
      t("editorHint");
  };

  $("editor-back").onclick =
    () => show("roadmap");

  $("editor-next").onclick = () => {

    const ok =
      validate(
        textarea.value,
        lesson
      );

    if (!ok) {

      output.textContent =
        t("runNeedsWork");

      purr(false);

      return;
    }

    purr(true);

    setProgress(25);

    show("roadmap");

    toast(
      t("pathComplete")
    );
  };
}

/* -------------------------------------------------------
   4-STEP TUTORIAL
------------------------------------------------------- */

function tutorial(force = false) {

  if (
    !force &&
    localStorage.getItem(
      "doki_tour_done"
    ) === "1"
  ) {
    return;
  }

  let step = 0;

  const root =
    $("modal-root");

  root.className =
    "";

  root.innerHTML = `
    <div class="modal">

      <div class="modal-inner">

        <h3>
          ${t("tutorialTitle")}
        </h3>

        <p>
          ${t("localOnly")}
        </p>

        <div id="tour-content"></div>

        <div class="modal-actions">

          <button
            id="tour-skip"
            class="btn"
          >
            ${t("tutorialSkip")}
          </button>

          <button
            id="tour-next"
            class="btn primary"
          ></button>

        </div>

      </div>

    </div>
  `;

  const steps = [
    t("tutorialStep1"),
    t("tutorialStep2"),
    t("tutorialStep3"),
    t("tutorialStep4")
  ];

  const paint = () => {

    $("tour-content").innerHTML =
      steps
        .map(
          (stepText, index) => `
            <div
              class="tour-item"
              style="opacity:${index === step ? 1 : 0.52}"
            >
              <b>${index + 1}.</b>
              ${esc(stepText)}
            </div>
          `
        )
        .join("");

    $("tour-next").textContent =
      step === steps.length - 1
        ? t("tutorialDone")
        : t("tutorialNext");
  };

  paint();

  $("tour-skip").onclick =
    () => {

      localStorage.setItem(
        "doki_tour_done",
        "1"
      );

      root.className =
        "hidden";
    };

  $("tour-next").onclick =
    () => {

      if (
        step <
        steps.length - 1
      ) {

        step++;
        paint();

      } else {

        localStorage.setItem(
          "doki_tour_done",
          "1"
        );

        root.className =
          "hidden";
      }
    };
}

/* -------------------------------------------------------
   EVENTS
------------------------------------------------------- */

$("home-btn").onclick =
  () => show("languages");

$("roadmap-back").onclick =
  () => show("languages");

$("lesson-back").onclick =
  () => show("roadmap");

$("help-btn").onclick =
  () => tutorial(true);

$("login-btn").onclick =
  () =>
    toast(
      t("localAccounts")
    );

$("signup-btn").onclick =
  () =>
    toast(
      t("localAccounts")
    );

$("theme-btn").onclick =
  () => {

    currentTheme =
      currentTheme === "dark"
        ? "light"
        : "dark";

    localStorage.setItem(
      "doki_theme",
      currentTheme
    );

    document.documentElement
      .classList.toggle(
        "dark",
        currentTheme === "dark"
      );

    staticUI();
  };

$("lang-btn").onclick =
  () => {

    currentLang =
      currentLang === "tr"
        ? "en"
        : "tr";

    localStorage.setItem(
      "doki_lang",
      currentLang
    );

    show(currentView);
  };

/* -------------------------------------------------------
   INIT
------------------------------------------------------- */

staticUI();

show("languages");

setTimeout(
  () => tutorial(false),
  250
);
