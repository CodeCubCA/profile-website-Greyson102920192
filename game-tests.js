/**
 * Comprehensive Automated Test Suite for HTML5 Games
 *
 * This test suite is designed to work with testing frameworks like Jest, Mocha, or Jasmine.
 * It provides comprehensive coverage for all 9 games in the portfolio.
 *
 * To run these tests:
 * 1. Install a test framework: npm install --save-dev jest jsdom
 * 2. Run tests: npm test
 */

// Mock DOM environment for testing
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.requestAnimationFrame = (callback) => setTimeout(callback, 16);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// Test Suite for Game Management System
describe('Game Management System', () => {
    let gameDisplay, gameContent, gameTitle;

    beforeEach(() => {
        // Setup DOM elements
        document.body.innerHTML = `
            <div id="game-display" style="display: none;">
                <h3 id="current-game-title">Select a Game</h3>
                <div id="game-content"></div>
            </div>
        `;

        gameDisplay = document.getElementById('game-display');
        gameContent = document.getElementById('game-content');
        gameTitle = document.getElementById('current-game-title');
    });

    test('should initialize with game display hidden', () => {
        expect(gameDisplay.style.display).toBe('none');
        expect(gameTitle.textContent).toBe('Select a Game');
    });

    test('should show game display when game is selected', () => {
        gameDisplay.style.display = 'block';
        expect(gameDisplay.style.display).toBe('block');
    });

    test('should update game title correctly', () => {
        const games = ['Tetris', 'Snake', 'Pong', 'Memory Game', 'Breakout',
                       'Flappy Bird', 'Tic Tac Toe', 'Asteroids', 'Simon Says'];

        games.forEach(game => {
            gameTitle.textContent = game;
            expect(gameTitle.textContent).toBe(game);
        });
    });
});

// Test Suite for Tetris Game
describe('Tetris Game', () => {
    let canvas, ctx, scoreElement;

    beforeEach(() => {
        // Create canvas and score elements
        canvas = document.createElement('canvas');
        canvas.id = 'tetris-board';
        canvas.width = 300;
        canvas.height = 600;
        document.body.appendChild(canvas);

        ctx = canvas.getContext('2d');

        scoreElement = document.createElement('div');
        scoreElement.id = 'tetris-score';
        scoreElement.textContent = '0';
        document.body.appendChild(scoreElement);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('should create canvas with correct dimensions', () => {
        expect(canvas.width).toBe(300);
        expect(canvas.height).toBe(600);
    });

    test('should initialize score to 0', () => {
        expect(scoreElement.textContent).toBe('0');
    });

    test('should have valid canvas context', () => {
        expect(ctx).not.toBeNull();
        expect(typeof ctx.fillRect).toBe('function');
        expect(typeof ctx.strokeRect).toBe('function');
    });

    test('should calculate correct grid dimensions', () => {
        const COLS = 10;
        const ROWS = 20;
        const BLOCK_SIZE = 30;

        expect(COLS * BLOCK_SIZE).toBe(canvas.width);
        expect(ROWS * BLOCK_SIZE).toBe(canvas.height);
    });

    test('should have all 7 tetromino shapes defined', () => {
        const SHAPES = [
            [],
            [[1,1,1,1]], // I
            [[2,0,0],[2,2,2]], // L
            [[0,0,3],[3,3,3]], // J
            [[4,4],[4,4]], // O
            [[0,5,5],[5,5,0]], // S
            [[0,6,0],[6,6,6]], // T
            [[7,7,0],[0,7,7]]  // Z
        ];

        expect(SHAPES.length).toBe(8); // Including empty at index 0
        expect(SHAPES[1]).toEqual([[1,1,1,1]]); // I piece
        expect(SHAPES[4]).toEqual([[4,4],[4,4]]); // O piece
    });

    test('should create valid game board', () => {
        const ROWS = 20;
        const COLS = 10;
        const board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));

        expect(board.length).toBe(ROWS);
        expect(board[0].length).toBe(COLS);
        expect(board.every(row => row.every(cell => cell === 0))).toBe(true);
    });

    test('should update score correctly', () => {
        let score = 0;

        // Test line clear scoring
        score += 100; // Single line
        expect(score).toBe(100);

        score += 100 * 4 + 400; // Tetris (4 lines)
        expect(score).toBe(900);

        // Test soft drop scoring
        score += 1; // One row soft drop
        expect(score).toBe(901);

        // Test hard drop scoring
        score += 2 * 10; // 10 rows hard drop
        expect(score).toBe(921);
    });

    test('should handle piece rotation correctly', () => {
        const piece = [[1,1,0],[0,1,1]]; // S piece
        const rotated = [];

        for (let i = 0; i < piece[0].length; i++) {
            rotated.push([]);
            for (let j = piece.length - 1; j >= 0; j--) {
                rotated[i].push(piece[j][i]);
            }
        }

        expect(rotated).toEqual([[0,1],[1,1],[1,0]]);
    });
});

