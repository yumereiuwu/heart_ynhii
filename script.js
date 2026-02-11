// This script controls:
// - Falling hearts background
// - Small hearts when clicking anywhere
// - Scroll-down arrow button
// - Fade-in animation for memory cards & closing section when they appear in view

// Wait until the HTML has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const fallingContainer = document.getElementById("falling-hearts-container");
  const scrollArrow = document.getElementById("scroll-arrow");
  const memoriesSection = document.getElementById("memories");
  const bgMusic = document.getElementById("bg-music");
  // All elements that should fade in on scroll (cards + closing message)
  const revealItems = document.querySelectorAll(
    ".memory-card, .closing-section"
  );

  // Start creating falling hearts when the page loads
  startFallingHearts();

  // Try to autoplay background music (some browsers might block until user interaction)
  if (bgMusic) {
    bgMusic.volume = 0.45;
    bgMusic.play().catch(function () {
      // If autoplay is blocked, we'll start it on first user click instead.
    });
  }

  // Add a heart at the mouse click position
  document.addEventListener("click", function (event) {
    createClickHeart(event.clientX, event.clientY);

    // Also start music on first click if it didn't start automatically
    if (bgMusic && bgMusic.paused) {
      bgMusic.play().catch(function () {});
    }
  });

  // Scroll smoothly to the memories section when the arrow is clicked
  if (scrollArrow && memoriesSection) {
    scrollArrow.addEventListener("click", function () {
      memoriesSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Make cards & closing message fade/slide in when they appear on screen
  setupRevealOnScroll(revealItems);

  /**
   * Creates and starts the loop that generates falling hearts.
   * Hearts are created at random positions with different sizes and speeds.
   */
  function startFallingHearts() {
    // Use setInterval for a simple "student-style" loop.
    // Interval is around 400–800 ms to keep it soft and not too busy.
    setInterval(function () {
      createFallingHeart();
    }, getRandomNumber(400, 800));
  }

  /**
   * Create one falling heart element and animate it down the screen.
   */
  function createFallingHeart() {
    const heart = document.createElement("span");
    heart.classList.add("falling-heart");

    // Use the heart symbol. You can change this to another symbol if you like.
    heart.textContent = "❤";

    // Random horizontal starting position (0% to 100% of the screen width)
    const randomLeft = Math.random() * 100;
    heart.style.left = randomLeft + "vw";

    // Random size: between 12px and 26px feels soft and varied
    const randomSize = getRandomNumber(12, 26);
    heart.style.fontSize = randomSize + "px";

    // Random duration: slower looks more romantic (8s to 14s)
    const randomDuration = getRandomNumber(8, 14);
    heart.style.animationDuration = randomDuration + "s";

    // When the animation ends, remove the heart from the DOM so it doesn't pile up
    heart.addEventListener("animationend", function () {
      heart.remove();
    });

    // Add the heart to the container so it becomes visible
    fallingContainer.appendChild(heart);
  }

  /**
   * Create a small heart where the user clicks, then let it fade out.
   */
  function createClickHeart(x, y) {
    const heart = document.createElement("span");
    heart.classList.add("click-heart");
    heart.textContent = "❤";

    // Position at the click location
    heart.style.left = x + "px";
    heart.style.top = y + "px";

    // After the animation is done, remove the heart element
    heart.addEventListener("animationend", function () {
      heart.remove();
    });

    document.body.appendChild(heart);
  }

  /**
   * Make elements fade in when they enter the viewport.
   * Uses IntersectionObserver if available, otherwise falls back to a simple scroll listener.
   */
  function setupRevealOnScroll(elements) {
    if (!elements || elements.length === 0) return;

    // If the browser supports IntersectionObserver, use it (cleaner + more efficient)
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              // Once visible, we don't need to observe it anymore
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.2, // Card is 20% visible before animating in
        }
      );

      elements.forEach((el) => observer.observe(el));
    } else {
      // Fallback for very old browsers: simple scroll listener
      function revealOnScroll() {
        const windowHeight = window.innerHeight;
        elements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.top < windowHeight * 0.8) {
            el.classList.add("visible");
          }
        });
      }

      window.addEventListener("scroll", revealOnScroll);
      revealOnScroll(); // Run once at start
    }
  }

  /**
   * Returns a random integer between min and max (both inclusive).
   * Example: getRandomNumber(5, 10) -> a value between 5 and 10.
   */
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
});

