// المهام
const tasks = [
    { name: "تسجيل الدخول اليومي", points: 5 },
    { name: "إكمال 3 مهام", points: 10 },
    { name: "دعوة صديق", points: 15 },
    { name: "مشاركة التطبيق", points: 5 },
    { name: "تسجيل الدخول بـ Pi", points: 20 }
];

// عرض المهام
function loadTasks() {
    const list = document.getElementById('task-list');
    if (!list) return;
    
    list.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `${task.name} <span style="color:#ffd700;">+${task.points}</span>`;
        li.onclick = () => {
            if (window.addPoints) {
                window.addPoints(task.points);
                alert(`✅ +${task.points} نقطة`);
            }
        };
        list.appendChild(li);
    });
}

// تحميل المهام
document.addEventListener('DOMContentLoaded', loadTasks);