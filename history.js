export function initializeHistory() {
    const elements = {
        historyBtn: document.getElementById('history-btn'),
        historyModal: document.getElementById('history-modal'),
        closeModal: document.querySelector('.close-modal'),
        historyList: document.querySelector('.history-list'),
        clearHistory: document.getElementById('clear-history'),
        historySearch: document.getElementById('history-search')
    };

    // Event listeners
    elements.historyBtn.addEventListener('click', openModal);
    elements.closeModal.addEventListener('click', closeModal);
    elements.clearHistory.addEventListener('click', clearHistory);
    elements.historySearch.addEventListener('input', filterHistory);
    document.addEventListener('historyUpdated', updateHistoryList);
    window.addEventListener('click', (e) => {
        if (e.target === elements.historyModal) closeModal();
    });

    function openModal() {
        elements.historyModal.classList.remove('hidden');
        updateHistoryList();
    }

    function closeModal() {
        elements.historyModal.classList.add('hidden');
    }

    function updateHistoryList() {
        const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
        renderHistory(history);
    }

    function renderHistory(history) {
        elements.historyList.innerHTML = history.map(item => `
            <div class="history-item">
                <div>
                    <div class="conversion-amount">
                        ${item.amount} ${item.from} → ${item.convertedAmount.toFixed(2)} ${item.to}
                    </div>
                    <div class="conversion-date text-light">
                        ${new Date(item.timestamp).toLocaleString()}
                    </div>
                </div>
                <div class="conversion-rate text-light">
                    1 ${item.from} = ${item.rate.toFixed(4)} ${item.to}
                </div>
            </div>
        `).join('');
    }

    function filterHistory(e) {
        const searchTerm = e.target.value.toLowerCase();
        const history = JSON.parse(localStorage.getItem('conversionHistory') || '[]');
        const filtered = history.filter(item => 
            item.from.toLowerCase().includes(searchTerm) ||
            item.to.toLowerCase().includes(searchTerm) ||
            item.amount.toString().includes(searchTerm) ||
            item.convertedAmount.toString().includes(searchTerm)
        );
        renderHistory(filtered);
    }

    function clearHistory() {
        if (confirm('Are you sure you want to clear all conversion history?')) {
            localStorage.removeItem('conversionHistory');
            updateHistoryList();
        }
    }
}