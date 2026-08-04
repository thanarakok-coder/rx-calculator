document.addEventListener('DOMContentLoaded', () => {
    renderFooter();
    // Default show home module
    showModule('home');
});

// Central Routing Function
function showModule(moduleName) {
    const modules = document.querySelectorAll('.app-module');
    modules.forEach(m => m.classList.add('hidden'));

    const selected = document.getElementById(`module-${moduleName}`);
    if (selected) {
        selected.classList.remove('hidden');
    }

    // จัดการปุ่ม Home ให้แสดงผลเมื่อไม่ได้อยู่หน้า home
    const btnHome = document.getElementById('btn-home-nav');
    if (btnHome) {
        if (moduleName === 'home') {
            btnHome.classList.add('hidden');
        } else {
            btnHome.classList.remove('hidden');
            btnHome.classList.display = 'flex'; // มั่นใจว่าแสดงผล
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderFooter() {
    const footerContainer = document.getElementById('main-footer');
    if (footerContainer) {
        footerContainer.innerHTML = `
            <footer class="mt-12 py-6 border-t border-slate-300 text-center text-xs text-slate-500 font-medium">
                <p>Designed by <strong>RacNoot52</strong></p>
                <p class="mt-1">Contact / Suggestion: <a href="mailto:shk11400.rx@gmail.com" class="text-indigo-600 hover:underline font-bold">shk11400.rx@gmail.com</a></p>
            </footer>
        `;
    }
}
