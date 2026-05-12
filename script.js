const API_BASE = (window.location.origin && !window.location.origin.startsWith('file')) ? window.location.origin : 'http://localhost:5000';
const API_URL = `${API_BASE}/api/check`;
const SUGGESTIONS_URL = `${API_BASE}/api/suggestions`;

function showToast(msg) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2800);
}

function saveUserData() {
    const userName = document.getElementById('userName').value;
    const checkboxes = document.querySelectorAll('.allergen-checkbox:checked');
    const allergens = Array.from(checkboxes).map(cb => cb.value);
    localStorage.setItem('allerCheck_userName', userName);
    localStorage.setItem('allerCheck_allergens', JSON.stringify(allergens));
}

function loadUserData() {
    const userName = localStorage.getItem('allerCheck_userName');
    const allergens = JSON.parse(localStorage.getItem('allerCheck_allergens') || '[]');
    if (userName) document.getElementById('userName').value = userName;
    if (allergens.length > 0) {
        document.querySelectorAll('.allergen-checkbox').forEach(checkbox => {
            checkbox.checked = allergens.includes(checkbox.value);
        });
    }
}

async function checkProduct() {
    const userName = document.getElementById('userName').value;
    const productName = document.getElementById('productName').value;
    const ingredientText = (document.getElementById('ingredientText') || {}).value || '';
    const checkboxes = document.querySelectorAll('.allergen-checkbox:checked');
    const userAllergens = Array.from(checkboxes).map(cb => cb.value);

    if (!userName.trim()) { showToast(t('toast.enterName')); return; }
    if (!productName.trim()) { showToast(t('toast.enterProduct')); return; }
    if (userAllergens.length === 0) { showToast(t('toast.selectAllergen')); return; }

    saveUserData();

    const resultSection = document.getElementById('resultSection');
    const resultContent = document.getElementById('resultContent');
    resultSection.style.display = 'block';
    resultContent.innerHTML = `<div class="spinner"></div><p>${t('loading.analyzing')}</p>`;
    resultContent.className = 'result-box result-loading';

    const checkBtn = document.getElementById('checkBtn');
    checkBtn.disabled = true;
    checkBtn.style.opacity = '0.6';
    checkBtn.style.cursor = 'not-allowed';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productName,
                userAllergens,
                ingredientText: ingredientText.trim(),
                lang: getLang()
            })
        });
        const data = await response.json();
        if (data.success) {
            displayResult(data, userAllergens);
        } else {
            displayError(data.message || t('api.analysisFailed'));
        }
    } catch (error) {
        displayError(t('api.noServer'));
    } finally {
        checkBtn.disabled = false;
        checkBtn.style.opacity = '1';
        checkBtn.style.cursor = 'pointer';
    }
}

function saveToHistory(data) {
    const history = JSON.parse(localStorage.getItem('allerCheck_history') || '[]');
    const known = data.productKnown !== false;
    history.unshift({
        productName: data.productName,
        productKnown: known,
        safe: known ? data.safe : null,
        foundAllergens: data.foundAllergens || [],
        date: new Date().toISOString()
    });
    if (history.length > 100) history.pop();
    localStorage.setItem('allerCheck_history', JSON.stringify(history));
}

function addToFavorites(productName) {
    const favs = JSON.parse(localStorage.getItem('allerCheck_favorites') || '[]');
    if (!favs.includes(productName)) {
        favs.push(productName);
        localStorage.setItem('allerCheck_favorites', JSON.stringify(favs));
        showToast(t('toast.favoriteAdded'));
    }
}

function ingredientModelVerdictHtml(data) {
    if (!data || (data.ingredientStatusAr == null && data.ingredientStatusEn == null)) return '';
    const lang = typeof getLang === 'function' ? getLang() : 'en';
    const status = lang === 'ar'
        ? (data.ingredientStatusAr || data.ingredientStatusEn || '')
        : (data.ingredientStatusEn || data.ingredientStatusAr || '');
    const pct = (typeof data.aiConfidence === 'number')
        ? ` (${Math.round(data.aiConfidence * 100)}%)`
        : '';
    return `<div class="result-note">${t('result.ingredientVerdict', { status: status + pct })}</div>`;
}

