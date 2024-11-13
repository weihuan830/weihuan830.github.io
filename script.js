function createMatrixRain() {
    const matrixContainer = document.getElementById('matrix-rain');
    const characters = ['0', '1'];
    const numberOfDrops = 200;

    function createDrop() {
        const drop = document.createElement('div');
        drop.className = 'matrix-drop';
        
        // Random positioning with better distribution
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.top = `${Math.random() * 100}%`;
        
        // Random size (increased)
        const size = Math.floor(Math.random() * 10) + 20;
        drop.style.fontSize = `${size}px`;
        
        // Random opacity
        drop.style.opacity = Math.random() * 0.4 + 0.2;
        
        // Random character
        drop.innerText = characters[Math.floor(Math.random() * characters.length)];
        
        // Add random rotation animation
        drop.style.setProperty('--rotate-start', `${Math.random() * 360}deg`);
        drop.style.setProperty('--rotate-end', `${Math.random() * 360}deg`);
        
        // Random animation duration
        const duration = Math.random() * 8 + 6;
        drop.style.animationDuration = `${duration}s`;
        
        // Random delay for staggered start
        drop.style.animationDelay = `${Math.random() * 5}s`;

        drop.addEventListener('animationend', function() {
            drop.remove();
            createDrop();
        });

        matrixContainer.appendChild(drop);
    }

    // Create many more initial drops
    for (let i = 0; i < numberOfDrops; i++) {
        setTimeout(createDrop, Math.random() * 1000);
    }
}

// Start the animation when the page loads
document.addEventListener('DOMContentLoaded', createMatrixRain);

// Add periodic creation of new drops
setInterval(() => {
    if (document.getElementById('matrix-rain').children.length < 200) {
        createDrop();
    }
}, 1000); 
