import { locales } from './locales.js';

let currentLocale = 'en';

export function setLocale(locale) {
    if (locales[locale]) {
        currentLocale = locale;
        translatePage();
    }
}

export function t(key, params = {}) {
    let text = locales[currentLocale][key] || key;
    for (const [param, value] of Object.entries(params)) {
        text = text.replace(`{${param}}`, value);
    }
    return text;
}

export function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });
}

export function getLocale() {
    return currentLocale;
}
