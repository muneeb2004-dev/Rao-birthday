const revealItems = document.querySelectorAll('.reveal');
const confettiBtn = document.getElementById('confettiBtn');
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
const friendPhoto = document.getElementById('friendPhoto');
const photoWrap = document.getElementById('photoWrap');
const photoCaption = photoWrap ? photoWrap.querySelector('figcaption') : null;

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${index * 90}ms`;
  observer.observe(item);
});

function setupPhotoFallback() {
  if (!friendPhoto) {
    return;
  }

  const candidates = [
    'WhatsApp Image 2026-03-16 at 1.20.42 AM.jpeg',
    'assets/friend.jpg',
    'assets/friend.jpeg',
    'assets/friend.png',
    'friend.jpg',
    'friend.jpeg',
    'friend.png',
  ];

  let index = 0;

  const tryNext = () => {
    if (index >= candidates.length) {
      if (photoWrap) {
        photoWrap.classList.add('image-missing');
      }
      if (photoCaption) {
        photoCaption.textContent = 'Add photo as assets/friend.jpg';
      }
      return;
    }

    friendPhoto.src = candidates[index];
    index += 1;
  };

  friendPhoto.addEventListener('load', () => {
    if (photoWrap) {
      photoWrap.classList.remove('image-missing');
    }
    if (photoCaption) {
      photoCaption.textContent = 'RAO ZAIN | Legend Mode: ON';
    }
  });

  friendPhoto.addEventListener('error', tryNext);
  tryNext();
}

let confettiPieces = [];
let animationId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createConfetti() {
  const colors = ['#ea5a2a', '#f2ba49', '#2b8a78', '#f06d7a', '#9f7aea', '#ffffff'];
  confettiPieces = Array.from({ length: 220 }, () => ({
    x: random(0, canvas.width),
    y: random(-canvas.height, 0),
    size: random(4, 10),
    speedY: random(1.2, 4.3),
    speedX: random(-1.4, 1.4),
    rotation: random(0, Math.PI * 2),
    spin: random(-0.06, 0.06),
    color: colors[Math.floor(random(0, colors.length))],
  }));
}

function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettiPieces.forEach((piece) => {
    piece.y += piece.speedY;
    piece.x += piece.speedX;
    piece.rotation += piece.spin;

    if (piece.y > canvas.height + 20) {
      piece.y = random(-120, -20);
      piece.x = random(0, canvas.width);
    }

    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.7);
    ctx.restore();
  });

  animationId = requestAnimationFrame(drawConfetti);
}

function startConfetti(durationMs = 4200) {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  createConfetti();
  drawConfetti();

  setTimeout(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, durationMs);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

confettiBtn.addEventListener('click', () => startConfetti(5000));

window.addEventListener('load', () => {
  setupPhotoFallback();
  startConfetti(2200);
});
