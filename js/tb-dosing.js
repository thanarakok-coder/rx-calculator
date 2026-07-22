document.addEventListener('DOMContentLoaded', () => {
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

    // รายการยาทั้ง 7 ตัว พร้อมกำหนด Max Cap ตามโจทย์
    const medList = [
        { id: 'h', avgFactor: 5, minFactor: 4, maxFactor: 6, maxCap: 300, egfrWarn: false },
        { id: 'r', avgFactor: 10, minFactor: 8, maxFactor: 12, maxCap: 600, egfrWarn: false },
        { id: 'z', avgFactor: 25, minFactor: 20, maxFactor: 30, maxCap: 2000, egfrWarn: true },
        { id: 'e', avgFactor: 15, minFactor: 15, maxFactor: 20, maxCap: 1600, egfrWarn: true },
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
            avgEl.innerHTML = '-';
            minEl.innerText = '-';
            maxEl.innerText = '-';
            if (egfrEl) egfrEl.innerText = '-';
            return;
        }

        // 1. คำนวณขนาดยาเฉลี่ย
        let rawAvg = med.fixedAvg ? med.fixedAvg : Math.round(bw * med.avgFactor);
        let displayAvg = rawAvg;
        let isOverMax = false;

        // เช็ก Max Cap ของขนาดยาเฉลี่ย
        if (med.maxCap && rawAvg > med.maxCap) {
            displayAvg = med.maxCap;
            isOverMax = true;
        }

        // แสดงผล Approx Dose (ถ้าเกิน Max Dose ให้แสดงตัวเตือนสีแดง)
        if (isOverMax) {
            avgEl.innerHTML = `
                <div class="flex flex-col items-center">
                    <span class="text-2xl md:text-3xl font-black text-red-600">${displayAvg.toLocaleString()}</span>
                    <span class="text-xs font-black bg-red-100 text-red-700 px-2 py-0.5 rounded-full mt-0.5">
                        <i class="fa-solid fa-triangle-exclamation"></i> Max ${med.maxCap} mg
                    </span>
                </div>
            `;
        } else {
            avgEl.innerHTML = `<span class="text-2xl md:text-3xl font-black text-blue-600">${displayAvg.toLocaleString()}</span>`;
        }

        // 2. คำนวณ Min / Max Range
        let minDose = Math.round(bw * med.minFactor);
        let maxDose = Math.round(bw * med.maxFactor);

        if (med.maxCap && maxDose > med.maxCap) {
            maxDose = med.maxCap;
        }

        minEl.innerText = minDose.toLocaleString();
        maxEl.innerText = maxDose.toLocaleString();

        // 3. เตือน eGFR
        if (egfrEl) {
            if (isEgfrLow && med.egfrWarn) {
                egfrEl.innerHTML = `<span class="text-red-700 font-extrabold bg-red-100 px-2.5 py-1 rounded-lg border border-red-300 block text-center">3 days / week</span>`;
            } else {
                egfrEl.innerText = '-';
            }
        }
    });

    // แสดง/ซ่อน แบนเนอร์เตือน eGFR (ย้ายมาฝั่งซ้ายแล้ว)
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
