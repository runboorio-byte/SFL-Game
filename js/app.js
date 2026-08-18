// المنطق الرئيسي للعبة
const Game = {
    // حالة اللعبة
    currentTeam: null,
    currentStation: 0,
    startTime: null,
    isLastStation: false,

    // تهيئة اللعبة
    init() {
        this.bindEvents();
        UI.showScreen('screen-start');
    },

    // ربط الأحداث
    bindEvents() {
        // زر البدء
        document.getElementById('btn-start').addEventListener('click', () => {
            this.startGame();
        });

        // إدخال الكود بالضغط على Enter
        document.getElementById('team-code').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startGame();
        });

        // زر التحقق من الإجابة
        document.getElementById('btn-check-answer').addEventListener('click', () => {
            this.checkAnswer();
        });

        // إدخال الإجابة بالضغط على Enter
        document.getElementById('riddle-answer').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer();
        });

        // زر تأكيد الكود
        document.getElementById('btn-check-code').addEventListener('click', () => {
            this.checkStationCode();
        });

        // إدخال الكود بالضغط على Enter
        document.getElementById('station-code').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkStationCode();
        });

        // زر فتح الكنز
        document.getElementById('btn-check-final').addEventListener('click', () => {
            this.checkFinalAnswer();
        });

        // إدخال الأرقام النهائية
        document.querySelectorAll('.digit-input').forEach((input, index) => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    if (index < 2) {
                        document.querySelectorAll('.digit-input')[index + 1].focus();
                    } else {
                        this.checkFinalAnswer();
                    }
                }
            });

            // الانتقال التلقائي
            input.addEventListener('input', (e) => {
                if (e.target.value.length >= 2 && index < 2) {
                    document.querySelectorAll('.digit-input')[index + 1].focus();
                }
            });
        });

        // زر إعادة اللعب
        document.getElementById('btn-play-again').addEventListener('click', () => {
            this.resetGame();
        });
    },

    // بدء اللعبة
    startGame() {
        const code = document.getElementById('team-code').value.trim().toUpperCase();
        
        if (!code) {
            UI.showError('error-msg', 'الرجاء إدخال كود الفريق');
            return;
        }

        if (!GAME_DATA.teams[code]) {
            UI.showError('error-msg', 'كود الفريق غير صحيح!');
            return;
        }

        this.currentTeam = GAME_DATA.teams[code];
        this.currentStation = 0;
        this.startTime = Date.now();
        this.isLastStation = false;

        // تحديث واجهة المستخدم
        UI.updateTeamName(this.currentTeam.name, this.currentTeam.color);
        UI.updateProgress(0, this.currentTeam.stations.length);
        UI.showScreen('screen-game');
        UI.showRiddle(this.currentTeam.stations[0]);
    },

    // التحقق من الإجابة
    checkAnswer() {
        const userAnswer = document.getElementById('riddle-answer').value.trim();
        const correctAnswer = this.currentTeam.stations[this.currentStation].answer;

        if (!userAnswer) {
            UI.showError('answer-error', 'الرجاء إدخال إجابتك');
            UI.shake('riddle-answer');
            return;
        }

        // مقارنة الإجابة (مرنة)
        if (this.normalizeAnswer(userAnswer) === this.normalizeAnswer(correctAnswer)) {
            UI.showSuccess('answer-success', GAME_DATA.messages.correctAnswer);
            
            // عرض الموقع بعد تأخير قصير
            setTimeout(() => {
                UI.showLocation(this.currentTeam.stations[this.currentStation]);
            }, 1000);
        } else {
            UI.showError('answer-error', GAME_DATA.messages.wrongAnswer);
            UI.shake('riddle-answer');
            document.getElementById('riddle-answer').value = '';
        }
    },

    // التحقق من كود المحطة
    checkStationCode() {
        const userCode = document.getElementById('station-code').value.trim().toUpperCase();
        const correctCode = this.currentTeam.stations[this.currentStation].code;

        if (!userCode) {
            UI.showError('code-error', 'الرجاء إدخال الكود');
            UI.shake('station-code');
            return;
        }

        if (userCode === correctCode) {
            this.currentStation++;
            UI.updateProgress(this.currentStation, this.currentTeam.stations.length);

            // التحقق من الوصول للمحطة الأخيرة
            if (this.currentStation >= this.currentTeam.stations.length) {
                // عرض اللغز النهائي
                setTimeout(() => {
                    UI.showFinalRiddle(GAME_DATA.finalRiddle);
                }, 500);
            } else {
                // عرض المحطة التالية
                setTimeout(() => {
                    UI.showRiddle(this.currentTeam.stations[this.currentStation]);
                }, 500);
            }
        } else {
            UI.showError('code-error', GAME_DATA.messages.wrongCode);
            UI.shake('station-code');
            document.getElementById('station-code').value = '';
        }
    },

    // التحقق من الإجابة النهائية
    checkFinalAnswer() {
        const digit1 = document.getElementById('final-digit-1').value.trim();
        const digit2 = document.getElementById('final-digit-2').value.trim();
        const digit3 = document.getElementById('final-digit-3').value.trim();
        const userAnswers = [digit1, digit2, digit3];
        const correctAnswers = GAME_DATA.finalRiddle.answers;

        // التحقق من ملء جميع الخانات
        if (!digit1 || !digit2 || !digit3) {
            UI.showError('final-error', 'الرجاء إدخال جميع الأرقام');
            return;
        }

        // مقارنة الإجابات
        let isCorrect = true;
        for (let i = 0; i < 3; i++) {
            if (userAnswers[i] !== correctAnswers[i]) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) {
            // حساب وقت الإنجاز
            const endTime = Date.now();
            const timeDiff = endTime - this.startTime;
            const minutes = Math.floor(timeDiff / 60000);
            const seconds = Math.floor((timeDiff % 60000) / 1000);
            const timeString = `${minutes} دقيقة و ${seconds} ثانية`;

            // عرض شاشة الفوز
            UI.celebrate();
            setTimeout(() => {
                UI.toggleElement('final-riddle-screen', false);
                UI.showWinScreen(
                    this.currentTeam.name,
                    GAME_DATA.finalRiddle.treasureLocation,
                    timeString
                );
            }, 1500);
        } else {
            UI.showError('final-error', GAME_DATA.messages.finalWrong);
            UI.shake('final-digit-1');
            document.getElementById('final-digit-1').value = '';
            document.getElementById('final-digit-2').value = '';
            document.getElementById('final-digit-3').value = '';
            document.getElementById('final-digit-1').focus();
        }
    },

    // تطبيع الإجابة للمقارنة
    normalizeAnswer(answer) {
        return answer
            .trim()
            .replace(/[\s]+/g, '') // إزالة المسافات
            .toLowerCase(); // تحويل لأحرف صغيرة
    },

    // إعادة تعيين اللعبة
    resetGame() {
        this.currentTeam = null;
        this.currentStation = 0;
        this.startTime = null;
        this.isLastStation = false;
        
        document.getElementById('team-code').value = '';
        document.getElementById('error-msg').classList.remove('show');
        
        UI.showScreen('screen-start');
    }
};

// بدء التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
