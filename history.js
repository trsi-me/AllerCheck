function loadHistory() {
    const history = JSON.parse(localStorage.getItem('allerCheck_history') || '[]');
    const list = document.getElementById('historyList');
    const empty = document.getElementById('emptyHistory');
    list.innerHTML = '';
    if (history.length === 0) {
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';
    const locale = getLang() === 'ar' ? 'ar-SA' : 'en-US';
    history.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        const date = new Date(item.date);
        const dateStr = date.toLocaleDateString(locale) + ' ' + date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
        let status;
        if (item.productKnown === false) {
            status = '<span class="status-unknown">' + t('history.statusUnknown') + '</span>';
        } else if (item.safe) {
            status = '<span class="status-safe">' + t('history.statusSafe') + '</span>';
        } else {
            status = '<span class="status-danger">' + t('history.statusWarn') + '</span>';
        }
        let allergens = '-';
        if (item.foundAllergens && item.foundAllergens.length) {
            const sep = getLang() === 'ar' ? '، ' : ', ';
            allergens = item.foundAllergens.map(a => (typeof allergenLabel === 'function' ? allergenLabel(a) : a)).join(sep);
        }
        const detailExtra = item.productKnown !== false && !item.safe && item.foundAllergens && item.foundAllergens.length
            ? ' • ' + allergens
            : '';
        div.innerHTML = `
            <div>
                <strong>${escapeHtml(item.productName)}</strong> — ${status}<br>
                <small style="color:var(--color-light-grey)">${dateStr}${detailExtra}</small>
            </div>
        `;
        list.appendChild(div);
    });
}

function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}

function exportReport() {
    const history = JSON.parse(localStorage.getItem('allerCheck_history') || '[]');
    const favs = JSON.parse(localStorage.getItem('allerCheck_favorites') || '[]');
    const profile = {
        name: localStorage.getItem('allerCheck_userName') || '',
        allergens: JSON.parse(localStorage.getItem('allerCheck_allergens') || '[]')
    };
    const report = {
        exportedAt: new Date().toISOString(),
        profile,
        favorites: favs,
        scanHistory: history,
        summary: {
            totalScans: history.length,
            safeCount: history.filter(h => h.productKnown !== false && h.safe).length,
            warningCount: history.filter(h => h.productKnown !== false && !h.safe).length,
            notRecognizedCount: history.filter(h => h.productKnown === false).length
        }
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `allercheck-report-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
}

function clearHistory() {
    if (confirm(t('history.confirmClear'))) {
        localStorage.setItem('allerCheck_history', '[]');
        loadHistory();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (typeof AllerCheckI18n !== 'undefined') AllerCheckI18n.initI18n();
    loadHistory();
    document.getElementById('exportBtn').addEventListener('click', exportReport);
    document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
});
