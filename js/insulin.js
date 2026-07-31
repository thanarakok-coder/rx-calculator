let alcMode = 'all'; 

const thaiMonths = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
];

document.addEventListener('DOMContentLoaded', () => {
    const startDateInput = document.getElementById('ins-start-date');
    if (startDateInput) {
        const today = new Date().toISOString().split('T')[0];
        startDateInput.value = today;
        calculateInsulin();
    }
});

function handleEnterKey(event, nextId) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const nextElement = document.getElementById(nextId);
        if (nextElement) {
            nextElement.focus();
            if (nextElement.type === 'number' || nextElement.type === 'text') {
                nextElement.select();
            }
        }
    }
}

function setAlcMode(mode) {
    alcMode = mode;
    
    const btnAll = document.getElementById('btn-alc-all');
    const btn8 = document.getElementById('btn-alc-8');
    const btn10 = document.getElementById('btn-alc-10');

    if (btnAll && btn8 && btn10) {
        [btnAll, btn8, btn10].forEach(btn => {
            btn.className = "py-2 rounded-xl bg-white text-slate-700 border-2 hover:bg-slate-50";
        });

        if (mode === 'all') {
            btnAll.className = "py-2 rounded-xl bg-blue-600 text-white shadow-md";
        } else if (mode === '8') {
            btn8.className = "py-2 rounded-xl bg-blue-600 text-white shadow-md";
        } else if (mode === '10') {
            btn10.className = "py-2 rounded-xl bg-blue-600 text-white shadow-md";
        }
    }

    updateAlcVisibility();
}

function updateAlcVisibility() {
    const penfillAlc8 = document.getElementById('box-penfill-alc8');
    const penfillAlc10 = document.getElementById('box-penfill-alc10');
    const vialAlc8 = document.getElementById('box-vial-alc8');
    const vialAlc10 = document.getElementById('box-vial-alc10');

    if (!penfillAlc8 || !penfillAlc10 || !vialAlc8 || !vialAlc10) return;

    if (alcMode === 'all') {
        penfillAlc8.classList.remove('hidden');
        penfillAlc10.classList.remove('hidden');
        vialAlc8.classList.remove('hidden');
        vialAlc10.classList.remove('hidden');
    } else if (alcMode === '8') {
        penfillAlc8.classList.remove('hidden');
        penfillAlc10.classList.add('hidden');
        vialAlc8.classList.remove('hidden');
        vialAlc10.classList.add('hidden');
    } else if (alcMode === '10') {
        penfillAlc8.classList.add('hidden');
        penfillAlc10.classList.remove('hidden');
        vialAlc8.classList.add('hidden');
        vialAlc10.classList.remove('hidden');
    }
}

function resetInsulinForm() {
    const morning = document.getElementById('ins-morning');
    const evening = document.getElementById('ins-evening');
    const fuDays = document.getElementById('ins-fu-days');
    const startDate = document.getElementById('ins-start-date');

    if (morning) morning.value = '';
    if (evening) evening.value = '';
    if (fuDays) fuDays.value = '';
    if (startDate) startDate.value = new Date().toISOString().split('T')[0];

    setAlcMode('all');
    calculateInsulin();
}