function displayResult(data, userAllergens) {
    saveToHistory(data);
    const resultContent = document.getElementById('resultContent');
    if (data.productKnown === false) {
        resultContent.className = 'result-box result-unknown';
        resultContent.innerHTML = `
            <div class="result-icon">${t('result.unknownIcon')}</div>
            <div class="result-title">${t('result.unknownTitle')}</div>
            <div class="result-message">${t('result.unknownMsg', { product: data.productName })}</div>
            <div class="result-note">${t('result.unknownNote')}</div>
            ${ingredientModelVerdictHtml(data)}
        `;
        resultContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
    }
    if (data.safe) {
        resultContent.className = 'result-box result-safe';
        resultContent.innerHTML = `
            <div class="result-icon">${t('result.safeIcon')}</div>
            <div class="result-title">${t('result.safeTitle')}</div>
            <div class="result-message">${t('result.safeMsg', { product: data.productName })}</div>
            <div class="result-note">${t('result.safeNote')}</div>
            ${ingredientModelVerdictHtml(data)}
            <button type="button" class="btn-small" id="addFavoriteBtn" style="margin-top:15px">${t('result.addFavorite')}</button>
        `;
        document.getElementById('addFavoriteBtn').onclick = () => addToFavorites(data.productName);
    } else {
        resultContent.className = 'result-box result-danger';
        const foundAllergens = data.foundAllergens || [];
        const allergenListHTML = foundAllergens.length > 0 ? `
            <div class="allergen-list">
                <div class="allergen-list-title">${t('result.foundTitle')}</div>
                <div class="allergen-list-items">
                    ${foundAllergens.map(a => `<div class="allergen-badge"><span class="badge-icon">⚠</span><span>${allergenLabel(a)}</span></div>`).join('')}
                </div>
            </div>
        ` : '';
        const warningMessage = foundAllergens.length === 1
            ? t('result.warnOne', { product: data.productName, a: allergenLabel(foundAllergens[0]) })
            : t('result.warnMany', { product: data.productName, n: foundAllergens.length });
        resultContent.innerHTML = `
            <div class="result-icon">${t('result.warnIcon')}</div>
            <div class="result-title">${t('result.warnTitle')}</div>
            <div class="result-message">${warningMessage}</div>
            <div class="result-note danger-note">${t('result.avoid')}</div>
            ${ingredientModelVerdictHtml(data)}
            ${allergenListHTML}
        `;
    }
    resultContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function displayError(message) {
    const resultContent = document.getElementById('resultContent');
    resultContent.className = 'result-box result-error';
    resultContent.innerHTML = `
        <div class="result-icon">!</div>
        <div class="result-title">${t('result.errorTitle')}</div>
        <div class="result-message">${message}</div>
    `;
    resultContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function updateProductSuggestions() {
    const productInput = document.getElementById('productName');
    const suggestionsList = document.getElementById('productSuggestions');
    const inputValue = productInput.value.trim().toLowerCase();
    suggestionsList.innerHTML = '';
    if (inputValue.length >= 2) {
        try {
            const res = await fetch(`${SUGGESTIONS_URL}?q=${encodeURIComponent(inputValue)}`);
            const data = await res.json();
            (data.suggestions || []).slice(0, 8).forEach(product => {
                const option = document.createElement('option');
                option.value = product;
                suggestionsList.appendChild(option);
            });
        } catch (_) {}
    }
}

function validateBeforeCheck() {
    const userName = document.getElementById('userName').value.trim();
    const productName = document.getElementById('productName').value.trim();
    const checkboxes = document.querySelectorAll('.allergen-checkbox:checked');
    const userAllergens = Array.from(checkboxes).map(cb => cb.value);
    const errors = [];
    if (!userName) { errors.push(t('toast.enterNameFirst')); document.getElementById('userName').focus(); }
    if (!productName) { errors.push(t('toast.enterProduct')); }
    if (userAllergens.length === 0) errors.push(t('toast.selectAllergen'));
    if (errors.length > 0) {
        showToast(errors[0]);
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    if (typeof AllerCheckI18n !== 'undefined') AllerCheckI18n.initI18n();
    loadUserData();
    document.getElementById('checkBtn').addEventListener('click', () => { if (validateBeforeCheck()) checkProduct(); });
    document.getElementById('productName').addEventListener('keypress', e => { if (e.key === 'Enter' && validateBeforeCheck()) checkProduct(); });
    let suggestTimeout;
    document.getElementById('productName').addEventListener('input', function() {
        clearTimeout(suggestTimeout);
        suggestTimeout = setTimeout(updateProductSuggestions, 300);
    });
    document.getElementById('userName').addEventListener('blur', saveUserData);
    document.getElementById('userName').addEventListener('input', function() {
        clearTimeout(window.userNameTimeout);
        window.userNameTimeout = setTimeout(saveUserData, 1000);
    });
    document.querySelectorAll('.allergen-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            saveUserData();
            if (this.checked) {
                const pill = this.closest('.allergen-pill');
                pill.style.transform = 'scale(1.05)';
                setTimeout(() => pill.style.transform = '', 200);
            }
        });
    });
});
