// chatbot.js - Enhanced chatbot untuk MIVO

class MIVOChatbot {
    constructor() {
        this.isOpen = false;
        this.chatHistory = JSON.parse(localStorage.getItem('mivoChatHistory')) || [];
        this.init();
    }

    init() {
        this.setupDOM();
        this.setupEventListeners();
        this.renderChatHistory();
    }

    setupDOM() {
        this.toggleBtn = document.getElementById('chatbot-toggle');
        this.chatbox = document.getElementById('chatbox');
        this.chatBody = document.getElementById('chat-body');
        this.chatInput = document.getElementById('chat-input');
        this.chatSend = document.getElementById('chat-send');
        this.chatClose = document.getElementById('chat-close');
    }

    setupEventListeners() {
        this.toggleBtn.addEventListener('click', () => this.toggleChat());
        this.chatClose.addEventListener('click', () => this.closeChat());
        this.chatSend.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.chatbox.contains(e.target) && !this.toggleBtn.contains(e.target)) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.openChat();
        } else {
            this.closeChat();
        }
    }

    openChat() {
        this.chatbox.classList.remove('hidden');
        this.chatInput.focus();
        this.scrollToBottom();
    }

    closeChat() {
        this.chatbox.classList.add('hidden');
        this.isOpen = false;
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage('user', message);
        this.chatInput.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Get bot response
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.getBotResponse(message);
            this.addMessage('bot', response);
            this.saveChatHistory();
        }, 1000 + Math.random() * 1000); // Simulate typing delay
    }

    addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${sender}`;
        
        const timestamp = new Date().toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${this.escapeHtml(text)}</div>
                <div class="message-time">${timestamp}</div>
            </div>
        `;

        this.chatBody.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message message-bot typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        this.chatBody.appendChild(typingDiv);
        this.scrollToBottom();
        this.typingIndicator = typingDiv;
    }

    hideTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.remove();
            this.typingIndicator = null;
        }
    }

    getBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Greetings
        if (this.containsAny(message, ['halo', 'hai', 'hi', 'hello', 'selamat'])) {
            return "Halo! Saya Asisten MIVO. Senang bisa membantu Anda! Ada yang bisa saya bantu tentang energi laut, biogas, atau produk kami?";
        }

        // Products
        if (this.containsAny(message, ['biogas', 'gas', 'energi', 'bahan bakar'])) {
            return "Reaktor Biogas Laut kami mengubah limbah perikanan menjadi energi biogas yang bisa digunakan untuk memasak dan kebutuhan energi lainnya. Prosesnya ramah lingkungan dan efisien!";
        }

        if (this.containsAny(message, ['biooil', 'bio-oil', 'minyak', 'bahan bakar cair'])) {
            return "BioOil Converter menggunakan teknologi pirolisis untuk mengubah biomassa laut menjadi bio-oil berkualitas. Cocok untuk industri dan memiliki nilai ekonomi tinggi!";
        }

        if (this.containsAny(message, ['pupuk', 'fertilizer', 'tanaman', 'pertanian'])) {
            return "Pupuk Cair Laut adalah produk sampingan dari proses biogas yang kaya nutrisi. Sangat baik untuk pertanian pesisir dan tambak!";
        }

        // Technology
        if (this.containsAny(message, ['teknologi', 'cara kerja', 'proses', 'bagaimana'])) {
            return "Teknologi MIVO menggunakan proses anaerobic digestion untuk biogas dan pirolisis untuk bio-oil. Semua proses dirancang khusus untuk kondisi pesisir Indonesia.";
        }

        // Locations
        if (this.containsAny(message, ['lokasi', 'dimana', 'alamat', 'tempat'])) {
            return "Kami beroperasi di Desa Lontar (unit produksi) dan UPI Kampus Serang (pusat riset). Lihat peta lokasi untuk detail lebih lanjut!";
        }

        // Collaboration
        if (this.containsAny(message, ['kerjasama', 'kolaborasi', 'mitra', 'partnership'])) {
            return "Kami terbuka untuk kerjasama dengan komunitas, pemerintah, dan swasta. Hubungi kami melalui halaman kontak untuk diskusi lebih lanjut!";
        }

        // Benefits
        if (this.containsAny(message, ['manfaat', 'keuntungan', 'kelebihan', 'keunggulan'])) {
            return "Manfaat teknologi MIVO: 1) Mengurangi pencemaran limbah, 2) Menghasilkan energi terbarukan, 3) Menciptakan ekonomi sirkular, 4) Memberdayakan masyarakat pesisir!";
        }

        // Default response
        return "Maaf, saya belum sepenuhnya memahami pertanyaan Anda. Bisa tanyakan tentang: produk biogas, bio-oil, pupuk cair, lokasi operasional, atau cara kerjasama dengan MIVO?";
    }

    containsAny(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    scrollToBottom() {
        this.chatBody.scrollTop = this.chatBody.scrollHeight;
    }

    renderChatHistory() {
        this.chatBody.innerHTML = '';
        
        // Add welcome message if no history
        if (this.chatHistory.length === 0) {
            this.addMessage('bot', 'Halo! Saya Asisten MIVO. Ada yang bisa saya bantu tentang energi laut dan produk kami?');
        } else {
            this.chatHistory.forEach(msg => {
                this.addMessage(msg.sender, msg.text);
            });
        }
    }

    saveChatHistory() {
        const messages = Array.from(this.chatBody.querySelectorAll('.message'))
            .filter(msg => !msg.classList.contains('typing-indicator'))
            .map(msg => {
                const sender = msg.classList.contains('message-user') ? 'user' : 'bot';
                const text = msg.querySelector('.message-text').textContent;
                return { sender, text };
            });

        // Keep only last 50 messages
        this.chatHistory = messages.slice(-50);
        localStorage.setItem('mivoChatHistory', JSON.stringify(this.chatHistory));
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mivoChatbot = new MIVOChatbot();
});

// Add chatbot styles
const chatbotStyles = `
    .message {
        margin-bottom: 1rem;
        display: flex;
    }

    .message-user {
        justify-content: flex-end;
    }

    .message-bot {
        justify-content: flex-start;
    }

    .message-content {
        max-width: 80%;
        padding: 0.75rem 1rem;
        border-radius: 1rem;
        position: relative;
    }

    .message-user .message-content {
        background: linear-gradient(135deg, #00b4d8, #005f8f);
        color: white;
        border-bottom-right-radius: 0.25rem;
    }

    .message-bot .message-content {
        background: #f1f5f9;
        color: #334155;
        border-bottom-left-radius: 0.25rem;
    }

    .message-text {
        margin-bottom: 0.25rem;
        line-height: 1.4;
    }

    .message-time {
        font-size: 0.75rem;
        opacity: 0.7;
        text-align: right;
    }

    .message-bot .message-time {
        text-align: left;
    }

    .typing-indicator .message-content {
        background: #f1f5f9;
        padding: 0.5rem 1rem;
    }

    .typing-dots {
        display: flex;
        gap: 0.25rem;
    }

    .typing-dots span {
        width: 0.5rem;
        height: 0.5rem;
        background: #64748b;
        border-radius: 50%;
        animation: typing 1.4s infinite ease-in-out;
    }

    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes typing {
        0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
        40% { transform: scale(1); opacity: 1; }
    }
`;

// Inject styles
if (!document.querySelector('#chatbot-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'chatbot-styles';
    styleSheet.textContent = chatbotStyles;
    document.head.appendChild(styleSheet);
}