function calculateInsulin() {
    const morningInput = document.getElementById('ins-morning');
    const eveningInput = document.getElementById('ins-evening');
    const fuDaysInput = document.getElementById('ins-fu-days');
    const startDateVal = document.getElementById('ins-start-date')?.value;

    if (!morningInput || !eveningInput || !fuDaysInput) return;
    
    const morningDose = parseFloat(morningInput.value) || 0;
    const eveningDose = parseFloat(eveningInput.value) || 0;
    const fuDays = parseInt(fuDaysInput.value) || 0;

    const dailyDose = morningDose + eveningDose;
    const totalUnitsA = dailyDose * fuDays;

    let fuDateStr = '-';
    let dayOfWeekStr = '-';
    const warningBox = document.getElementById('weekend-warning');
    const warningText = document.getElementById('warning-text');
    
    if (startDateVal && fuDays > 0) {
        const startDate = new Date(startDateVal);
        const fuDate = new Date(startDate);
        fuDate.setDate(startDate.getDate() + fuDays);

        const dayIndex = fuDate.getDay();
        const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayNamesThai = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];
        
        dayOfWeekStr = `${dayNamesShort[dayIndex]} (${dayNamesThai[dayIndex]})`;

        const day = fuDate.getDate();
        const monthText = thaiMonths[fuDate.getMonth()];
        const monthNum = String(fuDate.getMonth() + 1).padStart(2, '0');
        const yearBE = fuDate.getFullYear() + 543;
        const yearBEShort = String(yearBE).slice(-2);
        const dayPadded = String(day).padStart(2, '0');

        fuDateStr = `${day} ${monthText} ${yearBE} (${dayPadded}/${monthNum}/${yearBEShort})`;

        if (warningBox && warningText) {
            if (dayIndex === 0 || dayIndex === 6) {
                warningBox.classList.remove('hidden');
                warningText.innerText = `ตรงกับวันหยุด (${dayNamesThai[dayIndex]}) กรุณาเลื่อนวันนัด!`;
            } else {
                warningBox.classList.add('hidden');
            }
        }
    } else {
        if (warningBox) warningBox.classList.add('hidden');
    }

    const cartridgeCalc = fuDays > 0 ? totalUnitsA / 300 : 0;
    const cartridgeNet = Math.ceil(cartridgeCalc);

    const vialWarningBox = document.getElementById('vial-lowdose-warning');
    let vialCalc = 0;
    let vialNet = 0;

    if (dailyDose > 0 && dailyDose <= 25) {
        if (vialWarningBox) vialWarningBox.classList.remove('hidden');
        vialCalc = fuDays > 0 ? fuDays / 40 : 0;
        vialNet = Math.ceil(vialCalc);
    } else {
        if (vialWarningBox) vialWarningBox.classList.add('hidden');
        vialCalc = fuDays > 0 ? totalUnitsA / 1000 : 0;
        vialNet = Math.ceil(vialCalc);
    }

    const penNeedleCount = fuDays > 0 ? Math.ceil(fuDays / 2) : 0;
    const syringeCount = fuDays > 0 ? fuDays : 0;

    let alc8Bags = fuDays > 0 ? Math.ceil(fuDays / 4) : 0;
    let alc10Bags = fuDays > 0 ? Math.ceil(fuDays / 5) : 0;

    if (fuDays > 0 && (morningDose === 0 || eveningDose === 0)) {
        alc8Bags = Math.ceil(alc8Bags / 2);
        alc10Bags = Math.ceil(alc10Bags / 2);
    }

    const resFuDate = document.getElementById('res-fu-date');
    if (resFuDate) resFuDate.innerText = fuDateStr;
    const resFuDay = document.getElementById('res-fu-day');
    if (resFuDay) resFuDay.innerText = dayOfWeekStr;

    const resCartCalc = document.getElementById('res-cartridge-calc');
    if (resCartCalc) resCartCalc.innerText = cartridgeCalc.toFixed(2);
    const resCartNet = document.getElementById('res-cartridge-net');
    if (resCartNet) resCartNet.innerText = cartridgeNet;
    const resPenNeedle = document.getElementById('res-pen-needle');
    if (resPenNeedle) resPenNeedle.innerText = penNeedleCount;

    const resVialCalc = document.getElementById('res-vial-calc');
    if (resVialCalc) resVialCalc.innerText = vialCalc.toFixed(2);
    const resVialNet = document.getElementById('res-vial-net');
    if (resVialNet) resVialNet.innerText = vialNet;
    const resSyringe = document.getElementById('res-syringe');
    if (resSyringe) resSyringe.innerText = syringeCount;

    const resPenAlc8 = document.getElementById('res-penfill-alc8');
    if (resPenAlc8) resPenAlc8.innerText = alc8Bags;
    const resPenAlc10 = document.getElementById('res-penfill-alc10');
    if (resPenAlc10) resPenAlc10.innerText = alc10Bags;
    const resVialAlc8 = document.getElementById('res-vial-alc8');
    if (resVialAlc8) resVialAlc8.innerText = alc8Bags;
    const resVialAlc10 = document.getElementById('res-vial-alc10');
    if (resVialAlc10) resVialAlc10.innerText = alc10Bags;

    updateAlcVisibility();
}
