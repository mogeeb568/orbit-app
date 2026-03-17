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

// تهيئة عند تحميل الصفحة
initPi();

// ========== دوال التنقل ==========
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// ========== دوال تسجيل الدخول ==========
async function loginWithPi() {
    try {
        if (typeof Pi === 'undefined') {
            alert('❌ Pi SDK غير متوفر. تأكد من اتصالك بالإنترنت.');
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

// ========== دوال النقاط ==========
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

// ========== دوال المهام ==========
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

// ========== دوال المستويات ==========
function updateLevel() {
    const level = Math.floor(points / 100) + 1;
    const progress = (points % 100);
    
    document.getElementById('level').textContent = level;
    document.getElementById('next-level').textContent = level + 1;
    document.getElementById('level-progress').style.width = progress + '%';
}

// ========== دوال الإحالة ==========
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

// ========== دوال المحفظة ==========
function withdrawPoints() {
    if (points <= 0) {
        alert('❌ لا يوجد نقاط للسحب');
        return;
    }
    if (confirm(`هل تريد سحب ${points} نقطة؟`)) {
        alert('💰 تم إرسال طلب السحب. سيتم مراجعته قريباً.');
    }
}

// ========== دالة الدفع التجريبي (الأهم) ==========
async function makeTestPayment() {
    try {
        console.log("بدء عملية الدفع...");
        
        // التحقق من وجود Pi SDK
        if (typeof Pi === 'undefined') {
            alert('❌ Pi SDK غير متوفر. تأكد من اتصالك بالإنترنت.');
            return;
        }

        // التحقق من تسجيل الدخول
        if (!user) {
            alert('❌ يجب تسجيل الدخول أولاً. اضغط على "تسجيل الدخول بـ Pi"');
            return;
        }

        // التحقق من وجود دالة createPayment
        if (typeof Pi.createPayment !== 'function') {
            alert('❌ نظام الدفع غير متاح حالياً. تأكد من إعداد API Key بشكل صحيح.');
            return;
        }

        // بيانات الدفع
        const paymentData = {
            amount: 0.1,
            memo: "معاملة تجريبية من Orbit App",
            metadata: { 
                app: "Orbit ULTRA PRO MAX",
                user: user.username,
                test: true 
            }
        };

        console.log("بيانات الدفع:", paymentData);

        // إنشاء عملية الدفع
        const payment = await Pi.createPayment(paymentData, {
            onReadyForServerApproval: (paymentId) => {
                console.log('✅ جاهز للموافقة - Payment ID:', paymentId);
                alert('⏳ جاري الموافقة على الدفع...');
            },
            
            onReadyForServerCompletion: (paymentId, txid) => {
                console.log('✅ تم الإكمال - Payment ID:', paymentId, 'TXID:', txid);
                alert('🎉 تم الدفع التجريبي بنجاح! شكراً لك.');
                
                // مكافأة المستخدم بنقاط إضافية
                addPoints(20);
            },
            
            onCancel: (paymentId) => {
                console.log('❌ تم الإلغاء - Payment ID:', paymentId);
                alert('❌ تم إلغاء عملية الدفع');
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
}

// ========== التهيئة عند تحميل الصفحة ==========
window.onload = function() {
    console.log('✅ التطبيق بدأ');
    updatePointsDisplay();
    loadTasks();
    updateLevel();
    document.getElementById('ref-code').textContent = refCode;
};

// ========== تصدير الدوال للاستخدام العام ==========
window.showPage = showPage;
window.loginWithPi = loginWithPi;
window.withdrawPoints = withdrawPoints;
window.copyRefCode = copyRefCode;
window.makeTestPayment = makeTestPayment;
window.addPoints = addPoints;