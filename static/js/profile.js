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

document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    document.getElementById('userName').addEventListener('blur', saveUserData);
    document.getElementById('userName').addEventListener('input', function() {
        clearTimeout(window.userNameTimeout);
        window.userNameTimeout = setTimeout(saveUserData, 1000);
    });
    document.querySelectorAll('.allergen-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', saveUserData);
    });
});
