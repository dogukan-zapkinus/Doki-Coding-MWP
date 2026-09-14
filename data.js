// --- Dil Destekleri (i18n) ---
const i18n = {
    en: {
        check: "CHECK",
        next: "CONTINUE",
        correct: "Correct!",
        wrong: "Incorrect!",
        completed: "Course Completed!",
        restart: "RESTART",
        progress: "COURSE PROGRESS",
        lockedMsg: "This language is locked right now."
    },
    tr: {
        check: "KONTROL ET",
        next: "DEVAM ET",
        correct: "Doğru!",
        wrong: "Yanlış!",
        completed: "Kurs Tamamlandı!",
        restart: "BAŞA DÖN",
        progress: "KURS İLERLEMESİ",
        lockedMsg: "Bu dil şu an kilitli."
    }
};

// --- Ana Sayfa Dil Seçenekleri ---
const availableLanguages = [
    { id: "python", name: "Python", icon: "devicon-python-plain", locked: false, color: "text-blue-500" },
    { id: "javascript", name: "JavaScript", icon: "devicon-javascript-plain", locked: true, color: "text-yellow-400" },
    { id: "typescript", name: "TypeScript", icon: "devicon-typescript-plain", locked: true, color: "text-blue-600" },
    { id: "c", name: "C", icon: "devicon-c-plain", locked: true, color: "text-indigo-600" },
    { id: "cpp", name: "C++", icon: "devicon-cplusplus-plain", locked: true, color: "text-blue-700" },
    { id: "csharp", name: "C#", icon: "devicon-csharp-plain", locked: true, color: "text-purple-600" },
    { id: "go", name: "Go", icon: "devicon-go-plain", locked: true, color: "text-cyan-500" },
    { id: "sql", name: "SQL", icon: "devicon-azuresqldatabase-plain", locked: true, color: "text-slate-500" },
    { id: "bash", name: "Bash/Shell", icon: "devicon-bash-plain", locked: true, color: "text-slate-800 dark:text-slate-200" },
    { id: "lua", name: "Lua", icon: "devicon-lua-plain", locked: true, color: "text-indigo-500" }
];

