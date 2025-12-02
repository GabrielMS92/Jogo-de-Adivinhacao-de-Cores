// --- 1. DADOS DE CORES ---
const colorData = [
    { name: 'red', pt: 'vermelho' }, { name: 'blue', pt: 'azul' },
    { name: 'green', pt: 'verde' }, { name: 'yellow', pt: 'amarelo' },
    { name: 'purple', pt: 'roxo' }, { name: 'orange', pt: 'laranja' },
    { name: 'pink', pt: 'rosa' }, { name: 'brown', pt: 'marrom' },
    { name: 'gray', pt: 'cinza' }, { name: 'cyan', pt: 'ciano' },
    { name: 'black', pt: 'preto' }, { name: 'white', pt: 'branco' },
    { name: 'gold', pt: 'dourado' }, { name: 'crimson', pt: 'carmesim' }
];

// --- 2. GERENCIADOR DE RANKING ---
const RankingManager = {
    key: 'neon_ranking_v2', // Mudei para v2 para forçar a atualização da lista
    data: [],

    init() {
        const stored = localStorage.getItem(this.key);
        if (stored) {
            this.data = JSON.parse(stored);
        } else {
            // Ranking Fictício (Guest = 1 ponto, conforme pedido)
            this.data = [
                { name: "NeonKing", score: 150 },
                { name: "ColorMaster", score: 120 },
                { name: "PixelArt", score: 100 },
                { name: "RGB_Pro", score: 80 },
                { name: "DaVinci", score: 60 },
                { name: "Artist", score: 40 },
                { name: "Palette", score: 25 },
                { name: "Brush", score: 10 },
                { name: "Novato", score: 5 },
                { name: "Guest", score: 1 }
            ];
            this.save();
        }
    },

    save() {
        localStorage.setItem(this.key, JSON.stringify(this.data));
    },

    isHighScore(score) {
        if (this.data.length < 10) return true;
        return score > this.data[this.data.length - 1].score;
    },

    addScore(name, score) {
        this.data.push({ name: name || "Anônimo", score: parseInt(score) });
        this.data.sort((a, b) => b.score - a.score);
        this.data = this.data.slice(0, 10);
        this.save();
    },

    getHTMLList() {
        return this.data.map((item, index) => `
            <li>
                <span>#${index + 1} ${item.name}</span>
                <span>${item.score} pts</span>
            </li>
        `).join('');
    }
};

// --- 3. ESTADO E DOM ---
let targetObj = null;
let attempts = 3;
let streak = 0;
let score = 0; // Acumula infinitamente

const els = {
    body: document.body,
    palette: document.getElementById('background-palette'),
    screens: {
        game: document.getElementById('game-screen'),
        save: document.getElementById('save-score-screen'),
        ranking: document.getElementById('ranking-screen')
    },
    input: document.getElementById('color-input'),
    nameInput: document.getElementById('player-name'),
    btns: {
        guess: document.getElementById('guess-btn'),
        restart: document.getElementById('restart-btn'),
        save: document.getElementById('save-btn'),
        showRank: document.getElementById('show-ranking-btn'),
        closeRank: document.getElementById('close-ranking-btn')
    },
    displays: {
        msg: document.getElementById('feedback-message'),
        attempts: document.getElementById('attempts-count'),
        streak: document.getElementById('streak-count'),
        score: document.getElementById('score-count'),
        finalScore: document.getElementById('final-score-display'),
        rankList: document.getElementById('ranking-list')
    }
};

// --- 4. FUNÇÕES DE NAVEGAÇÃO ---
function showScreen(screenName) {
    Object.values(els.screens).forEach(s => s.classList.add('hidden'));
    els.screens[screenName].classList.remove('hidden');
}

// --- 5. LÓGICA DO JOGO ---
function initGame() {
    targetObj = colorData[Math.floor(Math.random() * colorData.length)];
    attempts = 3;
    
    // NOTA: Não zeramos o 'score' aqui! Ele acumula.
    
    updateUI(false); 
    showScreen('game');
    
    els.palette.style.display = 'flex';
    els.body.style.backgroundColor = '#1a1a2e';

    generateBackgroundStripes();
    RankingManager.init();

    console.log(`🎯 Debug: ${targetObj.name}`);
}

