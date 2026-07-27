document.addEventListener('DOMContentLoaded', () => {
    const startDateInput = document.getElementById('dapt-start-date');
    if (startDateInput) {
        // ตั้งค่าวันเริ่มต้นเป็นวันนี้
        const today = new Date().toISOString().split('T')[0];
        startDateInput.value = today;
        
        startDateInput.addEventListener('change', calculateDAPT);
        calculateDAPT(); // คำนวณทันทีเมื่อโหลดหน้า
    }
});

// ฟังก์ชันช่วยบวกจำนวนวัน
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// ฟังก์ชันแปลง Date Object เป็นข้อความ "[ชื่อวัน] DD/MM/YYYY" ภาษาไทย
function formatDateTH(dateObj) {
    const dayNames = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
    const dayName = dayNames[dateObj.getDay()];
    
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear() + 543; // แปลงเป็น พ.ศ.

    return `<span class="font-bold text-slate-700">${dayName}</span> <span class="font-extrabold text-blue-700">${day}/${month}/${year}</span>`;
}

function calculateDAPT() {
    const inputVal = document.getElementById('dapt-start-date').value;
    if (!inputVal) return;

    const dateA = new Date(inputVal);

    // Phase 1: ASA + Clopidogrel (21 วัน) -> A ถึง A+20
    const p1Start = dateA;
    const p1End = addDays(dateA, 20);

    // Phase 2: Clopidogrel เดี่ยว (90 วัน) -> A+21 ถึง A+110
    const p2Start = addDays(dateA, 21);
    const p2End = addDays(dateA, 110);

    // Phase 3: ASA เดี่ยว (ตลอดชีวิต) -> A+111 เป็นต้นไป
    const p3Start = addDays(dateA, 111);

    // Render ผลลัพธ์
    document.getElementById('dapt-p1-res').innerHTML = `${formatDateTH(p1Start)} <span class="text-slate-400 font-bold mx-1">ถึง</span> ${formatDateTH(p1End)}`;
    document.getElementById('dapt-p2-res').innerHTML = `${formatDateTH(p2Start)} <span class="text-slate-400 font-bold mx-1">ถึง</span> ${formatDateTH(p2End)}`;
    document.getElementById('dapt-p3-res').innerHTML = `${formatDateTH(p3Start)} <span class="text-emerald-600 font-black ml-1">เป็นต้นไป</span>`;
}

function resetDAPTForm() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dapt-start-date').value = today;
    calculateDAPT();
}
