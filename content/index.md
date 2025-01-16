# Welcome to My Website

This is a simple, fast-loading website built with basic web technologies. No frameworks, no complexity - just clean, efficient code.

## Latest Blog Posts

- [Coming soon...]

## Get in Touch

Feel free to [contact me](/contact) or learn more [about me](/about).

<div class="brew-container">
  <h1 class="brew-title">Currently Brewing</h1>
  
  <div class="brew-grid">
    <div class="brew-item large">
      <span class="brew-status">Percolating</span>
      <h2>Neural Gardening</h2>
      <p>Teaching AI to appreciate dad jokes through interpretive dance</p>
      <div class="brew-progress"></div>
    </div>

    <div class="brew-item">
      <span class="brew-status">Steeping</span>
      <h2>Time Origami</h2>
      <p>Folding moments into paper cranes until they fly</p>
      <div class="brew-progress"></div>
    </div>

    <div class="brew-item accent">
      <span class="brew-status">Distilling</span>
      <h2>Quantum Doodling</h2>
      <p>Drawing in multiple dimensions simultaneously</p>
      <div class="brew-progress"></div>
    </div>

    <div class="brew-item">
      <span class="brew-status">Fermenting</span>
      <h2>Digital Archaeology</h2>
      <p>Excavating forgotten tabs from Chrome's ancient history</p>
      <div class="brew-progress"></div>
    </div>

  </div>

  <nav class="portal-links">
    <a href="/blog" class="portal-link">
      <span class="portal-icon">→</span>
      <div class="portal-text">
        <h3>Down the Rabbit Hole</h3>
        <p>Where thoughts go to multiply</p>
      </div>
    </a>
    
    <a href="/about" class="portal-link">
      <span class="portal-icon">←</span>
      <div class="portal-text">
        <h3>Into the Brain Archive</h3>
        <p>Warning: May contain traces of genius and/or madness</p>
      </div>
    </a>
    
    <a href="/contact" class="portal-link">
      <span class="portal-icon">↓</span>
      <div class="portal-text">
        <h3>Send Thought Signals</h3>
        <p>Telepathy currently in beta testing</p>
      </div>
    </a>
  </nav>
</div>

<button class="chaos-btn" title="Recalibrate Reality">↺</button>

<script>
// Brew progress animation
document.querySelectorAll('.brew-progress').forEach(progress => {
  progress.style.width = `${Math.random() * 60 + 40}%`;
});

// Floating elements
document.querySelectorAll('.brew-item').forEach(item => {
  let float = 0;
  setInterval(() => {
    float = Math.sin(Date.now() / 1000) * 5;
    item.style.transform = `translateY(${float}px)`;
  }, 50);
});

// Chaos generator with improved animation
document.querySelector('.chaos-btn').addEventListener('click', () => {
  document.querySelectorAll('.brew-item').forEach(item => {
    const randomX = Math.random() * 40 - 20;
    const randomY = Math.random() * 40 - 20;
    const randomRotate = Math.random() * 8 - 4;
    item.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
    setTimeout(() => item.style.transform = '', 1000);
  });
});

// Color theme based on time
function updateColors() {
  const hour = new Date().getHours();
  const hue = Math.floor((hour / 24) * 360);
  document.documentElement.style.setProperty('--accent', `hsl(${hue}, 80%, 65%)`);
}

updateColors();
setInterval(updateColors, 60000);
</script>
