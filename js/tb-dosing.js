document.addEventListener('DOMContentLoaded', () => {
    // ผูก Event คำนวณเมื่อมีการกรอกน้ำหนักหรือกด Checkbox
    const bwInput = document.getElementById('tb-bw');
    const egfrCheck = document.getElementById('tb-egfr-check');

    if (bwInput) {
        bwInput.addEventListener('input', calculateTBDose);
    }
    if (egfrCheck) {
        egfrCheck.addEventListener('change', calculateTBDose);
    }
});

function calculateTBDose() {
    const bwValue = document.getElementById('tb-bw').value;
    const isEgfrLow = document.getElementById('tb-egfr-check').checked;
    const bw = parseFloat(bwValue) || 0;

    // รายการยาทั้ง 7 ตัว พร้อมสูตรคำนวณ
    const medList = [
        { id: 'h', avgFactor: 5, minFactor: 4, maxFactor: 6, maxCap: null, egfrWarn: false },
        { id: 'r', avgFactor: 10, minFactor: 8, maxFactor: 12, maxCap: null, egfrWarn: false },
        { id: 'z', avgFactor: 25, minFactor: 20, maxFactor: 30, maxCap: null, egfrWarn: true },
        { id: 'e', avgFactor: 15, minFactor: 15, maxFactor: 20, maxCap: null, egfrWarn: true },
        { id: 's', avgFactor: 15, minFactor: 12, maxFactor: 20, maxCap: null, egfrWarn: true },
        { id: 'l', fixedAvg: 750, minFactor: 15, maxFactor: 20, maxCap: 1000, egfrWarn: true },
        { id: 'o', avgFactor: 10, minFactor: 7.5, maxFactor: 15, maxCap: null, egfrWarn: true }
    ];

    medList.forEach(med => {
        const avgEl = document.getElementById(`tb-avg-${med.id}`);
        const minEl = document.getElementById(`tb-min-${med.id}`);
        const maxEl = document.getElementById(`tb-max-${med.id}`);
        const egfrEl = document.getElementById(`tb-egfr-${med.id}`);

        if (bw <= 0) {
            avgEl.innerText = '-';
            minEl.innerText = '-';
            maxEl.innerText = '-';
            if (egfrEl) egfrEl.innerText = '-';
            return;
        }

        // 1. Calculate Average Dose
        let avgDose = med.fixedAvg ? med.fixedAvg : Math.round(bw * med.avgFactor);

        // 2. Calculate Min / Max Dose
        let minDose = Math.round(bw * med.minFactor);
        let maxDose = Math.round(bw * med.maxFactor);

        // Cap max dose for Levofloxacin
        if (med.maxCap && maxDose > med.maxCap) {
            maxDose = med.maxCap;
        }

        // Render Values (ฟอร์แมตเลขกลมๆ หรือใส่จุลภาคกรณีหลักพัน)
        avgEl.innerText = avgDose.toLocaleString();
        minEl.innerText = minDose.toLocaleString();
        maxEl.innerText = maxDose.toLocaleString();

        // Render eGFR Warning
        if (egfrEl) {
            if (isEgfrLow && med.egfrWarn) {
                egfrEl.innerHTML = `<span class="text-amber-600 font-extrabold bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">3 days / week</span>`;
            } else {
                egfrEl.innerText = '-';
            }
        }
    });

    // แสดง/ซ่อน แบนเนอร์เตือน eGFR ด้านบน
    const egfrBanner = document.getElementById('tb-egfr-banner');
    if (egfrBanner) {
        if (isEgfrLow) {
            egfrBanner.classList.remove('hidden');
        } else {
            egfrBanner.classList.add('hidden');
        }
    }
}

function resetTBForm() {
    document.getElementById('tb-bw').value = '';
    document.getElementById('tb-egfr-check').checked = false;
    calculateTBDose();
}