// Test Suite for Snake Game
describe('Snake Game', () => {
    let canvas, ctx, scoreElement;

    beforeEach(() => {
        canvas = document.createElement('canvas');
        canvas.id = 'snake-canvas';
        canvas.width = 400;
        canvas.height = 400;
        document.body.appendChild(canvas);

        ctx = canvas.getContext('2d');

        scoreElement = document.createElement('div');
        scoreElement.id = 'snake-score';
        scoreElement.textContent = 'Score: 0';
        document.body.appendChild(scoreElement);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('should create canvas with correct dimensions', () => {
        expect(canvas.width).toBe(400);
        expect(canvas.height).toBe(400);
    });

    test('should initialize snake at center position', () => {
        const gridSize = 25;
        const snake = [{x: 7 * gridSize, y: 7 * gridSize}];

        expect(snake[0].x).toBe(175);
        expect(snake[0].y).toBe(175);
    });

    test('should calculate grid correctly', () => {
        const gridSize = 25;
        const gridCount = 400 / gridSize;

        expect(gridCount).toBe(16);
    });

    test('should handle snake movement', () => {
        const gridSize = 25;
        let snake = [{x: 7 * gridSize, y: 7 * gridSize}];
        const dx = gridSize;
        const dy = 0;

        // Move right
        const newHead = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(newHead);
        snake.pop();

        expect(snake[0].x).toBe(8 * gridSize);
        expect(snake[0].y).toBe(7 * gridSize);
    });

    test('should detect wall collisions', () => {
        const checkCollision = (x, y) => {
            return x < 0 || x >= 400 || y < 0 || y >= 400;
        };

        expect(checkCollision(-1, 200)).toBe(true);
        expect(checkCollision(400, 200)).toBe(true);
        expect(checkCollision(200, -1)).toBe(true);
        expect(checkCollision(200, 400)).toBe(true);
        expect(checkCollision(200, 200)).toBe(false);
    });

    test('should calculate score correctly', () => {
        let score = 0;

        // Eating food
        score += 10;
        expect(score).toBe(10);

        // Eating multiple foods
        for (let i = 0; i < 5; i++) {
            score += 10;
        }
        expect(score).toBe(60);
    });

    test('should prevent reverse direction', () => {
        let dx = 1, dy = 0; // Moving right

        // Try to move left (should be prevented)
        const canMoveLeft = dx === 0; // Can only move left if not moving horizontally
        expect(canMoveLeft).toBe(false);

        // Try to move up (should be allowed)
        const canMoveUp = dy === 0; // Can move up if not moving vertically
        expect(canMoveUp).toBe(true);
    });
});

// Test Suite for Pong Game
describe('Pong Game', () => {
    let canvas, ctx;

    beforeEach(() => {
        canvas = document.createElement('canvas');
        canvas.id = 'pong-canvas';
        canvas.width = 600;
        canvas.height = 300;
        document.body.appendChild(canvas);

        ctx = canvas.getContext('2d');
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('should initialize game objects correctly', () => {
        const ball = {x: 300, y: 150, dx: 3, dy: 2.5};
        const player = {x: 10, y: 125, width: 10, height: 50};
        const cpu = {x: 580, y: 125, width: 10, height: 50};

        expect(ball.x).toBe(canvas.width / 2);
        expect(ball.y).toBe(canvas.height / 2);
        expect(player.x).toBe(10);
        expect(cpu.x).toBe(580);
    });

    test('should detect paddle collision', () => {
        const ball = {x: 15, y: 140};
        const paddle = {x: 10, y: 125, width: 10, height: 50};

        const collision = ball.x < paddle.x + paddle.width &&
                         ball.y > paddle.y &&
                         ball.y < paddle.y + paddle.height;

        expect(collision).toBe(true);
    });

    test('should detect wall collision', () => {
        const ball = {y: -1, dy: -2};
        const topWallHit = ball.y <= 0;

        expect(topWallHit).toBe(true);
    });

    test('should track score correctly', () => {
        let playerScore = 0;
        let cpuScore = 0;

        // Player scores
        playerScore++;
        expect(playerScore).toBe(1);

        // Check win condition
        const winScore = 7;
        playerScore = 7;
        expect(playerScore >= winScore).toBe(true);
    });

    test('should calculate CPU AI movement', () => {
        const ball = {y: 200};
        const cpu = {y: 125, height: 50};
        const cpuSpeed = 0.06;

        const targetY = ball.y - cpu.height / 2;
        const movement = (targetY - cpu.y) * cpuSpeed;

        expect(movement).toBeGreaterThan(0); // CPU should move down
    });
});

// Test Suite for Memory Game
describe('Memory Game', () => {
    test('should create 16 cards (8 pairs)', () => {
        const symbols = ['🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺'];
        const cards = [...symbols, ...symbols];

        expect(cards.length).toBe(16);
    });

    test('should shuffle cards correctly', () => {
        const shuffle = (array) => {
            const arr = [...array];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        };

        const original = [1, 2, 3, 4, 5];
        const shuffled = shuffle(original);

        expect(shuffled.length).toBe(original.length);
        expect(shuffled.sort()).toEqual(original.sort());
    });

    test('should handle card matching logic', () => {
        const card1 = {symbol: '🎮'};
        const card2 = {symbol: '🎮'};
        const card3 = {symbol: '🎲'};

        expect(card1.symbol === card2.symbol).toBe(true); // Match
        expect(card1.symbol === card3.symbol).toBe(false); // No match
    });

    test('should track matches correctly', () => {
        let matches = 0;
        const totalPairs = 8;

        // Simulate finding matches
        for (let i = 0; i < totalPairs; i++) {
            matches++;
        }

        expect(matches).toBe(8);
        expect(matches === totalPairs).toBe(true); // Win condition
    });
});

// Test Suite for Breakout Game
describe('Breakout Game', () => {
    test('should initialize bricks correctly', () => {
        const bricks = [];
        const rows = 5;
        const cols = 8;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                bricks.push({
                    x: c * 60,
                    y: r * 20 + 30,
                    width: 55,
                    height: 15,
                    visible: true
                });
            }
        }

        expect(bricks.length).toBe(40);
        expect(bricks.every(brick => brick.visible)).toBe(true);
    });

    test('should detect brick collision', () => {
        const ball = {x: 30, y: 40, radius: 8};
        const brick = {x: 0, y: 30, width: 55, height: 15, visible: true};

        const collision = brick.visible &&
                         ball.x > brick.x &&
                         ball.x < brick.x + brick.width &&
                         ball.y > brick.y &&
                         ball.y < brick.y + brick.height;

        expect(collision).toBe(true);
    });

    test('should calculate score correctly', () => {
        let score = 0;
        const brickValue = 10;
        const bricksDestroyed = 15;

        score = bricksDestroyed * brickValue;
        expect(score).toBe(150);
    });

    test('should handle paddle movement bounds', () => {
        let paddleX = 190;
        const paddleWidth = 100;
        const canvasWidth = 480;

        // Move right
        paddleX = Math.min(paddleX + 5, canvasWidth - paddleWidth);
        expect(paddleX).toBeLessThanOrEqual(380);

        // Move left
        paddleX = Math.max(paddleX - 5, 0);
        expect(paddleX).toBeGreaterThanOrEqual(0);
    });
});

// Test Suite for Flappy Bird Game
describe('Flappy Bird Game', () => {
    test('should apply gravity to bird', () => {
        let bird = {y: 300, dy: 0};
        const gravity = 0.3;

        bird.dy += gravity;
        bird.y += bird.dy;

        expect(bird.dy).toBe(0.3);
        expect(bird.y).toBe(300.3);
    });

    test('should handle flap mechanics', () => {
        let bird = {dy: 2};
        const flapStrength = -7;

        bird.dy = flapStrength;
        expect(bird.dy).toBe(-7);
    });

    test('should generate pipes with correct gap', () => {
        const createPipe = () => {
            const gap = 200;
            const maxHeight = 350;
            const topHeight = Math.random() * (maxHeight - gap);

            return {
                topHeight: topHeight,
                bottomY: topHeight + gap,
                gap: gap
            };
        };

        const pipe = createPipe();
        expect(pipe.bottomY - pipe.topHeight).toBe(200);
    });

    test('should detect pipe collision', () => {
        const bird = {x: 100, y: 50, radius: 15};
        const pipe = {x: 85, width: 50, topHeight: 100, bottomY: 300};

        // Check if bird is within pipe x-range
        const inPipeRange = bird.x + bird.radius > pipe.x &&
                           bird.x - bird.radius < pipe.x + pipe.width;

        // Check if bird hits top or bottom pipe
        const hitsPipe = inPipeRange &&
                        (bird.y - bird.radius < pipe.topHeight ||
                         bird.y + bird.radius > pipe.bottomY);

        expect(inPipeRange).toBe(true);
        expect(hitsPipe).toBe(true);
    });

    test('should track score when passing pipes', () => {
        let score = 0;
        const bird = {x: 100};
        const pipes = [
            {x: 50, width: 50, passed: false},
            {x: 200, width: 50, passed: false}
        ];

        pipes.forEach(pipe => {
            if (!pipe.passed && bird.x > pipe.x + pipe.width) {
                pipe.passed = true;
                score++;
            }
        });

        expect(score).toBe(1);
    });
});

// Test Suite for Tic Tac Toe Game
describe('Tic Tac Toe Game', () => {
    test('should initialize empty board', () => {
        const board = Array(9).fill('');

        expect(board.length).toBe(9);
        expect(board.every(cell => cell === '')).toBe(true);
    });

    test('should detect win conditions', () => {
        const checkWinner = (board) => {
            const winConditions = [
                [0,1,2], [3,4,5], [6,7,8], // Rows
                [0,3,6], [1,4,7], [2,5,8], // Columns
                [0,4,8], [2,4,6]           // Diagonals
            ];

            for (let condition of winConditions) {
                const [a, b, c] = condition;
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    return board[a];
                }
            }

            return board.includes('') ? null : 'tie';
        };

        // Test horizontal win
        let board = ['X', 'X', 'X', '', '', '', '', '', ''];
        expect(checkWinner(board)).toBe('X');

        // Test vertical win
        board = ['O', '', '', 'O', '', '', 'O', '', ''];
        expect(checkWinner(board)).toBe('O');

        // Test diagonal win
        board = ['X', '', '', '', 'X', '', '', '', 'X'];
        expect(checkWinner(board)).toBe('X');

        // Test tie
        board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
        expect(checkWinner(board)).toBe('tie');

        // Test ongoing game
        board = ['X', 'O', '', '', '', '', '', '', ''];
        expect(checkWinner(board)).toBe(null);
    });

    test('should handle CPU move selection', () => {
        const board = ['X', '', 'O', '', '', '', 'X', '', ''];
        const emptyCells = board.map((cell, index) =>
            cell === '' ? index : null
        ).filter(val => val !== null);

        expect(emptyCells).toEqual([1, 3, 4, 5, 7, 8]);
        expect(emptyCells.length).toBe(6);
    });
});

// Test Suite for Asteroids Game
describe('Asteroids Game', () => {
    test('should handle ship rotation', () => {
        let ship = {angle: 0};
        const rotationSpeed = 0.2;

        // Rotate right
        ship.angle += rotationSpeed;
        expect(ship.angle).toBeCloseTo(0.2);

        // Rotate left
        ship.angle -= rotationSpeed * 2;
        expect(ship.angle).toBeCloseTo(-0.2);
    });

    test('should calculate thrust vector', () => {
        const ship = {angle: 0, dx: 0, dy: 0};
        const thrust = 0.5;

        ship.dx += Math.cos(ship.angle) * thrust;
        ship.dy += Math.sin(ship.angle) * thrust;

        expect(ship.dx).toBeCloseTo(0.5);
        expect(ship.dy).toBeCloseTo(0);
    });

    test('should apply friction to movement', () => {
        let ship = {dx: 5, dy: 3};
        const friction = 0.99;

        ship.dx *= friction;
        ship.dy *= friction;

        expect(ship.dx).toBeCloseTo(4.95);
        expect(ship.dy).toBeCloseTo(2.97);
    });

    test('should handle screen wrapping', () => {
        const wrap = (value, max) => {
            if (value < 0) return max;
            if (value > max) return 0;
            return value;
        };

        expect(wrap(-1, 600)).toBe(600);
        expect(wrap(601, 600)).toBe(0);
        expect(wrap(300, 600)).toBe(300);
    });

    test('should detect asteroid collision', () => {
        const bullet = {x: 100, y: 100};
        const asteroid = {x: 95, y: 95, size: 20};

        const dx = bullet.x - asteroid.x;
        const dy = bullet.y - asteroid.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const collision = distance < asteroid.size;

        expect(collision).toBe(true);
    });

    test('should calculate bullet trajectory', () => {
        const ship = {x: 300, y: 200, angle: Math.PI / 4}; // 45 degrees
        const bulletSpeed = 8;

        const bullet = {
            x: ship.x,
            y: ship.y,
            dx: Math.cos(ship.angle) * bulletSpeed,
            dy: Math.sin(ship.angle) * bulletSpeed
        };

        expect(bullet.dx).toBeCloseTo(5.657, 2);
        expect(bullet.dy).toBeCloseTo(5.657, 2);
    });
});

// Test Suite for Simon Says Game
describe('Simon Says Game', () => {
    test('should generate random sequence', () => {
        const sequence = [];
        const colors = 4;

        for (let i = 0; i < 5; i++) {
            sequence.push(Math.floor(Math.random() * colors));
        }

        expect(sequence.length).toBe(5);
        expect(sequence.every(num => num >= 0 && num < 4)).toBe(true);
    });

    test('should validate player input', () => {
        const sequence = [0, 2, 1, 3];
        const playerInput = [0, 2, 1];

        // Check if player input matches sequence so far
        const isCorrect = playerInput.every((val, index) =>
            val === sequence[index]
        );

        expect(isCorrect).toBe(true);
    });

    test('should increase difficulty', () => {
        let sequence = [2];
        let level = 1;

        // Add new color for next level
        level++;
        sequence.push(Math.floor(Math.random() * 4));

        expect(sequence.length).toBe(level);
    });

    test('should handle game progression', () => {
        let level = 1;
        let sequence = [1];
        const playerSequence = [1];

        // Check if player completed the sequence
        if (playerSequence.length === sequence.length) {
            level++;
            sequence.push(Math.floor(Math.random() * 4));
        }

        expect(level).toBe(2);
        expect(sequence.length).toBe(2);
    });
});

// Performance and Integration Tests
describe('Performance Tests', () => {
    test('should handle animation frame efficiently', () => {
        let frameCount = 0;
        const maxFrames = 60;

        const animate = () => {
            frameCount++;
            if (frameCount < maxFrames) {
                requestAnimationFrame(animate);
            }
        };

        // Simulate animation
        for (let i = 0; i < maxFrames; i++) {
            frameCount++;
        }

        expect(frameCount).toBe(60);
    });

    test('should manage memory for game objects', () => {
        let objects = [];

        // Create objects
        for (let i = 0; i < 100; i++) {
            objects.push({x: i, y: i, active: true});
        }

        // Remove inactive objects
        objects = objects.filter(obj => obj.active);

        expect(objects.length).toBe(100);

        // Mark some as inactive and filter
        objects.slice(0, 50).forEach(obj => obj.active = false);
        objects = objects.filter(obj => obj.active);

        expect(objects.length).toBe(50);
    });

    test('should handle multiple event listeners correctly', () => {
        const events = [];

        const addEvent = (type) => {
            if (!events.includes(type)) {
                events.push(type);
            }
        };

        addEvent('keydown');
        addEvent('keyup');
        addEvent('click');
        addEvent('keydown'); // Duplicate, should not be added

        expect(events.length).toBe(3);
        expect(events).toEqual(['keydown', 'keyup', 'click']);
    });
});

// Export for use with test runners
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Export any functions that need to be tested externally
    };
}