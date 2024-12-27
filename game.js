// Enhanced Flappy Bird Game with Better UI and Features
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Declare the images once, and load them later.
const birdImage = new Image();
birdImage.src = 'bird.png'; // Add a bird image in your project directory

const bgImage = new Image();
bgImage.src = 'background.png'; // Add a background image with animations

const pipeImage = new Image();
pipeImage.src = 'pipe.png'; // Add pipe image for a better look

const pipeWidth = 50;
const pipeGap = 120;
const pipeSpeed = 2;

const bird = {
    x: 50,
    y: canvas.height / 2,
    radius: 15, // Visual radius for collision detection
    gravity: 0.5,
    lift: -8,
    velocity: 0,
    width: 34, // Adjust based on the bird image width
    height: 24, // Adjust based on the bird image height
};

const pipes = [];
let score = 0;
let highScore = 0;
let isGameOver = false;
let countdown = 3;
let showCountdown = true;

function createPipe() {
    const topHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 20)) + 10;
    const bottomHeight = canvas.height - pipeGap - topHeight;
    pipes.push({ x: canvas.width, topHeight, bottomHeight });
}

function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    isGameOver = false;
    countdown = 3;
    showCountdown = true;
    createPipe();
    startCountdown();
}

function startCountdown() {
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown === 0) {
            showCountdown = false;
            clearInterval(countdownInterval);
        }
    }, 1000);
}

function update() {
    if (isGameOver || showCountdown) return;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed;
    }

    if (pipes.length && pipes[0].x + pipeWidth < 0) {
        pipes.shift();
        score++;
        if (score > highScore) highScore = score;
    }

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        createPipe();
    }

    pipes.forEach(pipe => {
        if (
            bird.x + bird.width > pipe.x &&
            bird.x < pipe.x + pipeWidth &&
            (bird.y < pipe.topHeight || bird.y + bird.height > canvas.height - pipe.bottomHeight)
        ) {
            isGameOver = true;
        }
    });

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        isGameOver = true;
    }
}

function draw() {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height); // Draw background image

    if (showCountdown) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${countdown}`, canvas.width / 2, canvas.height / 2);
        return;
    }

    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    pipes.forEach(pipe => {
        ctx.drawImage(pipeImage, pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.drawImage(pipeImage, pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);
    });

    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`High Score: ${highScore}`, 10, 60);

    if (isGameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Game Over`, canvas.width / 2, canvas.height / 2 - 40);
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 + 20, 200, 50);
        ctx.fillStyle = '#000';
        ctx.fillText(`Retry`, canvas.width / 2, canvas.height / 2 + 55);
        return;
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isGameOver &&
        x > canvas.width / 2 - 100 && x < canvas.width / 2 + 100 &&
        y > canvas.height / 2 + 20 && y < canvas.height / 2 + 70
    ) {
        resetGame();
    } else if (!isGameOver && !showCountdown) {
        bird.velocity = bird.lift;
    }
}
// Add event listener for spacebar press
document.addEventListener('keydown', handleKeydown);

function handleKeydown(e) {
    if (isGameOver && e.key === ' ' ) {
        resetGame();
    } else if (!isGameOver && !showCountdown && e.key === ' ') {
        bird.velocity = bird.lift; // Spacebar makes the bird jump
    }
}


canvas.addEventListener('mousedown', handleClick);
canvas.addEventListener('touchstart', handleClick);

createPipe();
startCountdown();
loop();

// Load and verify images
let resourcesLoaded = 0;

birdImage.onload = () => checkResourcesLoaded('bird');
bgImage.onload = () => checkResourcesLoaded('background');
pipeImage.onload = () => checkResourcesLoaded('pipe');

function checkResourcesLoaded(resource) {
    resourcesLoaded++;
    console.log(`${resource} loaded`);
    if (resourcesLoaded === 3) {
        console.log("All resources loaded. Starting game.");
        startCountdown(); // Starts only when all resources are ready.
        loop();
    }
}
// Request fullscreen when the game starts
function enterFullscreen() {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.mozRequestFullScreen) { // Firefox
        canvas.mozRequestFullScreen();
    } else if (canvas.webkitRequestFullscreen) { // Chrome, Safari
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) { // IE
        canvas.msRequestFullscreen();
    }
}

// Optionally, call it when the page loads or the game starts
enterFullscreen();

// Optionally, handle window resizing if fullscreen is toggled
window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

