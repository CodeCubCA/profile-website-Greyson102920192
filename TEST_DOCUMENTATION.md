# Comprehensive Game Testing Documentation

## Overview
This testing suite provides complete coverage for all 9 HTML5 games in the portfolio:
1. Tetris
2. Snake
3. Pong
4. Memory Game
5. Breakout
6. Flappy Bird
7. Tic Tac Toe
8. Asteroids
9. Simon Says

## Test Files Created

### 1. `game-tests.html` - Interactive Test Suite
A comprehensive HTML-based testing interface that provides:
- Manual test checklists for each game
- Visual testing environment with embedded iframe
- Automated DOM and capability tests
- Performance monitoring tools
- Interactive checkboxes to track test completion

**How to use:**
1. Open `game-tests.html` in a web browser
2. Click "Load Game Page" to embed the games
3. Work through each game's checklist
4. Click checklist items to mark them as completed
5. Run automated tests with the "Run All Automated Tests" button

### 2. `game-tests.js` - Automated Test Suite
Jest-compatible test suite with 100+ automated tests covering:
- Game initialization
- Core mechanics
- Collision detection
- Scoring systems
- Game state management
- Performance metrics

**How to run:**
```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with detailed output
npm run test:verbose
```

### 3. `package.json` - Test Configuration
Provides npm scripts and Jest configuration for running automated tests.

## Test Categories

### Functional Tests
Each game has tests for:
- **Initialization**: Canvas creation, initial state, UI elements
- **Core Mechanics**: Game-specific logic and rules
- **User Controls**: Keyboard/mouse input handling
- **Scoring System**: Point calculation and display
- **Game States**: Start, pause, game over conditions
- **Visual Rendering**: Canvas drawing and animations

### Manual Test Procedures

#### Tetris Testing Checklist
1. **Start Game**
   - Verify canvas is 300x600 pixels
   - Check score displays "0"
   - Confirm Start button works

2. **Gameplay**
   - Test all 7 piece types appear
   - Verify pieces fall automatically
   - Test rotation (Up arrow)
   - Test left/right movement
   - Test soft drop (Down arrow)
   - Test hard drop (Space)

3. **Scoring**
   - Single line = 100 points
   - Tetris (4 lines) = 800 points total
   - Soft drop = 1 point/row
   - Hard drop = 2 points/row

4. **Game Over**
   - Fill board to top
   - Verify "Game Over!" message
   - Check controls disabled

#### Snake Testing Checklist
1. **Initialization**
   - 400x400 canvas
   - Snake at center
   - Food appears randomly
   - Grid lines visible

2. **Movement**
   - WASD keys work
   - Arrow keys work
   - Snake can't reverse into itself
   - Continuous movement

3. **Gameplay**
   - Eating food = +10 points
   - Snake grows when eating
   - New food spawns correctly
   - Food never on snake body

4. **Collisions**
   - Wall collision = game over
   - Self collision = game over
   - Alert shows score

#### Pong Testing Checklist
1. **Setup**
   - 600x300 canvas
   - Two paddles positioned correctly
   - Ball at center
   - Score display "Player: 0 | CPU: 0"

2. **Controls**
   - W moves paddle up
   - S moves paddle down
   - Smooth movement
   - Paddle stays in bounds

3. **AI Testing**
   - CPU follows ball
   - CPU has realistic delay
   - CPU is beatable

4. **Scoring**
   - First to 7 wins
   - Winner announcement
   - Game stops at win

#### Memory Game Testing Checklist
1. **Grid Setup**
   - 4x4 grid (16 cards)
   - Cards show "?" initially
   - 8 unique emoji pairs

2. **Card Mechanics**
   - Click reveals emoji
   - Max 2 cards flipped
   - Non-matches flip back after 1 second
   - Matches stay revealed

3. **Win Condition**
   - 8 matches to win
   - Win alert appears
   - New Game shuffles cards

#### Breakout Testing Checklist
1. **Elements**
   - 480x320 canvas
   - 40 bricks (5x8)
   - Ball and paddle visible

2. **Controls**
   - A moves left
   - D moves right
   - Smooth paddle movement

3. **Physics**
   - Ball bounces correctly
   - Bricks disappear when hit
   - 10 points per brick

4. **Game Over**
   - Ball falls = game over
   - Score alert shown

#### Flappy Bird Testing Checklist
1. **Visuals**
   - 400x600 canvas
   - Sky gradient background
   - Bird and pipes render

