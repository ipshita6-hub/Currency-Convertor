import { initializeTheme } from './theme.js';
import { initializeCurrencyConverter } from './converter.js';
import { initializeHistory } from './history.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeCurrencyConverter();
    initializeHistory();
});