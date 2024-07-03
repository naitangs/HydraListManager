function loadTranslations(language) {
    return fetch(`lang/${language}.json`)
        .then(response => response.json())
        .catch(error => {
            console.error(`Error loading ${language} translations:`, error);
            return {};
        });
}

function applyTranslations(translations) {
    const elements = document.querySelectorAll('[id]');
    elements.forEach(element => {
        const key = element.id;
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
}

function changeLanguage(language) {
    loadTranslations(language).then(translations => {
        applyTranslations(translations);
        localStorage.setItem('language', language);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const savedLanguage = localStorage.getItem('language') || 'pt';
    changeLanguage(savedLanguage);
});
