document.addEventListener('DOMContentLoaded', () => {
    // Render Footer Credit
    renderFooter();
    
    // Default show home module
    showModule('home');
});

// Central Routing Function for all 10+ modules
function showModule(moduleName) {
    // ซ่อนทุก module section ที่มี class "app-module"
    const modules = document.querySelectorAll('.app-module');
    modules.forEach(m => m.classList.add('hidden'));

    // แสดงเฉพาะ module ที่เลือก
    const selected = document.getElementById(`module-${moduleName}`);
    if (selected) {
        selected.classList.remove('hidden');
    }

    // จัดการปุ่ม Home ให้ซ่อนเมื่ออยู่หน้าแรก
    const btnHome = document.getElementById('btn-home-nav');
    if (btnHome) {
        if (moduleName === 'home') {
            btnHome.classList.add('hidden');
        } else {
            btnHome.classList.remove('hidden');
        }
    }

    // Scroll back to top
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
