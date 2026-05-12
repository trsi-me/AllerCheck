const API_BASE = (window.location.origin && !window.location.origin.startsWith('file')) ? window.location.origin : 'http://localhost:5000';

async function loadDashboard() {
    const history = JSON.parse(localStorage.getItem('allerCheck_history') || '[]');
    const favs = JSON.parse(localStorage.getItem('allerCheck_favorites') || '[]');
    const unknownCount = history.filter(h => h.productKnown === false).length;
    const safeCount = history.filter(h => h.productKnown !== false && h.safe).length;
    const warningCount = history.filter(h => h.productKnown !== false && !h.safe).length;

    let systemStats = { productsInDatabase: '-', modelLoaded: false };
    try {
        const res = await fetch(`${API_BASE}/api/stats`);
        systemStats = await res.json();
    } catch (_) {}

    document.getElementById('statsGrid').innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${history.length}</div>
            <div class="stat-label">${t('dashboard.totalScans')}</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color:var(--color-green-safe)">${safeCount}</div>
            <div class="stat-label">${t('dashboard.safeProducts')}</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color:var(--color-red-danger)">${warningCount}</div>
            <div class="stat-label">${t('dashboard.warnings')}</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color:var(--color-medium-blue)">${unknownCount}</div>
            <div class="stat-label">${t('dashboard.notRecognized')}</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${favs.length}</div>
            <div class="stat-label">${t('dashboard.favorites')}</div>
        </div>
    `;

    document.getElementById('systemStats').innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${systemStats.productsInDatabase}</div>
            <div class="stat-label">${t('dashboard.productsDb')}</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${systemStats.modelLoaded ? t('dashboard.yes') : t('dashboard.no')}</div>
            <div class="stat-label">${t('dashboard.modelLoaded')}</div>
        </div>
    `;

    const allergenCount = {};
    history.filter(h => h.productKnown !== false && !h.safe).forEach(h => {
        (h.foundAllergens || []).forEach(a => {
            allergenCount[a] = (allergenCount[a] || 0) + 1;
        });
    });
    const sorted = Object.entries(allergenCount).sort((a, b) => b[1] - a[1]);
    const freqEl = document.getElementById('allergenFreq');
    freqEl.innerHTML = '';
    if (sorted.length === 0) {
        freqEl.innerHTML = '<p style="color:var(--color-light-grey)">' + t('dashboard.noAllergenData') + '</p>';
    } else {
        sorted.forEach(([allergen, count]) => {
            const div = document.createElement('div');
            div.className = 'history-item';
            const label = typeof allergenLabel === 'function' ? allergenLabel(allergen) : allergen;
            div.innerHTML = `<strong>${label}</strong> — ${count} ${t('dashboard.times')}`;
            freqEl.appendChild(div);
        });
    }

    const favsEl = document.getElementById('favoritesList');
    const emptyFavs = document.getElementById('emptyFavs');
    favsEl.innerHTML = '';
    if (favs.length === 0) {
        emptyFavs.style.display = 'block';
    } else {
        emptyFavs.style.display = 'none';
        favs.forEach(product => {
            const div = document.createElement('div');
            div.className = 'favorite-item';
            div.innerHTML = `
                <span>${product}</span>
                <button type="button" class="btn-small remove-fav" data-product="${product.replace(/"/g, '&quot;')}">${t('dashboard.remove')}</button>
            `;
            favsEl.appendChild(div);
        });
        favsEl.querySelectorAll('.remove-fav').forEach(btn => {
            btn.onclick = function() {
                const p = this.dataset.product;
                const newFavs = favs.filter(f => f !== p);
                localStorage.setItem('allerCheck_favorites', JSON.stringify(newFavs));
                loadDashboard();
            };
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (typeof AllerCheckI18n !== 'undefined') AllerCheckI18n.initI18n();
    loadDashboard();
});
