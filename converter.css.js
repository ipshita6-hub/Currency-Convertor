const exchangeRates = {
    USD: 1,
    EUR: 0.89,
    GBP: 0.76,
    JPY: 115.50,
    INR: 74.50,
    CNY: 6.36,
    KRW: 1200.50
};

const currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    INR: "₹",
    CNY: "¥",
    KRW: "₩"
};

export function initializeCurrencyConverter() {
    const elements = {
        amount: document.getElementById('amount'),
        fromCurrency: document.getElementById('from-currency'),
        toCurrency: document.getElementById('to-currency'),
        fromSearch: document.getElementById('from-search'),
        toSearch: document.getElementById('to-search'),
        swapBtn: document.getElementById('swap-btn'),
        convertBtn: document.getElementById('convert-btn'),
        result: document.getElementById('result'),
        resultAmount: document.querySelector('.result-amount'),
        resultRate: document.querySelector('.result-rate'),
        copyBtn: document.getElementById('copy-btn')
    };

    // Initialize currency dropdowns
    populateCurrencyDropdowns();

    // Event listeners
    elements.convertBtn.addEventListener('click', handleConversion);
    elements.swapBtn.addEventListener('click', swapCurrencies);
    elements.copyBtn.addEventListener('click', copyResult);
    elements.fromSearch.addEventListener('input', (e) => filterCurrencies(e, elements.fromCurrency));
    elements.toSearch.addEventListener('input', (e) => filterCurrencies(e, elements.toCurrency));
    elements.amount.addEventListener('input', validateAmount);

    function populateCurrencyDropdowns() {
        const currencies = Object.keys(exchangeRates);
        const createOption = (currency) => {
            const option = document.createElement('option');
            option.value = currency;
            option.textContent = `${currency} - ${currencySymbols[currency]}`;
            return option;
        };

        currencies.forEach(currency => {
            elements.fromCurrency.appendChild(createOption(currency));
            elements.toCurrency.appendChild(createOption(currency));
        });

        // Set default values
        elements.fromCurrency.value = 'USD';
        elements.toCurrency.value = 'EUR';
    }

    function filterCurrencies(event, select) {
        const searchTerm = event.target.value.toLowerCase();
        Array.from(select.options).forEach(option => {
            const text = option.textContent.toLowerCase();
            option.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }

    function validateAmount() {
        const amount = parseFloat(elements.amount.value);
        elements.convertBtn.disabled = isNaN(amount) || amount <= 0;
        elements.amount.classList.toggle('error', elements.convertBtn.disabled);
    }

    function handleConversion() {
        const amount = parseFloat(elements.amount.value);
        const fromCurrency = elements.fromCurrency.value;
        const toCurrency = elements.toCurrency.value;

        if (isNaN(amount) || amount <= 0) return;

        const convertedAmount = convert(amount, fromCurrency, toCurrency);
        const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];

        elements.resultAmount.textContent = formatCurrency(convertedAmount, toCurrency);
        elements.resultRate.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
        elements.result.classList.remove('hidden');

        // Save to history
        saveToHistory(amount, fromCurrency, toCurrency, convertedAmount);
    }

    function convert(amount, from, to) {
        const usdAmount = amount / exchangeRates[from];
        return usdAmount * exchangeRates[to];
    }

    function formatCurrency(amount, currency) {
        return `${currencySymbols[currency]}${amount.toFixed(2)} ${currency}`;
    }

    function swapCurrencies() {
        const temp = elements.fromCurrency.value;
        elements.fromCurrency.value = elements.toCurrency.value;
        elements.toCurrency.value = temp;
    }

    function copyResult() {
        const textToCopy = elements.resultAmount.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            elements.copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                elements.copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
            }, 2000);
        });
    }

    function saveToHistory(amount, from, to, convertedAmount) {
        const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
        history.unshift({
            timestamp: new Date().toISOString(),
            amount,
            from,
            to,
            convertedAmount,
            rate: exchangeRates[to] / exchangeRates[from]
        });
        localStorage.setItem('conversionHistory', JSON.stringify(history.slice(0, 10)));
        document.dispatchEvent(new CustomEvent('historyUpdated'));
    }
}
    // function goHome(){
    //     window.location.href = "//.index.html";
    // }
