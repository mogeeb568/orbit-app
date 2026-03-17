// سحب النقاط
function withdraw() {
    const balance = parseInt(document.getElementById('balance').textContent);
    
    if (balance <= 0) {
        alert('❌ رصيدك صفر!');
        return;
    }
    
    if (confirm(`هل تريد سحب ${balance} نقطة؟`)) {
        alert('💰 تم إرسال طلب السحب');
        // هنا نضيف منطق السحب الحقيقي لاحقاً
    }
}

// تصدير الدالة
window.withdraw = withdraw; 