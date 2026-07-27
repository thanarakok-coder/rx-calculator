// Data Tables
const AMPICILLIN_TABLE = [
    { pmaMin: 0,  pmaMax: 29, pnaMin: 0,  pnaMax: 28, intervalHrs: 12, textPma: "29 wk-", textPna: "0 - 28 days" },
    { pmaMin: 0,  pmaMax: 29, pnaMin: 29, pnaMax: 999, intervalHrs: 8, textPma: "29 wk-", textPna: "29 days+" },
    { pmaMin: 30, pmaMax: 36, pnaMin: 0,  pnaMax: 14, intervalHrs: 12, textPma: "30 - 36 wk", textPna: "0 - 14 days" },
    { pmaMin: 30, pmaMax: 36, pnaMin: 15, pnaMax: 999, intervalHrs: 8, textPma: "30 - 36 wk", textPna: "15 days+" },
    { pmaMin: 37, pmaMax: 44, pnaMin: 0,  pnaMax: 7,  intervalHrs: 12, textPma: "37 - 44 wk", textPna: "0 - 7 days" },
    { pmaMin: 37, pmaMax: 44, pnaMin: 8,  pnaMax: 999, intervalHrs: 8, textPma: "37 - 44 wk", textPna: "8 days+" },
    { pmaMin: 45, pmaMax: 999, pnaMin: 0, pnaMax: 999, intervalHrs: 6, textPma: "45 wk+", textPna: "ALL" }
];

const GENTAMICIN_TABLE = [
    { pmaMin: 0,  pmaMax: 29, pnaMin: 0,  pnaMax: 7,   multiplier: 5.0, intervalHrs: 48, textPma: "29 wk-", textPna: "0 - 7 days" },
    { pmaMin: 0,  pmaMax: 29, pnaMin: 8,  pnaMax: 28,  multiplier: 4.0, intervalHrs: 36, textPma: "29 wk-", textPna: "8 - 28 days" },
    { pmaMin: 0,  pmaMax: 29, pnaMin: 29, pnaMax: 999, multiplier: 4.0, intervalHrs: 24, textPma: "29 wk-", textPna: "29 days+" },
    { pmaMin: 30, pmaMax: 34, pnaMin: 0,  pnaMax: 7,   multiplier: 4.5, intervalHrs: 36, textPma: "30 - 34 wk", textPna: "0 - 7 days" },
    { pmaMin: 30, pmaMax: 34, pnaMin: 8,  pnaMax: 999, multiplier: 4.0, intervalHrs: 24, textPma: "30 - 34 wk", textPna: "8 days+" },
    { pmaMin: 35, pmaMax: 999, pnaMin: 0, pnaMax: 999, multiplier: 4.0, intervalHrs: 24, textPma: "35 wk+", textPna: "ALL" }
];

document.addEventListener('DOMContentLoaded', () => {
    // Setup Enter key navigation
    const inputs = ['atb-ga-wk', 'atb-ga-day', 'atb-pna-day', 'atb-bw'];
    inputs.forEach((id, index) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const nextId = inputs[(index + 1) % inputs.length];
                    document.getElementById(nextId).focus();
                    document.getElementById(nextId).select();
                }
            });
            el.addEventListener('input', calculateATB);
        }
    });

    // Drug Toggles
    ['toggle-ampi', 'toggle-genta', 'toggle-cloxa', 'toggle-clinda'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', toggleDrugCards);
    });

    calculateATB();
});

// Step adjustment for BW and Day inputs
function adjustValue(id, step) {
    const el = document.getElementById(id);
    if (!el) return;
    let val = parseFloat(el.value) || 0;
    val = Math.max(0, val + step);
    
    if (id === 'atb-bw') {
        el.value = val.toFixed(4);
    } else {
        el.value = Math.round(val);
    }
    calculateATB();
}

function resetATBForm() {
    document.getElementById('atb-ga-wk').value = 0;
    document.getElementById('atb-ga-day').value = 0;
    document.getElementById('atb-pna-day').value = 0;
    document.getElementById('atb-bw').value = (0).toFixed(4);
    calculateATB();
}

function toggleDrugCards() {
    const ampiOn = document.getElementById('toggle-ampi').checked;
    const gentaOn = document.getElementById('toggle-genta').checked;
    const cloxaOn = document.getElementById('toggle-cloxa').checked;
    const clindaOn = document.getElementById('toggle-clinda').checked;

    document.getElementById('card-ampi').classList.toggle('hidden', !ampiOn);
    document.getElementById('card-genta').classList.toggle('hidden', !gentaOn);
    document.getElementById('card-cloxa').classList.toggle('hidden', !cloxaOn);
    document.getElementById('card-clinda').classList.toggle('hidden', !clindaOn);
}

function calculatePMA(gaWk, gaDay, pnaDay) {
    const totalDays = gaDay + pnaDay;
    const addWk = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;
    
    let roundedWk = 0;
    if (remDays >= 4) {
        roundedWk = 1;
    }

    const calculatedPMA = gaWk + addWk + roundedWk;
    return {
        pma: calculatedPMA,
        totalDays: totalDays,
        addWk: addWk,
        remDays: remDays,
        roundedWk: roundedWk
    };
}

