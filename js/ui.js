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

    // تأثيرات الاحتفال - جسيمات متطايرة
    celebrate() {
        const colors = ['#00ff88', '#ffd700', '#ff3366', '#3366ff', '#9933ff'];
        const shapes = ['circle', 'square', 'triangle'];
        
        for (let i = 0; i < 80; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + 'vw';
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
                particle.style.animationDelay = (Math.random() * 0.5) + 's';
                
                // أشكال متنوعة
                const shape = shapes[Math.floor(Math.random() * shapes.length)];
                if (shape === 'circle') {
                    particle.style.borderRadius = '50%';
                    particle.style.width = (Math.random() * 8 + 4) + 'px';
                    particle.style.height = particle.style.width;
                } else if (shape === 'square') {
                    particle.style.width = (Math.random() * 8 + 4) + 'px';
                    particle.style.height = particle.style.width;
                } else {
                    particle.style.width = '0';
                    particle.style.height = '0';
                    particle.style.borderLeft = '5px solid transparent';
                    particle.style.borderRight = '5px solid transparent';
                    particle.style.borderBottom = '10px solid ' + particle.style.background;
                    particle.style.background = 'transparent';
                }
                
                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 5000);
            }, i * 30);
        }
    },

    // تأثير الاهتزاز عند الخطأ
    shake(elementId) {
        const el = document.getElementById(elementId);
        el.style.animation = 'none';
        setTimeout(() => {
            el.style.animation = 'shake 0.5s ease';
        }, 10);
    },

    // تأثير نبض البطاقة
    pulseCard() {
        const card = document.querySelector('.riddle-card');
        if (card) {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'cardPulse 2s ease-in-out';
            }, 10);
        }
    },

    // تأثير ظهور تدريجي
    fadeIn(elementId) {
        const el = document.getElementById(elementId);
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.classList.remove('hidden');
        
        setTimeout(() => {
            el.style.transition = 'all 0.4s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 50);
    },

    // تأثير اختفاء
    fadeOut(elementId) {
        const el = document.getElementById(elementId);
        el.style.transition = 'all 0.3s ease';
        el.style.opacity = '0';
        el.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            el.classList.add('hidden');
        }, 300);
    }
};
