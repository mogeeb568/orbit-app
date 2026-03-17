// إنشاء كود إحالة عشوائي
const refCode = 'ORBIT-' + Math.random().toString(36).substring(2, 8).toUpperCase();

// عرض كود الإحالة
document.addEventListener('DOMContentLoaded', () => {
    const refElement = document.getElementById('ref-code');
    if (refElement) {
        refElement.textContent = refCode;
    }
});

// نسخ كود الإحالة
function copyRefCode() {
    navigator.clipboard.writeText(refCode).then(() => {
        alert('✅ تم نسخ الكود');
    }).catch(() => {
        alert('📋 الكود: ' + refCode);
    });
}

window.copyRefCode = copyRefCode;