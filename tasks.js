const tasks = [
    { id: 1, name: "تسجيل الدخول اليومي", points: 5 },
    { id: 2, name: "فتح لوحة التحكم", points: 5 },
    { id: 3, name: "دعوة صديق", points: 10 },
    { id: 4, name: "مشاركة التطبيق", points: 5 },
    { id: 5, name: "إكمال الملف الشخصي", points: 10 }
];

// عرض المهام
function loadTasks() {
    const list = document.getElementById('task-list');
    if (!list) return;
    
    list.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `${task.name} <span style="color:#ffd700;">+${task.points}</span>`;
        li.onclick = () => completeTask(task);
        list.appendChild(li);
    });
}

// إكمال مهمة
function completeTask(task) {
    addPoints(task.points);
    alert(`✅ أكملت المهمة: ${task.name}\nحصلت على +${task.points} نقطة`);
}

// تحميل المهام عند فتح الصفحة
document.addEventListener('DOMContentLoaded', loadTasks);