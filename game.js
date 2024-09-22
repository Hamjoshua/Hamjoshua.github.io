const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let isGameOver = false;

let giraffe = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.15,
    lift: -4,
    velocity: 0,
};

let pipes = [];
let frame = 0;
let score = 0;

// Объявление

function setup() {
    document.addEventListener("click", () => {
        giraffe.velocity = giraffe.lift;
    });
    setInterval(() => {
        if (isGameOver) {
            
        }
        if (frame % 25 === 0) {
            pipes.push(new Pipe());
        }
        frame++;
    }, 100);

    gameLoop();
}

function drawDebugger() {
    ctx.fillText("x: " + giraffe.x, 10, 40);
    ctx.fillText("y: " + giraffe.y, 10, 60);
    ctx.fillText("velocity: " + giraffe.velocity, 10, 80);
    ctx.fillText("gravity: " + giraffe.gravity, 10, 100);
    ctx.fillText("canvas-width: " + canvas.width, 10, 120);
    ctx.fillText("canvas-heigth: " + canvas.height, 10, 140);
    ctx.fillText("Game over: " + isGameOver, 10, 160);
}
function reloadGame() {
    document.location.reload();
}

function showGameWindow(text, buttonText, action) {    
    let gameWindow = document.createElement('div');
    gameWindow.className = "game-window";

    let header = document.createElement('p');
    header.textContent = text;
    gameWindow.appendChild(header);

    let button = document.createElement('button');
    button.textContent = buttonText;
    gameWindow.appendChild(button);
    button.className = "game-button";

    button.addEventListener('click', () => {
        action();
    })

    document.body.appendChild(gameWindow);
}

class Pipe {
    constructor() {
        this.top = Math.random() * (canvas.height / 2);
        this.bottom = Math.random() * (canvas.height / 2);
        this.x = canvas.width;
        this.width = 50;
        this.counted = false;
    }

    draw() {
        ctx.fillStyle = "#228B22"; // Цвет труб
        ctx.fillRect(this.x, 0, this.width, this.top);
        ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
    }

    update() {
        this.x -= 2; // Скорость движения труб
        if (!this.counted && this.x < giraffe.x) {
            score++;
            this.counted = true;
        }
    }

    offScreen() {
        return this.x < -this.width;
    }
}

function gameLoop() {
    
    canvas.width = window.innerWidth - 10;
    canvas.height = window.innerHeight - 10;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Обработка жирафа
    giraffe.velocity += giraffe.gravity;
    giraffe.y += giraffe.velocity;

    ctx.fillStyle = "#FFD700"; // Цвет жирафа
    ctx.fillRect(giraffe.x, giraffe.y, giraffe.width, giraffe.height);

    if (giraffe.y < 0 || giraffe.y + giraffe.height > canvas.height) {
        isGameOver = true;       
    }

    // Обработка труб
    pipes.forEach((pipe) => {
        pipe.draw();
        pipe.update();

        // Проверка на столкновение с трубами
        if (pipe.x < giraffe.x + giraffe.width && pipe.x + pipe.width > giraffe.x &&
            (giraffe.y < pipe.top || giraffe.y + giraffe.height > canvas.height - pipe.bottom)) {
            isGameOver = true;                 
        }
    });

    // Удаление труб
    pipes = pipes.filter(pipe => !pipe.offScreen());

    // Отображение счета
    ctx.fillStyle = "#FFF"; // Цвет текста
    ctx.font = "20px Arial";
    ctx.fillText("Счет: " + score, 10, 20);
    drawDebugger();

    if (isGameOver) {        
        showGameWindow("Жирафик упал. Жалко жирафа...", "ЗАНОВО", reloadGame);
    }
    else {
        requestAnimationFrame(gameLoop);
    }    
}

// Запуск
setup();