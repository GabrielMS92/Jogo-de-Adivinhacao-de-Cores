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
    key: 'neon_ranking_v3', 
    data: [],

    init() {
        const stored = localStorage.getItem(this.key);
        if (stored) {
            this.data = JSON.parse(stored);
        } else {
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

    // Verifica se a pontuação entra no Top 10
    isHighScore(score) {
        if (this.data.length < 10) return true;
        return score > this.data[this.data.length - 1].score;
    },

    // Retorna a posição (1-10) ou -1 se não estiver no rank
    getRankPosition(name) {
        const index = this.data.findIndex(p => p.name === name);
        return index !== -1 ? index + 1 : -1;
    },

    // Adiciona ou Atualiza Score
    addOrUpdateScore(name, score) {
        const cleanName = name || "Anônimo";
        
        // Verifica se o jogador já está no ranking para atualizar
        const existingIndex = this.data.findIndex(p => p.name === cleanName);
        
        if (existingIndex !== -1) {
            // Atualiza apenas se o novo score for maior
            if (score > this.data[existingIndex].score) {
                this.data[existingIndex].score = parseInt(score);
            }
        } else {
            // Adiciona novo
            this.data.push({ name: cleanName, score: parseInt(score) });
        }

        // Ordena e corta
        this.data.sort((a, b) => b.score - a.score);
        this.data = this.data.slice(0, 10);
        this.save();
        
        // Retorna a nova posição
        return this.getRankPosition(cleanName);
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
let score = 0;
let currentPlayerName = null; // MEMÓRIA DA SESSÃO: Guarda o nome do jogador atual

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
    score += streak;
    
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
        streak = 0; 
        
        // Mensagem padrão de derrota
        let gameOverMsg = `💀 Game Over! Era ${targetObj.pt.toUpperCase()}`;

        // LÓGICA INTELIGENTE DE RANKING
        if (score > 0 && RankingManager.isHighScore(score)) {
            
            // CASO 1: Já sabemos quem é o jogador (já salvou antes nesta sessão)
            if (currentPlayerName) {
                // Atualiza direto sem perguntar nome
                const newRank = RankingManager.addOrUpdateScore(currentPlayerName, score);
                
                if (newRank !== -1) {
                    gameOverMsg += `<br><span style="color:gold">🏆 Ranking Atualizado: Posição #${newRank}</span>`;
                } else {
                    gameOverMsg += `<br><span style="color:orange">⚠️ Você saiu do Top 10!</span>`;
                }
                
                els.displays.msg.innerHTML = gameOverMsg;
                endRound(false); // Apenas mostra botões, não muda de tela
            } 
            // CASO 2: Primeira vez entrando no Ranking (pede nome)
            else {
                els.displays.msg.textContent = gameOverMsg;
                endRound(false);
                setTimeout(() => {
                    els.displays.finalScore.textContent = score;
                    els.nameInput.value = ''; 
                    showScreen('save');
                }, 1500);
            }
        } else {
            // Não entrou no ranking
            els.displays.msg.innerHTML = gameOverMsg;
            endRound(false);
        }
    }
    updateUI(true);
}

function endRound(isWin) {
    els.input.disabled = true;
    els.btns.guess.disabled = true;
    els.btns.restart.classList.remove('hidden');
    
    els.displays.score.textContent = score;
    els.displays.streak.textContent = streak;

    if(isWin) {
        els.btns.restart.textContent = "Próxima Rodada ➝";
        els.btns.restart.style.backgroundColor = "#2ed573";
    } else {
        els.btns.restart.textContent = "Continuar (Score Mantido) ↻";
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
    // Salva o nome na memória da sessão
    currentPlayerName = els.nameInput.value.trim() || "Player";
    
    const rankPos = RankingManager.addOrUpdateScore(currentPlayerName, score);
    
    // Feedback visual imediato antes de mostrar a tabela
    alert(`Parabéns ${currentPlayerName}! Você entrou no Rank #${rankPos}`);
    
    updateRankingDisplay();
    showScreen('ranking');
});

els.btns.showRank.addEventListener('click', () => {
    updateRankingDisplay();
    showScreen('ranking');
});

els.btns.closeRank.addEventListener('click', () => {
    showScreen('game');
    if (attempts === 0) {
        initGame(); 
    }
});

function updateRankingDisplay() {
    els.displays.rankList.innerHTML = RankingManager.getHTMLList();
}

els.btns.guess.addEventListener('click', checkGuess);
els.btns.restart.addEventListener('click', initGame);
els.input.addEventListener('keypress', (e) => { if(e.key === 'Enter') checkGuess(); });

window.onload = initGame;
