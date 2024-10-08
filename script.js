// Variáveis do jogo
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20; // Tamanho de cada quadrado da cobra
let snake = [{ x: 9 * box, y: 10 * box }]; // Posição inicial da cobra
let direction = null; // Direção atual da cobra
let food = generateFood(); // Gera comida na inicialização
let score = 0; // Pontuação do jogo  
let speed = 200; // Velocidade inicial do jogo (milissegundos)
let game; // Armazena o intervalo do jogo
let isPaused = false; // Estado do jogo (pausado ou não)
let snakeName = 'Dr. Thiago'; // Nome inicial da cobra
let foodEaten = 0; // Contador de comidas comidas

// Função para ajustar o tamanho do canvas
function resizeCanvas() {
    canvas.width = Math.min(window.innerWidth * 0.9, 800); // Largura máxima de 800px
    canvas.height = Math.min(window.innerHeight * 0.9, 600); // Altura máxima de 600px
    food = generateFood(); // Regera a comida após redimensionar
}

// Função para iniciar ou reiniciar o jogo
function initGame() {
    snake = [{ x: 9 * box, y: 10 * box }]; // Posição inicial da cobra
    direction = null; // A direção não é definida até o jogador apertar uma tecla
    score = 0; // Reinicia a pontuação
    snakeName = 'Dr. Thiago'; // Reinicia o nome da cobra
    foodEaten = 0; // Reinicia o contador de comidas
    document.getElementById('score').innerText = 'Pontuação: ' + score; // Atualiza a pontuação na tela

    food = generateFood();

    // Se o jogo já estiver rodando, parar o intervalo antes de iniciar um novo
    if (game) clearInterval(game);

    // Reiniciar o loop do jogo
    game = setInterval(gameLoop, speed);
}

// Função para gerar comida em uma posição válida
function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box
        };
    } while (collision(newFood, snake)); // Gera nova comida se estiver colidindo com a cobra
    return newFood;
}

// Função para verificar colisão
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true; // Colidiu com o corpo da cobra
        }
    }
    return false; // Sem colisão
}

// Função do loop do jogo
function gameLoop() {
    if (isPaused) return; // Não faz nada se o jogo estiver pausado

    // Atualiza a posição da cobra
    const head = { x: snake[0].x, y: snake[0].y };

    // Muda a direção da cobra
    if (direction === 'LEFT') head.x -= box;
    if (direction === 'UP') head.y -= box;
    if (direction === 'RIGHT') head.x += box;
    if (direction === 'DOWN') head.y += box;

    // Verifica se a cobra comeu a comida
    if (head.x === food.x && head.y === food.y) {
        score++;
        foodEaten++; // Incrementa o contador de comidas
        food = generateFood(); // Gera nova comida
        document.getElementById('score').innerText = 'Pontuação: ' + score; // Atualiza a pontuação

        // Modifica o nome da cobra após comer a comida
        snakeName = 'Dr. Thiago'; // Nome novo
    } else {
        snake.pop(); // Remove a cauda se não comeu
    }

    // Verifica colisões
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || collision(head, snake)) {
        clearInterval(game); // Para o jogo se a cobra colidir com as bordas ou com ela mesma
        alert('Game Over! Sua pontuação foi: ' + score);
        return; // Termina o jogo
    }

    snake.unshift(head); // Adiciona a nova cabeça ao início do array

    // Limpa o canvas e desenha a cobra e a comida
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha a cobra
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? 'blue' : '#ADD8E6'; // A cabeça é azul, o corpo é azul claro
        ctx.beginPath(); // Começa um novo caminho
        ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2, 0, Math.PI * 2); // Desenha um círculo
        ctx.fill(); // Preenche o círculo

        // Desenha o nome da cobra
        ctx.fillStyle = 'black'; // Cor do texto
        ctx.font = 'bold 12px Arial'; // Define fonte e tamanho
        ctx.fillText(snakeName, snake[i].x, snake[i].y - 5); // Desenha o nome acima da cobra
    }

    // Desenha a comida
    ctx.fillStyle = 'green'; // Cor da comida
    ctx.fillRect(food.x, food.y, box, box);

    // Desenha o nome da comida
    ctx.fillStyle = 'black'; // Cor do texto
    ctx.font = 'bold 12px Arial'; // Define fonte e tamanho
    ctx.fillText('Dalmiran', food.x, food.y - 5); // Desenha o nome acima da comida
}