function calculateATB() {
    const gaWk = parseInt(document.getElementById('atb-ga-wk').value) || 0;
    const gaDay = parseInt(document.getElementById('atb-ga-day').value) || 0;
    const pnaDay = parseInt(document.getElementById('atb-pna-day').value) || 0;
    const bw = parseFloat(document.getElementById('atb-bw').value) || 0;

    const pmaResult = calculatePMA(gaWk, gaDay, pnaDay);
    const pma = pmaResult.pma;

    document.getElementById('pma-calc-explain').innerHTML = 
        `PMA = GA (${gaWk} wk ${gaDay} d) + PNA (${pnaDay} d) ➔ วันรวม = ${gaDay}+${pnaDay} = ${pmaResult.totalDays} วัน (${pmaResult.addWk} wk เศษ ${pmaResult.remDays} วัน) ` +
        `➔ เศษ ${pmaResult.remDays} วัน [${pmaResult.remDays >= 4 ? 'ปัดขึ้นเป็น 1 wk' : 'ปัดทิ้ง'}] ➔ <strong>PMA = ${pma} สัปดาห์</strong>`;

    document.getElementById('display-pma-wk').innerText = `${pma} wk`;

    const ampiMinTotal = bw * 150;
    const ampiMaxTotal = bw * 200;
    document.getElementById('ampi-min-daily').innerText = ampiMinTotal.toFixed(2);
    document.getElementById('ampi-max-daily').innerText = ampiMaxTotal.toFixed(2);

    renderAmpicillinTable(pma, pnaDay, ampiMinTotal, ampiMaxTotal);
    renderGentamicinTable(pma, pnaDay, bw);
}

function renderAmpicillinTable(pma, pna, minDaily, maxDaily) {
    const tbody = document.getElementById('tbody-ampi');
    if (!tbody) return;
    tbody.innerHTML = '';

    AMPICILLIN_TABLE.forEach((row) => {
        const isPmaMatch = pma >= row.pmaMin && pma <= row.pmaMax;
        const isPnaMatch = pna >= row.pnaMin && pna <= row.pnaMax;
        const isMatch = isPmaMatch && isPnaMatch;

        const dosesPerDay = 24 / row.intervalHrs;
        const doseMin = minDaily / dosesPerDay;
        const doseMax = maxDaily / dosesPerDay;

        const tr = document.createElement('tr');
        tr.className = isMatch 
            ? 'bg-emerald-100 font-bold text-emerald-950 border-2 border-emerald-400' 
            : 'hover:bg-slate-50 text-slate-700';

        tr.innerHTML = `
            <td class="p-2 border border-slate-200 text-center">${row.textPma}</td>
            <td class="p-2 border border-slate-200 text-center">${row.textPna}</td>
            <td class="p-2 border border-slate-200 text-right font-mono font-bold">${doseMin.toFixed(2)}</td>
            <td class="p-2 border border-slate-200 text-right font-mono font-bold">${doseMax.toFixed(2)}</td>
            <td class="p-2 border border-slate-200 text-center">mg</td>
            <td class="p-2 border border-slate-200 text-center font-semibold">q ${row.intervalHrs} hr(s).</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderGentamicinTable(pma, pna, bw) {
    const tbody = document.getElementById('tbody-genta');
    if (!tbody) return;
    tbody.innerHTML = '';

    let matchedDose = 0;

    GENTAMICIN_TABLE.forEach((row) => {
        const isPmaMatch = pma >= row.pmaMin && pma <= row.pmaMax;
        const isPnaMatch = pna >= row.pnaMin && pna <= row.pnaMax;
        const isMatch = isPmaMatch && isPnaMatch;

        const dose = bw * row.multiplier;
        if (isMatch) matchedDose = dose;

        const tr = document.createElement('tr');
        tr.className = isMatch 
            ? 'bg-sky-100 font-bold text-sky-950 border-2 border-sky-400' 
            : 'hover:bg-slate-50 text-slate-700';

        tr.innerHTML = `
            <td class="p-2 border border-slate-200 text-center">${row.textPma}</td>
            <td class="p-2 border border-slate-200 text-center">${row.textPna}</td>
            <td class="p-2 border border-slate-200 text-right font-mono font-bold text-sky-900">${dose.toFixed(2)}</td>
            <td class="p-2 border border-slate-200 text-center">mg</td>
            <td class="p-2 border border-slate-200 text-center font-semibold">q ${row.intervalHrs} hr(s).</td>
        `;
        tbody.appendChild(tr);
    });

    const minSolVol = matchedDose / 10;
    const solEl = document.getElementById('genta-calc-sol');
    if (solEl) solEl.innerText = `${minSolVol.toFixed(2)} ml`;
}

// Module Switcher Function
function showModule(moduleName) {
    const modules = ['home', 'smalldose'];
    modules.forEach(m => {
        const el = document.getElementById(`module-${m}`);
        if (el) el.classList.add('hidden');
    });

    const selected = document.getElementById(`module-${moduleName}`);
    if (selected) {
        selected.classList.remove('hidden');
    }
}
