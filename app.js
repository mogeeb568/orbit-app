// ========== ملف app.js المُحسّن والنهائي ==========
// ========== المتغيرات العامة ==========
let points = parseInt(localStorage.getItem('points')) || 0;
let user = null;

// ========== تهيئة Pi SDK ==========
function initPi() {
    if (typeof Pi !== 'undefined') {
        Pi.init({
            version: "2.0",
            sandbox: true,
            apiKey: "ohrbeexmlhogtkfn2yuw2o8znsdyrwxuexzgbeuimzeojuhqipzogzdpjmvn0zbr"
        });
        console.log('✅ Pi SDK initialized');
    } else {
        console.warn('⚠️ Pi SDK not loaded. Make sure script is included.');
    }
}

// تشغيل التهيئة عند تحميل الصفحة
initPi();

// ========== دوال التنقل ==========
window.showPage = function(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    console.log('Navigated to:', pageId);
};

// ========== دوال تسجيل الدخول ==========
window.loginWithPi = async function() {
    try {
        console.log("محاولة تسجيل الدخول...");
        if (typeof Pi === 'undefined') {
            alert('❌ Pi SDK غير متوفر. تأكد من اتصالك بالإنترنت.');
            return;
        }

        initPi(); // تأكد من التهيئة

        const auth = await Pi.authenticate(['username'], function(payment) {
            console.log('Payment ready:', payment);
        });

        user = auth.user;
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('username').textContent = user.username;

        window.updatePointsDisplay(); // تحديث العرض بعد تسجيل الدخول
        alert('✅ مرحباً ' + user.username);
    } catch (error) {
        console.error('Login error:', error);
        alert('❌ خطأ في تسجيل الدخول: ' + error.message);
    }
};

// ========== دوال النقاط ==========
window.addPoints = function(amount) {
    points += amount;
    localStorage.setItem('points', points);
    window.updatePointsDisplay();
    window.updateLevel();
    console.log(`✅ +${amount} نقطة`);
};

window.updatePointsDisplay = function() {
    const pointsEl = document.getElementById('points');
    const balanceEl = document.getElementById('balance');
    if (pointsEl) pointsEl.textContent = points;
    if (balanceEl) balanceEl.textContent = points;
};

// ========== دوال المهام ==========
const tasks = [
    { id: 1, name: "تسجيل الدخول اليومي", points: 5 },
    { id: 2, name: "إكمال 3 مهام", points: 10 },
    { id: 3, name: "دعوة صديق", points: 15 },
    { id: 4, name: "مشاركة التطبيق", points: 5 },
    { id: 5, name: "تسجيل الدخول بـ Pi", points: 20 }
];

window.loadTasks = function() {
    const taskList = document.getElementById('task-list');
    if (!taskList) return;

    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task.name}</span>
            <span class="task-points">+${task.points}</span>
        `;
        li.onclick = () => window.completeTask(task);
        taskList.appendChild(li);
    });
};

window.completeTask = function(task) {
    window.addPoints(task.points);
};

// ========== دوال المستويات ==========
window.updateLevel = function() {
    const level = Math.floor(points / 100) + 1;
    const progress = (points % 100);
    const levelEl = document.getElementById('level');
    const nextLevelEl = document.getElementById('next-level');
    const progressEl = document.getElementById('level-progress');

    if (levelEl) levelEl.textContent = level;
    if (nextLevelEl) nextLevelEl.textContent = level + 1;
    if (progressEl) progressEl.style.width = progress + '%';
};

// ========== دوال الإحالة ==========
function generateRefCode() {
    const code = 'ORBIT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.setItem('refCode', code);
    return code;
}

window.copyRefCode = function() {
    navigator.clipboard.writeText(refCode).then(() => {
        alert('✅ تم نسخ الكود');
    }).catch(() => {
        alert('📋 الكود: ' + refCode);
    });
};

let refCode = localStorage.getItem('refCode') || generateRefCode();

// ========== دوال المحفظة ==========
window.withdrawPoints = function() {
    if (points <= 0) {
        alert('❌ لا يوجد نقاط للسحب');
        return;
    }
    if (confirm(`هل تريد سحب ${points} نقطة؟`)) {
        alert('💰 تم إرسال طلب السحب. سيتم مراجعته قريباً.');
    }
};

// ========== دالة الدفع التجريبي (الأهم) ==========
window.makeTestPayment = async function() {
    try {
        console.log("بدء عملية الدفع...");

        if (typeof Pi === 'undefined') {
            alert('❌ Pi SDK غير متوفر.');
            return;
        }

        if (!user) {
            alert('❌ يجب تسجيل الدخول أولاً.');
            return;
        }

        if (typeof Pi.createPayment !== 'function') {
            alert('❌ نظام الدفع غير متاح. تأكد من إعداد API Key.');
            return;
        }

        const paymentData = {
            amount: 0.1,
            memo: "معاملة تجريبية من Orbit App",
            metadata: { user: user.username }
        };

        console.log("بيانات الدفع:", paymentData);

        const payment = await Pi.createPayment(paymentData, {
            onReadyForServerApproval: (paymentId) => {
                console.log('✅ جاهز للموافقة:', paymentId);
                alert('⏳ جاري الموافقة على الدفع...');
            },
            onReadyForServerCompletion: (paymentId, txid) => {
                console.log('✅ تم الإكمال:', paymentId, txid);
                alert('🎉 تم الدفع التجريبي بنجاح!');
                window.addPoints(20);
            },
            onCancel: (paymentId) => {
                console.log('❌ تم الإلغاء:', paymentId);
                alert('❌ تم إلغاء الدفع');
            },
            onError: (error, paymentId) => {
                console.error('❌ خطأ في الدفع:', error, 'Payment ID:', paymentId);
                alert('❌ فشل الدفع: ' + (error.message || 'خطأ غير معروف'));
            }
        });

        console.log("تم إنشاء الدفع:", payment);

    } catch (error) {
        console.error('❌ خطأ كبير في دالة الدفع:', error);
        alert('❌ حدث خطأ غير متوقع: ' + error.message);
    }
};

// ========== تهيئة الصفحة عند التحميل ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ التطبيق بدأ');
    window.updatePointsDisplay();
    window.loadTasks();
    window.updateLevel();
    const refElement = document.getElementById('ref-code');
    if (refElement) refElement.textContent = refCode;
});