// Controle de teclas
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (event.key === 'ArrowUp' && direction !== 'DOWN') {
        direction = 'UP';
    } else if (event.key === 'ArrowRight' && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (event.key === 'ArrowDown' && direction !== 'UP') {
        direction = 'DOWN';
    }
});

// Controle de toque para dispositivos móveis
canvas.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    const x = touch.clientX - canvas.offsetLeft;
    const y = touch.clientY - canvas.offsetTop;

    // Detecta a direção com base na posição do toque
    if (x < canvas.width / 2) {
        direction = y < canvas.height / 2 ? 'UP' : 'DOWN'; // Para cima ou para baixo
    } else {
        direction = y < canvas.height / 2 ? 'UP' : 'DOWN'; // Para cima ou para baixo
        direction = (direction === 'UP' || direction === 'DOWN') ? 'RIGHT' : 'LEFT'; // Para direita ou esquerda
    }
});

// Controle dos botões de movimento
document.getElementById('moveLeft').addEventListener('click', () => {
    if (direction !== 'RIGHT') direction = 'LEFT';
});

document.getElementById('moveUp').addEventListener('click', () => {
    if (direction !== 'DOWN') direction = 'UP';
});

document.getElementById('moveRight').addEventListener('click', () => {
    if (direction !== 'LEFT') direction = 'RIGHT';
});

document.getElementById('moveDown').addEventListener('click', () => {
    if (direction !== 'UP') direction = 'DOWN';
});

// Botões de controle
document.getElementById('startBtn').addEventListener('click', initGame);
document.getElementById('pauseBtn').addEventListener('click', () => {
    isPaused = !isPaused; // Alterna o estado de pausa
    if (isPaused) {
        clearInterval(game); // Para o jogo se estiver pausado
    } else {
        game = setInterval(gameLoop, speed); // Reinicia o jogo
    }
});
document.getElementById('resetBtn').addEventListener('click', initGame); // Reinicia o jogo

// Redimensiona o canvas ao carregar a página
window.onload = () => {
    resizeCanvas();
    initGame(); // Inicia o jogo
};

// Função para aplicar as modificações nos botões
function applyButtonStyles() {
    const buttonSize = document.getElementById('buttonSize').value;
    const buttonX = document.getElementById('buttonX').value;
    const buttonY = document.getElementById('buttonY').value;

    // Seleciona todos os botões de movimento
    const buttons = [
        document.getElementById('moveLeft'),
        document.getElementById('moveRight'),
        document.getElementById('moveUp'),
        document.getElementById('moveDown'),
    ];

    // Aplica o tamanho e a posição nos botões
    buttons.forEach(button => {
        button.style.width = `${buttonSize}px`;
        button.style.height = `${buttonSize}px`;
        button.style.position = 'absolute'; // Definindo como absoluto para posicionar corretamente
        button.style.left = `${parseInt(buttonX)}px`; // Posição X
        button.style.top = `${parseInt(buttonY)}px`; // Posição Y
        button.style.opacity = '0.5'; // Torna os botões semi-transparentes
        button.style.backgroundColor = 'transparent'; // Botão transparente
    });
}

// Adiciona o evento ao botão "Aplicar"
document.getElementById('applyBtn').addEventListener('click', applyButtonStyles);


// Redimensiona o canvas quando a janela for redimensionada
window.onresize = resizeCanvas;
