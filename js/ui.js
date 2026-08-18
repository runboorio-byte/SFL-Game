// واجهة المستخدم - دوال مساعدة
const UI = {
    // عرض رسالة خطأ
    showError(elementId, message) {
        const el = document.getElementById(elementId);
        el.textContent = message;
        el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 3000);
    },

    // عرض رسالة نجاح
    showSuccess(elementId, message) {
        const el = document.getElementById(elementId);
        el.textContent = message;
        el.classList.add('show');
    },

    // إخفاء رسالة
    hideMessage(elementId) {
        const el = document.getElementById(elementId);
        el.classList.remove('show');
    },

    // إظهار شاشة
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
    },

    // إظهار/إخفاء عنصر
    toggleElement(elementId, show) {
        const el = document.getElementById(elementId);
        if (show) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    },

    // تحديث شريط التقدم
    updateProgress(currentStation, totalStations) {
        const fill = document.getElementById('progress-fill');
        const percentage = (currentStation / totalStations) * 100;
        fill.style.width = percentage + '%';

        // تحديث النقاط
        document.querySelectorAll('.dot').forEach((dot, index) => {
            if (index < currentStation) {
                dot.classList.add('completed');
                dot.classList.remove('active');
            } else if (index === currentStation) {
                dot.classList.add('active');
                dot.classList.remove('completed');
            } else {
                dot.classList.remove('active', 'completed');
            }
        });

        // تحديث عداد المحطة
        document.getElementById('station-counter').textContent = 
            `المحطة ${currentStation} من ${totalStations}`;
    },

    // عرض اللغز
    showRiddle(stationData) {
        document.getElementById('riddle-text').textContent = stationData.riddle;
        document.getElementById('station-number').textContent = 
            document.querySelectorAll('.dot.active').length;
        document.getElementById('riddle-answer').value = '';
        this.toggleElement('riddle-card', true);
        this.toggleElement('location-card', false);
        this.toggleElement('final-riddle-screen', false);
    },

    // عرض الموقع
    showLocation(locationData) {
        document.getElementById('location-name').textContent = locationData.location;
        document.getElementById('station-code').value = '';
        this.toggleElement('riddle-card', false);
        this.toggleElement('location-card', true);
        this.toggleElement('final-riddle-screen', false);
    },

    // عرض شاشة الفوز
    showWinScreen(teamName, treasureLocation, time) {
        document.getElementById('win-team-name').textContent = teamName;
        document.getElementById('treasure-place').textContent = treasureLocation;
        document.getElementById('completion-time').textContent = time;
        this.toggleElement('riddle-card', false);
        this.toggleElement('location-card', false);
        this.toggleElement('final-riddle-screen', false);
        this.toggleElement('screen-win', false);
        document.getElementById('screen-win').classList.remove('hidden');
    },

    // عرض اللغز النهائي
    showFinalRiddle(riddleData) {
        document.getElementById('final-riddle-text').textContent = riddleData.text;
        this.toggleElement('riddle-card', false);
        this.toggleElement('location-card', false);
        this.toggleElement('final-riddle-screen', true);
        document.getElementById('final-digit-1').value = '';
        document.getElementById('final-digit-2').value = '';
        document.getElementById('final-digit-3').value = '';
        document.getElementById('final-digit-1').focus();
    },

    // تحديث اسم الفريق
    updateTeamName(teamName, teamColor) {
        const el = document.getElementById('team-name-display');
        el.textContent = teamName;
        el.style.color = teamColor;
    },

    // تأثيرات الاحتفال
    celebrate() {
        const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 4000);
            }, i * 50);
        }
    },

    // تأثير الاهتزاز عند الخطأ
    shake(elementId) {
        const el = document.getElementById(elementId);
        el.style.animation = 'none';
        setTimeout(() => {
            el.style.animation = 'shake 0.5s ease';
        }, 10);
    }
};
