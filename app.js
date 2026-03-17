// التطبيق الرئيسي
let points = parseInt(localStorage.getItem('points')) || 0;
let user = null;

// تهيئة Pi SDK
if (typeof Pi !== 'undefined') {
    Pi.init({ version: "2.0", sandbox: true });
}

// تبديل الصفحات
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// تسجيل الدخول
async function login() {
    try {
        const auth = await Pi.authenticate(['username'], () => {});
        user = auth.user;
        document.getElementById('username').textContent = user.username;
        document.getElementById('user-info').style.display = 'block';
        updatePoints();
        alert('✅ مرحباً ' + user.username);
    } catch (error) {
        alert('❌ فشل تسجيل الدخول: ' + error.message);
    }
}

// إضافة نقاط
function addPoints(amount) {
    points += amount;
    localStorage.setItem('points', points);
    updatePoints();
}

// تحديث عرض النقاط
function updatePoints() {
    document.getElementById('points').textContent = points;
    document.getElementById('balance').textContent = points;
    updateLevel();
}

// نظام المستويات
function updateLevel() {
    const level = Math.floor(points / 100) + 1;
    document.getElementById('level').textContent = level;
    const progress = (points % 100);
    document.getElementById('level-progress').style.width = progress + '%';
}

// تصدير الدوال للاستخدام العام
window.showPage = showPage;
window.login = login;
window.addPoints = addPoints;