// --- Python 10 Adımlık Yol Haritası (Ders 1 - Test 1 formatı) ---
const pythonRoadmap = [
    {
        type: "lesson",
        title: { en: "Lesson 1: What is Python?", tr: "Ders 1: Python Nedir?" },
        theory: { 
            en: "Python is a very popular, easy-to-read programming language. It is used in AI, web development, and data science.", 
            tr: "Python, okunması çok kolay ve dünyanın en popüler yazılım dillerinden biridir. Yapay zeka, web siteleri ve veri biliminde kullanılır." 
        },
        question: { en: "What is Python mainly known for?", tr: "Python en çok hangi özelliği ile bilinir?" },
        options: ["Zor okunması", "Sadece oyun yapılması", "Kolay okunabilir olması", "Sadece hesap makinesi olması"],
        correctAnswerIndex: 2
    },
    {
        type: "test",
        title: { en: "Test 1: Python Basics", tr: "Test 1: Python Temelleri" },
        theory: { en: "Let's test what you learned!", tr: "Öğrendiklerini test etme zamanı! Hatırlayalım; Python yapay zekadan web sitelerine kadar her yerde kullanılır." },
        question: { en: "Which area heavily uses Python?", tr: "Hangi alan Python'u yoğun olarak kullanır?" },
        options: ["Yapay Zeka (AI)", "Araba motorları", "Kıyafet tasarımı", "Müzik aletleri"],
        correctAnswerIndex: 0
    },
    {
        type: "lesson",
        title: { en: "Lesson 2: Print Function", tr: "Ders 2: Ekrana Yazdırma" },
        theory: { 
            en: "To show a message on the screen in Python, we use the `print()` command.", 
            tr: "Python'da ekrana bir yazı veya sonuç yazdırmak (göstermek) için `print()` komutunu kullanırız." 
        },
        question: { en: "How do you print 'Hello' in Python?", tr: "Python'da ekrana 'Merhaba' yazdırmak için hangisi kullanılır?" },
        options: ["echo 'Merhaba'", "print('Merhaba')", "yazdır('Merhaba')", "console.log('Merhaba')"],
        correctAnswerIndex: 1
    },
    {
        type: "test",
        title: { en: "Test 2: Print Challenge", tr: "Test 2: Yazdırma Görevi" },
        theory: { en: "No hints this time!", tr: "Bu sefer ipucu yok! Sadece bilgini kullan." },
        question: { en: "What does `print(5)` do?", tr: "`print(5)` komutu ne yapar?" },
        options: ["Bilgisayarı kapatır", "Ekrana 5 sayısını yazdırır", "Hata verir", "5 tane yeni dosya açar"],
        correctAnswerIndex: 1
    },
    {
        type: "lesson",
        title: { en: "Lesson 3: Variables", tr: "Ders 3: Değişkenler (Kutular)" },
        theory: { 
            en: "Variables are like boxes where we store data. E.g., `age = 20` stores the number 20 in a box named 'age'.", 
            tr: "Değişkenler, içine bilgi koyduğumuz kutular gibidir. Örneğin `yas = 20` yazdığında, 'yas' adında bir kutu oluşturup içine 20 koyarsın." 
        },
        question: { en: "How do you create a variable named 'score' and set it to 10?", tr: "'skor' adında bir değişken (kutu) oluşturup içine 10 sayısını nasıl koyarsın?" },
        options: ["10 = skor", "skor(10)", "skor = 10", "kutu skor 10"],
        correctAnswerIndex: 2
    },
    {
        type: "test",
        title: { en: "Test 3: Variable Mastery", tr: "Test 3: Değişken Ustalığı" },
        theory: { en: "Variables hold your data in memory.", tr: "Değişkenler bilgilerimizi hafızada tutar. Eşittir (=) işareti sağdaki değeri soldaki kutuya atar." },
        question: { en: "If x = 5 and y = 2, what is stored in memory?", tr: "Eğer `x = 5` yazarsak bilgisayar ne anlar?" },
        options: ["x kutusuna 5 sayısını koyduğunu", "x ve 5'in yer değiştirdiğini", "x'in artık kullanılamayacağını", "Hata vereceğini"],
        correctAnswerIndex: 0
    },
    {
        type: "lesson",
        title: { en: "Lesson 4: Text vs Numbers", tr: "Ders 4: Metinler ve Sayılar" },
        theory: { 
            en: "Text (Strings) must be inside quotes like 'Hello'. Numbers don't need quotes.", 
            tr: "Metinler (Yazılar) her zaman tırnak işareti içinde yazılır: 'Doki'. Sayılar ise tırnaksız yazılır: 42." 
        },
        question: { en: "Which one is a Text (String)?", tr: "Aşağıdakilerden hangisi bir Metin (String) verisidir?" },
        options: ["99", "'Elma'", "3.14", "0"],
        correctAnswerIndex: 1
    },
    {
        type: "test",
        title: { en: "Test 4: Data Types", tr: "Test 4: Veri Tipleri" },
        theory: { en: "Test your knowledge on quotes.", tr: "Sayılar ve Metinler arasındaki fark kodlamada çok önemlidir." },
        question: { en: "What is correct?", tr: "Hangi değişken tanımlaması DOĞRUDUR?" },
        options: ["isim = 15", "yas = 'Ahmet'", "isim = 'Ali'", "yas = 'Yirmi'"],
        correctAnswerIndex: 2
    },
    {
        type: "lesson",
        title: { en: "Lesson 5: Math Basics", tr: "Ders 5: Matematik İşlemleri" },
        theory: { 
            en: "You can do math in Python! Addition (+), Subtraction (-), Multiplication (*), Division (/).", 
            tr: "Python aynı zamanda bir hesap makinesidir! Toplama (+), Çıkarma (-), Çarpma (*) ve Bölme (/) yapabilirsin." 
        },
        question: { en: "What does `print(3 * 4)` output?", tr: "`print(3 * 4)` komutunun ekran çıktısı ne olur?" },
        options: ["3 * 4", "12", "7", "34"],
        correctAnswerIndex: 1
    },
    {
        type: "test",
        title: { en: "Test 5: Final Boss", tr: "Test 5: Final Patronu" },
        theory: { en: "Combine everything you know!", tr: "Öğrendiğin her şeyi birleştir! Değişkenler, matematik ve yazdırma bir arada." },
        question: { en: "What is the output? a=2, b=3, print(a+b)", tr: "`a = 2` ve `b = 3` ise, `print(a + b)` sonucu ne olur?" },
        options: ["23", "a+b", "5", "6"],
        correctAnswerIndex: 2
    }
];