2. **Controls**
   - Space/click to flap
   - Gravity effect works

3. **Pipes**
   - Random heights
   - 200px gap
   - Move left continuously

4. **Scoring**
   - +1 per pipe passed
   - Game over on collision

#### Tic Tac Toe Testing Checklist
1. **Board**
   - 3x3 grid
   - Cells clickable
   - Player is X, CPU is O

2. **Gameplay**
   - Click places X
   - CPU responds with O
   - 500ms CPU delay

3. **Win Detection**
   - Horizontal wins
   - Vertical wins
   - Diagonal wins
   - Tie detection

#### Asteroids Testing Checklist
1. **Ship Controls**
   - W for thrust
   - A/D for rotation
   - Space to shoot

2. **Mechanics**
   - Ship wraps at edges
   - Momentum/friction work
   - Bullets travel straight

3. **Asteroids**
   - 5 asteroids minimum
   - Random movement
   - Destroyed by bullets
   - 10 points each

#### Simon Says Testing Checklist
1. **Setup**
   - 4 colored buttons
   - 2x2 grid layout

2. **Sequence**
   - Pattern displays with flashes
   - 600ms between flashes
   - Can't click during display

3. **Gameplay**
   - Repeat pattern correctly
   - Each level adds 1 color
   - Wrong input = game over

## Performance Testing

### Frame Rate Testing
```javascript
// Add this to any game to monitor FPS
let lastTime = performance.now();
let frames = 0;

function checkFPS() {
    frames++;
    const currentTime = performance.now();

    if (currentTime >= lastTime + 1000) {
        console.log('FPS:', Math.round((frames * 1000) / (currentTime - lastTime)));
        frames = 0;
        lastTime = currentTime;
    }

    requestAnimationFrame(checkFPS);
}
```

### Memory Leak Detection
1. Open Chrome DevTools
2. Go to Memory tab
3. Take heap snapshot before playing
4. Play game for 5 minutes
5. Take another snapshot
6. Compare for memory growth

### Browser Compatibility
Test all games in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Common Issues to Check

### Critical Bugs
- [ ] Multiple games can't run simultaneously
- [ ] Game state doesn't reset properly
- [ ] Event listeners stack on restart
- [ ] Animation frames not cancelled
- [ ] Console errors during gameplay
- [ ] Memory not freed when switching games

### Visual Issues
- [ ] Canvas scaling on different screens
- [ ] Touch controls on mobile
- [ ] Responsive design breakpoints
- [ ] Game visibility in iframe

### Performance Issues
- [ ] Frame rate drops below 30 FPS
- [ ] Input lag > 100ms
- [ ] Memory usage grows continuously
- [ ] CPU usage excessive

## Test Execution Order

1. **Basic Functionality** (30 mins)
   - Load each game
   - Verify initial state
   - Test start/stop

2. **Gameplay Testing** (2 hours)
   - Play each game completely
   - Test all controls
   - Verify scoring
   - Check win/lose conditions

3. **Edge Cases** (1 hour)
   - Rapid input testing
   - Boundary conditions
   - Collision edge cases
   - Score overflow

4. **Performance** (30 mins)
   - FPS monitoring
   - Memory profiling
   - CPU usage check

5. **Compatibility** (1 hour)
   - Cross-browser testing
   - Mobile testing
   - Responsive design

## Reporting Issues

When reporting bugs, include:
1. Game name
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Browser/OS information
6. Console errors (if any)
7. Screenshots/recordings

## Automated Test Results

Expected test results:
- Total Tests: 100+
- Pass Rate: > 95%
- Coverage: > 70%
- Performance: 60 FPS target

## Quick Test Commands

```bash
# Run specific game tests
npm test -- --testNamePattern="Tetris"
npm test -- --testNamePattern="Snake"

# Generate coverage report
npm run test:coverage

# Open coverage report in browser
open coverage/lcov-report/index.html

# Start local server for manual testing
npm run serve
# Then open http://localhost:8000/game-tests.html
```

## Continuous Testing

For continuous integration, add to `.github/workflows/test.yml`:
```yaml
name: Game Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

## Summary

This comprehensive test suite ensures:
- All games function correctly
- Controls are responsive
- Scoring systems work
- Visual elements render properly
- Performance meets standards
- Cross-browser compatibility

Total testing time: ~5 hours for complete manual testing
Automated tests: < 1 minute execution time