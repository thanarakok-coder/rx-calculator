document.addEventListener('DOMContentLoaded', () => {
    const startDateInput = document.getElementById('dapt-start-date');
    const p1DaysInput = document.getElementById('dapt-p1-days');
    const p2DaysInput = document.getElementById('dapt-p2-days');

    if (startDateInput) {
        // ตั้งค่าวันเริ่มต้นเป็นวันนี้
        const today = new Date().toISOString().split('T')[0];
        startDateInput.value = today;
        
        startDateInput.addEventListener('change', calculateDAPT);
        if (p1DaysInput) p1DaysInput.addEventListener('input', calculateDAPT);
        if (p2DaysInput) p2DaysInput.addEventListener('input', calculateDAPT);

        calculateDAPT(); // คำนวณทันทีเมื่อโหลดหน้า
    }
});

// ฟังก์ชันบวกวัน
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Format วันที่สั้นสำหรับ Text Generator (DD/MM/YYYY)
function formatDateShort(dateObj) {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear() + 543;
    return `${day}/${month}/${year}`;
}

// ชื่อวันแบบเต็ม และตัวย่อ
const DAY_NAMES_FULL = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
const DAY_NAMES_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

// สร้าง UI กล่องวันที่
function createDateCard(dateObj, badgeColorClass) {
    const fullDate = formatDateShort(dateObj);
    const dayName = DAY_NAMES_FULL[dateObj.getDay()];

    return `
        <div class="flex-1 bg-white border-2 border-slate-300 rounded-2xl p-3 shadow-sm text-center flex flex-col justify-center items-center">
            <span class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">${fullDate}</span>
            <span class="text-xs font-bold text-slate-400 mt-0.5">${dayName}</span>
        </div>
    `;
}

function calculateDAPT() {
    const inputVal = document.getElementById('dapt-start-date').value;
    if (!inputVal) return;

    const p1Days = parseInt(document.getElementById('dapt-p1-days').value) || 0;
    const p2Days = parseInt(document.getElementById('dapt-p2-days').value) || 0;

    // อัปเดตข้อความจำนวนวันในการ์ด
    document.getElementById('p1-days-label').innerText = `(${p1Days} วัน)`;
    document.getElementById('p2-days-label').innerText = `(${p2Days} วัน)`;

    const dateA = new Date(inputVal);

    // Phase 1: A ถึง A + (p1Days - 1)
    const p1Start = dateA;
    const p1End = addDays(dateA, Math.max(0, p1Days - 1));

    // Phase 2: A + p1Days ถึง A + p1Days + p2Days - 1
    const p2Start = addDays(dateA, p1Days);
    const p2End = addDays(dateA, Math.max(p1Days, p1Days + p2Days - 1));

    // Phase 3: A + p1Days + p2Days เป็นต้นไป
    const p3Start = addDays(dateA, p1Days + p2Days);

    // Render HTML สำหรับ Display Box
    document.getElementById('dapt-p1-res').innerHTML = `
        <div class="flex items-center space-x-2 md:space-x-4 w-full">
            ${createDateCard(p1Start)}
            <span class="text-sm font-black text-slate-400 uppercase">ถึง</span>
            ${createDateCard(p1End)}
        </div>
    `;

    document.getElementById('dapt-p2-res').innerHTML = `
        <div class="flex items-center space-x-2 md:space-x-4 w-full">
            ${createDateCard(p2Start)}
            <span class="text-sm font-black text-slate-400 uppercase">ถึง</span>
            ${createDateCard(p2End)}
        </div>
    `;

    document.getElementById('dapt-p3-res').innerHTML = `
        <div class="flex items-center space-x-2 md:space-x-4 w-full">
            ${createDateCard(p3Start)}
            <div class="flex-1 bg-emerald-100 border-2 border-emerald-300 rounded-2xl p-3 shadow-sm text-center flex items-center justify-center">
                <span class="text-xl md:text-2xl font-black text-emerald-800">เป็นต้นไป</span>
            </div>
        </div>
    `;

    // Generate Text สำหรับ Copy (ใช้ Fixed-width font layout ในการจัดให้ : ตรงกัน)
    const startInputStr = formatDateShort(dateA);
    const p1Str = `${formatDateShort(p1Start)}(${DAY_NAMES_SHORT[p1Start.getDay()]}) - ${formatDateShort(p1End)}(${DAY_NAMES_SHORT[p1End.getDay()]})`;
    const p2Str = `${formatDateShort(p2Start)}(${DAY_NAMES_SHORT[p2Start.getDay()]}) - ${formatDateShort(p2End)}(${DAY_NAMES_SHORT[p2End.getDay()]})`;
    const p3Str = `${formatDateShort(p3Start)}(${DAY_NAMES_SHORT[p3Start.getDay()]}) เป็นต้นไป`;

    // ใช้ Space จัดระยะให้ เครื่องหมาย : ตรงกันอย่างสมบูรณ์
    const templateText = 
`DAPT start Tx @${startInputStr}
Phase1 (ASA + Clopidogrel) : ${p1Str}
Phase2 (Clopidogrel)       : ${p2Str}
Phase3 (ASA)               : ${p3Str}`;

    document.getElementById('dapt-copy-text').value = templateText;
}

function resetDAPTForm() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dapt-start-date').value = today;
    document.getElementById('dapt-p1-days').value = 21;
    document.getElementById('dapt-p2-days').value = 90;
    calculateDAPT();
}

// ฟังก์ชันสำหรับปุ่ม Copy ข้อความ
function copyDAPTText() {
    const copyText = document.getElementById('dapt-copy-text');
    copyText.select();
    copyText.setSelectionRange(0, 99999); // สำหรับ mobile
    navigator.clipboard.writeText(copyText.value);

    // แจ้งเตือนเมื่อ Copy สำเร็จ
    const btn = document.getElementById('btn-copy-dapt');
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="fa-solid fa-check"></i> คัดลอกแล้ว!`;
    btn.classList.replace('bg-indigo-600', 'bg-emerald-600');
    btn.classList.replace('hover:bg-indigo-700', 'hover:bg-emerald-700');

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.replace('bg-emerald-600', 'bg-indigo-600');
        btn.classList.replace('hover:bg-emerald-700', 'hover:bg-indigo-700');
    }, 2000);
}
