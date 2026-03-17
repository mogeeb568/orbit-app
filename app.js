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
        console.log('⚠️ Pi SDK not loaded');
    }
}

initPi();

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

async function loginWithPi() {
    try {
        console.log("محاولة تسجيل الدخول...");
        
        if (typeof Pi === 'undefined') {
            alert('❌ Pi SDK غير متوفر.');
            return;
        }

        initPi();
        
        const auth = await Pi.authenticate(['username'], function(payment) {
            console.log('Payment ready:', payment);
        });

        user = auth.user;
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('username').textContent = user.username;
        
        updatePointsDisplay();
        alert('✅ مرحباً ' + user.username);

    } catch (error) {
        console.error('Login error:', error);
        alert('❌ خطأ في تسجيل الدخول: ' + error.message);
    }
}

function addPoints(amount) {
    points += amount;
    localStorage.setItem('points', points);
    updatePointsDisplay();
    updateLevel();
    console.log(`✅ +${amount} نقطة`);
}

function updatePointsDisplay() {
    document.getElementById('points').textContent = points;
    document.getElementById('balance').textContent = points;
}

const tasks = [
    { id: 1, name: "تسجيل الدخول اليومي", points: 5 },
    { id: 2, name: "إكمال 3 مهام", points: 10 },
    { id: 3, name: "دعوة صديق", points: 15 },
    { id: 4, name: "مشاركة التطبيق", points: 5 },
    { id: 5, name: "تسجيل الدخول بـ Pi", points: 20 }
];

function loadTasks() {
    const taskList = document.getElementById('task-list');
    if (!taskList) return;

    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task.name}</span>
            <span class="task-points">+${task.points}</span>
        `;
        li.onclick = () => completeTask(task);
        taskList.appendChild(li);
    });
}

function completeTask(task) {
    addPoints(task.points);
}

function updateLevel() {
    const level = Math.floor(points / 100) + 1;
    const progress = (points % 100);
    
    document.getElementById('level').textContent = level;
    document.getElementById('next-level').textContent = level + 1;
    document.getElementById('level-progress').style.width = progress + '%';
}

function generateRefCode() {
    const code = 'ORBIT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.setItem('refCode', code);
    return code;
}

function copyRefCode() {
    navigator.clipboard.writeText(refCode).then(() => {
        alert('✅ تم نسخ الكود');
    }).catch(() => {
        alert('📋 الكود: ' + refCode);
    });
}

let refCode = localStorage.getItem('refCode') || generateRefCode();
document.addEventListener('DOMContentLoaded', () => {
    const refElement = document.getElementById('ref-code');
    if (refElement) refElement.textContent = refCode;
});

function withdrawPoints() {
    if (points <= 0) {
        alert('❌ لا يوجد نقاط للسحب');
        return;
    }
    if (confirm(`هل تريد سحب ${points} نقطة؟`)) {
        alert('💰 تم إرسال طلب السحب.');
    }
}

async function makeTestPayment() {
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
            alert('❌ نظام الدفع غير متاح.');
            return;
        }

        const paymentData = {
            amount: 0.1,
            memo: "معاملة تجريبية",
            metadata: { user: user.username }
        };

        const payment = await Pi.createPayment(paymentData, {
            onReadyForServerApproval: (paymentId) => {
                console.log('✅ جاهز للموافقة:', paymentId);
                alert('⏳ جاري الموافقة...');
            },
            onReadyForServerCompletion: (paymentId, txid) => {
                console.log('✅ تم الدفع:', paymentId, txid);
                alert('🎉 تم الدفع التجريبي بنجاح!');
                addPoints(20);
            },
            onCancel: () => {
                alert('❌ تم إلغاء الدفع');
            },
            onError: (error) => {
                console.error('❌ خطأ في الدفع:', error);
                alert('❌ فشل الدفع');
            }
        });

    } catch (error) {
        console.error('❌ خطأ في الدفع:', error);
        alert('❌ حدث خطأ');
    }
}

window.onload = function() {
    console.log('✅ التطبيق بدأ');
    updatePointsDisplay();
    loadTasks();
    updateLevel();
    document.getElementById('ref-code').textContent = refCode;
};

window.showPage = showPage;
window.loginWithPi = loginWithPi;
window.withdrawPoints = withdrawPoints;
window.copyRefCode = copyRefCode;
window.makeTestPayment = makeTestPayment;
window.addPoints = addPoints;