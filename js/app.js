// المنطق الرئيسي للعبة
const Game = {
    // حالة اللعبة
    currentTeam: null,
    currentTeamCode: null,
    currentStation: 0,
    startTime: null,
    isLastStation: false,

    // الكود السري
    ADMIN_SECRET_CODE: "ADMIN5050",

    // بيانات الفرق
    TEAMS_DATA: {
        "KING1": { name: "الفريق الأصفر", color: "#FFD700" },
        "BLUE2": { name: "الفريق الأزرق", color: "#4169E1" },
        "RED3": { name: "الفريق الأحمر", color: "#DC143C" },
        "GREEN4": { name: "الفريق الأخضر", color: "#32CD32" },
        "STAR5": { name: "فريق النجم", color: "#9370DB" }
    },

    // تهيئة اللعبة
    init() {
        this.bindEvents();
        this.checkGameStatus();
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

        // زر تم الكنز
        document.getElementById('btn-capture-treasure').addEventListener('click', () => {
            this.captureTreasure();
        });

        // زر الخروج من شاشة انتهاء اللعبة
        document.getElementById('btn-exit-gameover').addEventListener('click', () => {
            UI.showScreen('screen-start');
            document.getElementById('team-code').value = '';
            document.getElementById('game-over-screen').classList.add('hidden');
        });

        // أزرار الأدمن
        document.getElementById('btn-reset-game').addEventListener('click', () => {
            this.resetGame();
        });

        document.getElementById('btn-refresh-admin').addEventListener('click', () => {
            this.refreshAdminPanel();
        });

        document.getElementById('btn-exit-admin').addEventListener('click', () => {
            UI.showScreen('screen-start');
            document.getElementById('team-code').value = '';
        });
    },

    // التحقق من حالة اللعبة
    checkGameStatus() {
        const winner = localStorage.getItem('gameWinner');
        if (winner) {
            // هناك فائز - لا نعرض شاشة انتهاء اللعبة تلقائياً
            // بل نترك المستخدم يرى شاشة البداية ويمكنه الدخول بالكود السري
        }
    },

    // بدء اللعبة
    startGame() {
        const code = document.getElementById('team-code').value.trim().toUpperCase();
        
        // التحقق من الكود السري
        if (code === this.ADMIN_SECRET_CODE) {
            UI.showScreen('screen-admin');
            this.refreshAdminPanel();
            return;
        }

        // التحقق من وجود فائز
        const winner = localStorage.getItem('gameWinner');
        if (winner) {
            UI.showGameOver(winner);
            return;
        }

        if (!code) {
            UI.showError('error-msg', 'الرجاء إدخال كود الفريق');
            return;
        }

        if (!GAME_DATA.teams[code]) {
            UI.showError('error-msg', 'كود الفريق غير صحيح!');
            return;
        }

        this.currentTeam = GAME_DATA.teams[code];
        this.currentTeamCode = code;
        this.currentStation = parseInt(localStorage.getItem(`team_${code}_progress`) || '0');
        this.startTime = Date.now();

        // تحديث واجهة المستخدم
        UI.updateTeamName(this.currentTeam.name, this.currentTeam.color);
        UI.updateProgress(this.currentStation, this.currentTeam.stations.length);
        UI.showScreen('screen-game');

        // التحقق من وصل الفريق للغز نهائي
        if (this.currentStation >= this.currentTeam.stations.length) {
            UI.showFinalRiddle(GAME_DATA.finalRiddle);
        } else {
            UI.showRiddle(this.currentTeam.stations[this.currentStation]);
        }
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
            
            // حفظ التقدم
            localStorage.setItem(`team_${this.currentTeamCode}_progress`, this.currentStation);
            
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
        // التحقق من وجود فائز
        const winner = localStorage.getItem('gameWinner');
        if (winner) {
            UI.showError('final-error', 'اللعبة انتهت! هناك فائز بالفعل.');
            return;
        }

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
            // عرض شاشة الفوز مع زر الكنز
            UI.showCaptureScreen(this.currentTeam.name);
        } else {
            UI.showError('final-error', GAME_DATA.messages.finalWrong);
            UI.shake('final-digit-1');
            document.getElementById('final-digit-1').value = '';
            document.getElementById('final-digit-2').value = '';
            document.getElementById('final-digit-3').value = '';
            document.getElementById('final-digit-1').focus();
        }
    },

    // التقاط الكنز
    captureTreasure() {
        // حفظ الفائز
        localStorage.setItem('gameWinner', this.currentTeamCode);
        
        // حساب وقت الإنجاز
        const endTime = Date.now();
        const timeDiff = endTime - this.startTime;
        const minutes = Math.floor(timeDiff / 60000);
        const seconds = Math.floor((timeDiff % 60000) / 1000);
        const timeString = `${minutes} دقيقة و ${seconds} ثانية`;

        // عرض شاشة الفوز
        UI.celebrate();
        setTimeout(() => {
            UI.showWinScreen(
                this.currentTeam.name,
                GAME_DATA.finalRiddle.treasureLocation,
                timeString
            );
        }, 1500);
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
        if (confirm('هل أنت متأكد من إعادة تعيين اللعبة؟ سيتم مسح جميع التقدم.')) {
            localStorage.removeItem('gameWinner');
            Object.keys(this.TEAMS_DATA).forEach(code => {
                localStorage.removeItem(`team_${code}_progress`);
            });
            this.currentTeam = null;
            this.currentTeamCode = null;
            this.currentStation = 0;
            this.startTime = null;
            this.isLastStation = false;
            
            document.getElementById('team-code').value = '';
            document.getElementById('error-msg').classList.remove('show');
            
            UI.showScreen('screen-start');
        }
    },

    // تحديث لوحة الأدمن
    refreshAdminPanel() {
        this.updateGameStatus();
        this.updateTeamsCards();
        this.updateAnswersSection();
    },

    // تحديث حالة اللعبة
    updateGameStatus() {
        const winner = localStorage.getItem('gameWinner');
        const statusEl = document.getElementById('game-status');
        const statusText = document.getElementById('status-text');
        const winnerDisplay = document.getElementById('winner-display');

        if (winner) {
            statusEl.classList.add('admin-winner');
            statusText.textContent = '🏆 اللعبة انتهت!';
            winnerDisplay.style.display = 'block';
            winnerDisplay.textContent = this.TEAMS_DATA[winner]?.name || winner;
        } else {
            statusEl.classList.remove('admin-winner');
            statusText.textContent = 'اللعبة جارية...';
            winnerDisplay.style.display = 'none';
        }
    },

    // تحديث بطاقات الفرق
    updateTeamsCards() {
        const grid = document.getElementById('teams-grid');
        const winner = localStorage.getItem('gameWinner');
        grid.innerHTML = '';

        Object.keys(this.TEAMS_DATA).forEach(teamCode => {
            const team = this.TEAMS_DATA[teamCode];
            const progress = parseInt(localStorage.getItem(`team_${teamCode}_progress`) || '0');
            const isWinner = winner === teamCode;
            
            const percentage = (progress / 5) * 100;
            const stationText = progress >= 5 ? 'اللغز النهائي' : `المحطة ${progress + 1} من 5`;

            const card = document.createElement('div');
            card.className = `admin-team-card ${isWinner ? 'admin-winner' : ''}`;
            card.innerHTML = `
                <div class="admin-team-header" style="border-color: ${team.color}">
                    <span class="admin-team-name" style="color: ${team.color}">${team.name}</span>
                    <span class="admin-team-code">${teamCode}</span>
                </div>
                <div class="admin-team-progress">
                    <div class="admin-progress-bar">
                        <div class="admin-progress-fill ${isWinner ? 'admin-winner' : ''}" style="width: ${percentage}%"></div>
                    </div>
                    <div class="admin-station-info">
                        <span class="admin-current-station">${stationText}</span>
                        <span>${isWinner ? '🏆 فائز!' : `${progress}/5`}</span>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    },

    // تحديث قسم الإجابات
    updateAnswersSection() {
        const content = document.getElementById('answers-content');
        content.innerHTML = '';

        Object.keys(GAME_DATA.teams).forEach(teamCode => {
            const team = this.TEAMS_DATA[teamCode];
            const stations = GAME_DATA.teams[teamCode].stations;

            const teamDiv = document.createElement('div');
            teamDiv.className = 'admin-team-answers';
            teamDiv.innerHTML = `
                <h3 style="color: ${team.color}">${team.name} (${teamCode})</h3>
                <table class="admin-answers-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>اللغز</th>
                            <th>الإجابة</th>
                            <th>المكان</th>
                            <th>الكود</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${stations.map((s, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${s.riddle}</td>
                                <td><strong>${s.answer}</strong></td>
                                <td>${s.location}</td>
                                <td class="admin-answer-code">${s.code}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            content.appendChild(teamDiv);
        });
    }
};

// بدء التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
