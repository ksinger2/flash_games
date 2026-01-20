/* =============================================
   90s STYLE BACKGROUND ANIMATION
   Lightning bolts, shapes, and retro vibes
   ============================================= */

(function() {
  const canvas = document.getElementById('hearts-bg');
  const ctx = canvas.getContext('2d');

  // Resize canvas to full window
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  // 90s Color palette - bright blue and purple
  const COLORS = [
    '#00ffff', // Cyan
    '#ff00ff', // Magenta
    '#9333ea', // Purple
    '#3b82f6', // Blue
    '#f0abfc', // Light pink
    '#67e8f9', // Light cyan
    '#a855f7', // Violet
    '#06b6d4', // Teal
  ];

  // Shape types
  const SHAPE_TYPES = ['lightning', 'star', 'triangle', 'circle', 'zigzag', 'diamond'];

  // Shapes array
  const shapes = [];
  const NUM_SHAPES = 30;

  // Create a shape
  function createShape() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 15 + Math.random() * 40,
      type: SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: (Math.random() - 0.5) * 1.5,
      alpha: 0.3 + Math.random() * 0.4,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
    };
  }

  // Initialize shapes
  for (let i = 0; i < NUM_SHAPES; i++) {
    shapes.push(createShape());
  }

  // Draw lightning bolt
  function drawLightning(x, y, size, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.3, -size * 0.2);
    ctx.lineTo(0, -size * 0.1);
    ctx.lineTo(size * 0.4, size);
    ctx.lineTo(-size * 0.1, size * 0.1);
    ctx.lineTo(0, size * 0.3);
    ctx.lineTo(-size * 0.3, -size);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Draw star
  function drawStar(x, y, size, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const r = i === 0 ? size : size;
      if (i === 0) {
        ctx.moveTo(Math.cos(angle) * size, Math.sin(angle) * size);
      } else {
        ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
      }
      const innerAngle = angle + (2 * Math.PI) / 10;
      ctx.lineTo(Math.cos(innerAngle) * size * 0.4, Math.sin(innerAngle) * size * 0.4);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Draw triangle
  function drawTriangle(x, y, size, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.866, size * 0.5);
    ctx.lineTo(-size * 0.866, size * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Draw circle
  function drawCircle(x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw zigzag
  function drawZigzag(x, y, size, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.lineWidth = size * 0.15;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(-size, -size * 0.5);
    ctx.lineTo(-size * 0.3, size * 0.5);
    ctx.lineTo(size * 0.3, -size * 0.5);
    ctx.lineTo(size, size * 0.5);
    ctx.stroke();
    ctx.restore();
  }

  // Draw diamond
  function drawDiamond(x, y, size, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.6, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.6, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Draw shape based on type
  function drawShape(shape) {
    const pulseAlpha = shape.alpha + Math.sin(shape.pulse) * 0.15;
    ctx.globalAlpha = Math.max(0.1, Math.min(0.8, pulseAlpha));
    ctx.fillStyle = shape.color;
    ctx.strokeStyle = shape.color;

    switch(shape.type) {
      case 'lightning':
        drawLightning(shape.x, shape.y, shape.size, shape.rotation);
        break;
      case 'star':
        drawStar(shape.x, shape.y, shape.size, shape.rotation);
        break;
      case 'triangle':
        drawTriangle(shape.x, shape.y, shape.size, shape.rotation);
        break;
      case 'circle':
        drawCircle(shape.x, shape.y, shape.size);
        break;
      case 'zigzag':
        drawZigzag(shape.x, shape.y, shape.size, shape.rotation);
        break;
      case 'diamond':
        drawDiamond(shape.x, shape.y, shape.size, shape.rotation);
        break;
    }
  }

  // Update shape position
  function updateShape(shape) {
    shape.x += shape.speedX;
    shape.y += shape.speedY;
    shape.rotation += shape.rotationSpeed;
    shape.pulse += shape.pulseSpeed;

    // Wrap around screen
    if (shape.x < -50) shape.x = canvas.width + 50;
    if (shape.x > canvas.width + 50) shape.x = -50;
    if (shape.y < -50) shape.y = canvas.height + 50;
    if (shape.y > canvas.height + 50) shape.y = -50;
  }

  // Draw grid lines (90s style)
  let gridOffset = 0;
  function drawGrid() {
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 1;

    const gridSize = 60;
    gridOffset = (gridOffset + 0.3) % gridSize;

    // Horizontal lines
    for (let y = gridOffset; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Vertical lines
    for (let x = gridOffset; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
  }

  // Animation loop
  function animate() {
    // Dark purple/blue gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0f0a1a');
    gradient.addColorStop(0.5, '#1a0a2e');
    gradient.addColorStop(1, '#0a1628');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw moving grid
    drawGrid();

    // Update and draw shapes
    ctx.globalAlpha = 1;
    shapes.forEach(shape => {
      updateShape(shape);
      drawShape(shape);
    });

    requestAnimationFrame(animate);
  }

  // Start animation
  animate();
})();
