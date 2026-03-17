// ========== ملف app.js النهائي والمضمون ==========

// المتغيرات العامة
let points = parseInt(localStorage.getItem('points')) || 0;
let user = null;

// تهيئة Pi SDK
function initPi() {
    if (typeof Pi !== 'undefined') {
        Pi.init({ 
            version: "2.0", 
            sandbox: true,
            apiKey: "ohrbeexmlhogtkfn2yuw2o8znsdyrwxuexzgbeuimzeojuhqipzogzdpjmvn0zbr"
        });
        console.log('✅ Pi SDK initialized');
    } else {
        console.warn('⚠️ Pi SDK not loaded');
    }
}

// تشغيل التهيئة
initPi();

// دوال التنقل
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// دالة تسجيل الدخول
async function loginWithPi() {
    try {
        console.log("محاولة تسجيل الدخول...");
        
        if (typeof Pi === 'undefined') {
            alert('❌ Pi SDK غير متوفر');
            return;
        }

        initPi();
        
        const auth = await Pi.authenticate(['username'], () => {});
        
        user = auth.user;
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('username').textContent = user.username;
        
        updatePointsDisplay();
        alert('✅ مرحباً ' + user.username);

    } catch (error) {
        console.error('Login error:', error);
        alert('❌ خطأ: ' + error.message);
    }
}

// دوال النقاط
function addPoints(amount) {
    points += amount;
    localStorage.setItem('points', points);
    updatePointsDisplay();
    updateLevel();
}

function updatePointsDisplay() {
    document.getElementById('points').textContent = points;
    document.getElementById('balance').textContent = points;
}

// دوال المستويات
function updateLevel() {
    const level = Math.floor(points / 100) + 1;
    const progress = points % 100;
    document.getElementById('level').textContent = level;
    document.getElementById('level-progress').style.width = progress + '%';
}

// دالة السحب
function withdrawPoints() {
    if (points <= 0) {
        alert('❌ لا يوجد نقاط');
        return;
    }
    alert('💰 تم إرسال طلب السحب');
}

// دالة الدفع التجريبي (مبسطة)
async function makeTestPayment() {
    try {
        console.log("بدء الدفع...");
        
        if (!user) {
            alert('❌ سجل الدخول أولاً');
            return;
        }

        if (typeof Pi.createPayment !== 'function') {
            alert('❌ نظام الدفع غير متاح');
            return;
        }

        const paymentData = {
            amount: 0.1,
            memo: "دفع تجريبي",
            metadata: { user: user.username }
        };

        await Pi.createPayment(paymentData, {
            onReadyForServerApproval: (paymentId) => {
                console.log('Payment ID:', paymentId);
                alert('⏳ جاري الموافقة...');
            },
            onReadyForServerCompletion: (paymentId, txid) => {
                console.log('Success:', paymentId, txid);
                alert('🎉 تم الدفع بنجاح!');
                addPoints(20);
            },
            onCancel: () => {
                alert('❌ تم الإلغاء');
            },
            onError: (error) => {
                console.error('Error:', error);
                alert('❌ فشل الدفع');
            }
        });

    } catch (error) {
        console.error('Payment error:', error);
        alert('❌ خطأ: ' + error.message);
    }
}

// تصدير الدوال
window.showPage = showPage;
window.loginWithPi = loginWithPi;
window.withdrawPoints = withdrawPoints;
window.makeTestPayment = makeTestPayment;
window.addPoints = addPoints;