function checkGuess() {
    const guess = els.input.value.trim().toLowerCase();
    if (!guess) return;

    if (guess === targetObj.name || guess === targetObj.pt) {
        handleWin();
    } else {
        handleLoss();
    }
}

function handleWin() {
    streak++; 
    score += streak; // Soma ao total acumulado
    
    els.palette.style.display = 'none';
    els.body.style.backgroundColor = targetObj.name;
    
    els.displays.msg.innerHTML = `✨ ACERTOU! <strong>${targetObj.pt.toUpperCase()}</strong>! (+${streak} pts)`;
    els.displays.msg.className = 'message-area msg-success';
    
    endRound(true);
}

function handleLoss() {
    attempts--;
    els.displays.attempts.textContent = attempts;
    
    els.input.classList.add('shake');
    setTimeout(() => els.input.classList.remove('shake'), 500);

    if (attempts > 0) {
        els.displays.msg.textContent = `❌ Tente de novo!`;
        els.displays.msg.className = 'message-area msg-error';
        els.input.value = '';
        els.input.focus();
    } else {
        // --- GAME OVER ---
        streak = 0; // Zera apenas o multiplicador de sequência
        // O SCORE NÃO É ZERADO! Continua o mesmo.
        
        els.displays.msg.textContent = `💀 Game Over! Era ${targetObj.pt.toUpperCase()}`;
        endRound(false);

        // Verifica Ranking com o Score Acumulado Atual
        if (score > 0 && RankingManager.isHighScore(score)) {
            setTimeout(() => {
                els.displays.finalScore.textContent = score;
                els.nameInput.value = ''; 
                showScreen('save');
            }, 1500);
        }
    }
    updateUI(true); // Atualiza score na tela
}

function endRound(isWin) {
    els.input.disabled = true;
    els.btns.guess.disabled = true;
    els.btns.restart.classList.remove('hidden');
    
    // Atualiza pontuação na tela
    els.displays.score.textContent = score;
    els.displays.streak.textContent = streak;

    if(isWin) {
        els.btns.restart.textContent = "Próxima Rodada ➝";
        els.btns.restart.style.backgroundColor = "#2ed573";
    } else {
        els.btns.restart.textContent = "Tentar Novamente (Score Mantido) ↻";
        els.btns.restart.style.backgroundColor = "#ff4757";
    }
}

function updateUI(isGameOver) {
    els.displays.attempts.textContent = attempts;
    els.displays.streak.textContent = streak;
    els.displays.score.textContent = score;
    
    if (!isGameOver) {
        els.displays.msg.textContent = "Qual é o seu palpite?";
        els.displays.msg.className = 'message-area';
        els.input.value = '';
        els.input.disabled = false;
        els.btns.guess.disabled = false;
        els.btns.restart.classList.add('hidden');
        els.input.focus();
    }
}

function generateBackgroundStripes() {
    els.palette.innerHTML = ''; 
    colorData.forEach(color => {
        const stripe = document.createElement('div');
        stripe.className = 'color-stripe';
        stripe.style.backgroundColor = color.name;
        stripe.addEventListener('click', () => {
            els.input.value = color.pt; 
            els.input.focus();
        });
        els.palette.appendChild(stripe);
    });
}

// --- 6. EVENTOS DE RANKING ---
els.btns.save.addEventListener('click', () => {
    const name = els.nameInput.value.trim() || "Player";
    RankingManager.addScore(name, score);
    
    // Mesmo após salvar, o score NÃO ZERA, permite continuar subindo no ranking
    // Se quiser zerar APÓS salvar, descomente a linha abaixo:
    // score = 0; streak = 0; 
    
    updateRankingDisplay();
    showScreen('ranking');
});

els.btns.showRank.addEventListener('click', () => {
    updateRankingDisplay();
    showScreen('ranking');
});

els.btns.closeRank.addEventListener('click', () => {
    showScreen('game');
    // Se estiver no "limbo" entre jogos (game over ou vitória), não reinicia sozinho
    if (attempts === 0) {
        initGame(); // Reinicia rodada mas mantém score
    }
});

function updateRankingDisplay() {
    els.displays.rankList.innerHTML = RankingManager.getHTMLList();
}

// Eventos
els.btns.guess.addEventListener('click', checkGuess);
els.btns.restart.addEventListener('click', initGame);
els.input.addEventListener('keypress', (e) => { if(e.key === 'Enter') checkGuess(); });

window.onload = initGame;