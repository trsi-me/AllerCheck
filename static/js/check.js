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
    const checkboxes = document.querySelectorAll('.allergen-checkbox:checked');
    const userAllergens = Array.from(checkboxes).map(cb => cb.value);

    if (!userName.trim()) { alert('Please enter your name'); return; }
    if (!productName.trim()) { alert('Please enter product name'); return; }
    if (userAllergens.length === 0) { alert('Please select at least one allergen'); return; }

    // --- شرط الأمان القاطع لمنع الحروف العربية قبل الفحص ---
    const arabicPattern = /[\u0600-\u06FF]/;
    if (arabicPattern.test(productName)) {
        alert("عذراً، يجب كتابة اسم المنتج باللغة الإنجليزية فقط لضمان دقة الفحص.\n\nPlease enter the product name in English only.");
        document.getElementById('productName').focus();
        document.getElementById('productName').select();
        return; // إيقاف الدالة فوراً ومنع إرسال أي بيانات
    }

    saveUserData();

    const resultSection = document.getElementById('resultSection');
    const resultContent = document.getElementById('resultContent');
    resultSection.style.display = 'block';
    resultContent.innerHTML = '<p>Scanning...</p>';
    resultContent.className = 'result-box result-loading';

    const checkBtn = document.getElementById('checkBtn');
    checkBtn.disabled = true;
    checkBtn.style.opacity = '0.6';
    checkBtn.style.cursor = 'not-allowed';

    try {
        const response = await fetch('/api/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productName, userAllergens })
        });
        const data = await response.json();
        displayResult(data, userAllergens);
    } catch (error) {
        performLocalCheck(productName, userAllergens);
    } finally {
        checkBtn.disabled = false;
        checkBtn.style.opacity = '1';
        checkBtn.style.cursor = 'pointer';
    }
}

function displayResult(data, userAllergens) {
    const resultContent = document.getElementById('resultContent');
    if (data.safe) {
        resultContent.className = 'result-box result-safe';
        resultContent.innerHTML = `
            <div class="result-icon">✓</div>
            <div class="result-title">SAFE TO CONSUME</div>
            <div class="result-message">Ingredients checked, no known traces of your allergens found in "<strong>${data.productName}</strong>"</div>
            <div class="result-note">You can safely consume this product</div>
        `;
    } else {
        resultContent.className = 'result-box result-danger';
        const foundAllergens = data.foundAllergens || [];
        const allergenListHTML = foundAllergens.length > 0 ? `
            <div class="allergen-list">
                <div class="allergen-list-title">Found Allergens:</div>
                <div class="allergen-list-items">
                    ${foundAllergens.map(a => `<div class="allergen-badge"><span class="badge-icon">✗</span><span>${a}</span></div>`).join('')}
                </div>
            </div>
        ` : '';
        const warningMessage = foundAllergens.length === 1 ? `Contains traces of "${foundAllergens[0]}"` : `Contains traces of ${foundAllergens.length} allergens`;
        resultContent.innerHTML = `
            <div class="result-icon">⚠</div>
            <div class="result-title">WARNING</div>
            <div class="result-message">Product "<strong>${data.productName}</strong>" ${warningMessage}</div>
            <div class="result-note danger-note">⚠ Please avoid consuming this product</div>
            ${allergenListHTML}
        `;
    }
    resultContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

const productDatabase = {
    'Chocolate': ['Milk', 'Peanuts', 'Nuts'],
    'Cake': ['Eggs', 'Milk', 'Wheat'],
    'Bread': ['Wheat'],
    'Yogurt': ['Milk'],
    'Salmon': ['Fish'],
    'Fish': ['Fish'],
    'Milk': ['Milk'],
    'Eggs': ['Eggs'],
    'Peanuts': ['Peanuts'],
    'Tahini': ['Sesame'],
    'Soy Sauce': ['Soy'],
    'Soy': ['Soy'],
    'Cheese': ['Milk'],
    'Butter': ['Milk'],
    'Cream': ['Milk'],
    'Ice Cream': ['Milk'],
    'Cookies': ['Wheat', 'Eggs'],
    'Pasta': ['Wheat'],
    'Noodles': ['Wheat']
};

function updateProductSuggestions() {
    const productInput = document.getElementById('productName');
    const suggestionsList = document.getElementById('productSuggestions');
    const inputValue = productInput.value.trim().toLowerCase();
    suggestionsList.innerHTML = '';
    if (inputValue.length > 0) {
        const matches = Object.keys(productDatabase).filter(product =>
            product.toLowerCase().includes(inputValue) || inputValue.includes(product.toLowerCase())
        );
        matches.slice(0, 5).forEach(product => {
            const option = document.createElement('option');
            option.value = product;
            suggestionsList.appendChild(option);
        });
    }
}

function performLocalCheck(productName, userAllergens) {
    const productLower = productName.toLowerCase().trim();
    let foundAllergens = [];
    for (const [product, allergens] of Object.entries(productDatabase)) {
        const productLowerKey = product.toLowerCase();
        if (productLower.includes(productLowerKey) || productLowerKey.includes(productLower)) {
            foundAllergens = foundAllergens.concat(allergens);
        }
    }
    userAllergens.forEach(allergen => {
        const allergenLower = allergen.toLowerCase();
        if (productLower.includes(allergenLower) || allergenLower.includes(productLower)) {
            if (!foundAllergens.includes(allergen)) foundAllergens.push(allergen);
        }
    });
    foundAllergens = [...new Set(foundAllergens)];
    const matchingAllergens = foundAllergens.filter(a => userAllergens.includes(a));
    displayResult({
        productName,
        safe: matchingAllergens.length === 0,
        foundAllergens: matchingAllergens
    }, userAllergens);
}

function validateBeforeCheck() {
    const userName = document.getElementById('userName').value.trim();
    const productName = document.getElementById('productName').value.trim();
    const checkboxes = document.querySelectorAll('.allergen-checkbox:checked');
    const userAllergens = Array.from(checkboxes).map(cb => cb.value);
    const errors = [];
    if (!userName) { errors.push('Please enter your name first'); document.getElementById('userName').focus(); }
    if (!productName) { errors.push('Please enter product name'); }
    if (userAllergens.length === 0) errors.push('Please select at least one allergen');
    if (errors.length > 0) {
        const resultSection = document.getElementById('resultSection');
        const resultContent = document.getElementById('resultContent');
        resultSection.style.display = 'block';
        resultContent.className = 'result-box result-error';
        resultContent.innerHTML = `<div class="result-icon">ℹ</div><div class="result-title">Notice</div><div class="result-message">${errors.join('<br>')}</div>`;
        resultContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    document.getElementById('checkBtn').addEventListener('click', () => { if (validateBeforeCheck()) checkProduct(); });
    document.getElementById('productName').addEventListener('keypress', e => { if (e.key === 'Enter' && validateBeforeCheck()) checkProduct(); });
    document.getElementById('productName').addEventListener('input', updateProductSuggestions);
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
    updateProductSuggestions();
});
