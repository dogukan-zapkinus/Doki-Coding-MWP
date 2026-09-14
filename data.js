// --- i18n (Internationalization) Dictionary ---
const i18n = {
    en: {
        appTitle: "Doki Coding",
        start: "Start Lesson",
        check: "Check Answer",
        next: "Continue",
        correct: "Correct! Excellent job.",
        wrong: "Oops! Try again.",
        completed: "Course Completed! You are a Python beginner now.",
        restart: "Restart Course",
        progress: "Progress"
    },
    tr: {
        appTitle: "Doki Coding",
        start: "Derse Başla",
        check: "Cevabı Kontrol Et",
        next: "Devam Et",
        correct: "Doğru! Harika iş.",
        wrong: "Hata! Lütfen tekrar dene.",
        completed: "Kurs Tamamlandı! Artık Python'a giriş yaptın.",
        restart: "Kursu Sıfırla",
        progress: "İlerleme"
    }
};

// --- Lesson Data (Python Basics) ---
const lessons = [
    {
        id: 1,
        title: { en: "Hello World", tr: "Merhaba Dünya" },
        theory: {
            en: "To print something on the screen in Python, we use the <code>print()</code> function.",
            tr: "Python'da ekrana bir şey yazdırmak için <code>print()</code> fonksiyonunu kullanırız."
        },
        question: {
            en: "How do you print 'Hello' in Python?",
            tr: "Python'da 'Hello' kelimesini nasıl yazdırırsın?"
        },
        options: ["echo 'Hello'", "print('Hello')", "console.log('Hello')", "System.out.println('Hello')"],
        correctAnswerIndex: 1
    },
    {
        id: 2,
        title: { en: "Variables", tr: "Değişkenler" },
        theory: {
            en: "Variables are used to store data. You just write the variable name and use <code>=</code>.",
            tr: "Değişkenler veri saklamak için kullanılır. Sadece adını yazıp <code>=</code> kullanırsın."
        },
        question: {
            en: "Which one correctly creates a variable named 'age' with the value 25?",
            tr: "Hangisi 25 değerinde 'age' adında bir değişken oluşturur?"
        },
        options: ["int age = 25", "var age = 25", "age = 25", "let age = 25"],
        correctAnswerIndex: 2
    },
    {
        id: 3,
        title: { en: "Basic Math", tr: "Basit Matematik" },
        theory: {
            en: "Python can do math! You can use the <code>+</code> operator for addition.",
            tr: "Python matematik yapabilir! Toplama işlemi için <code>+</code> operatörünü kullanabilirsin."
        },
        question: {
            en: "What is the output of <code>print(5 + 3)</code>?",
            tr: "<code>print(5 + 3)</code> kodunun çıktısı nedir?"
        },
        options: ["53", "8", "5 + 3", "Error"],
        correctAnswerIndex: 1
    }
];
