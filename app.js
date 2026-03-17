// ========== ملف app.js النهائي والمبسط ==========
let points = parseInt(localStorage.getItem('points')) || 0;
let user = null;

// تهيئة Pi SDK
if (typeof Pi !== 'undefined') {
    Pi.init({ 
        version: "2.0", 
        sandbox: true,
        apiKey: "ohrbeexmlhogtkfn2yuw2o8znsdyrwxuexzgbeuimzeojuhqipzogzdpjmvn0zbr"
    });
    console.log('✅ Pi SDK initialized');
}

// دوال التنقل
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// دالة تسجيل الدخول
async function loginWithPi() {
    try {
        console.log("تسجيل الدخول...");
        
        if (typeof Pi === 'undefined') {
            alert('❌ Pi SDK غير متوفر');
            return;
        }

        const auth = await Pi.authenticate(['username'], () => {});
        
        user = auth.user;
        document.getElementById('user-info').style.display = 'block';
        document.getElementById('username').textContent = user.username;
        
        document.getElementById('points').textContent = points;
        document.getElementById('balance').textContent = points;
        
        alert('✅ مرحباً ' + user.username);

    } catch (error) {
        console.error('خطأ:', error);
        alert('❌ خطأ: ' + error.message);
    }
}

// دوال النقاط
function addPoints(amount) {
    points += amount;
    localStorage.setItem('points', points);
    document.getElementById('points').textContent = points;
    document.getElementById('balance').textContent = points;
    updateLevel();
}

function updateLevel() {
    const level = Math.floor(points / 100) + 1;
    document.getElementById('level').textContent = level;
    document.getElementById('level-progress').style.width = (points % 100) + '%';
}

// دالة الدفع
async function makeTestPayment() {
    try {
        console.log("بدء الدفع...");
        
        if (!user) {
            alert('❌ سجل الدخول أولاً');
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
            onCancel: () => alert('❌ تم الإلغاء'),
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

// دوال بسيطة للسحب
function withdrawPoints() {
    if (points <= 0) alert('❌ لا يوجد نقاط');
    else alert('💰 تم إرسال طلب السحب');
}

// نسخ كود الإحالة
function copyRefCode() {
    const code = document.getElementById('ref-code')?.textContent || 'ORBIT-XXXX';
    navigator.clipboard.writeText(code).then(() => alert('✅ تم النسخ'));
}

// تصدير الدوال
window.showPage = showPage;
window.loginWithPi = loginWithPi;
window.addPoints = addPoints;
window.withdrawPoints = withdrawPoints;
window.makeTestPayment = makeTestPayment;
window.copyRefCode = copyRefCode;