document.addEventListener('DOMContentLoaded', () => {
    // Words that trigger floating animation
    const floatTriggers = ['bubble', 'float', 'drift', 'cloud', 'rise'];
    
    // Words that trigger scramble effect
    const scrambleTriggers = ['chaos', 'random', 'glitch', 'scramble', 'static'];
    
    // Words that trigger glitch effect
    const glitchTriggers = ['error', 'bug', 'crash', 'malfunction', 'void'];

    function applyTextEffects() {
        const content = document.querySelector('.blog-content');
        if (!content) return;

        const text = content.innerHTML;
        
        // Apply float effect
        let newText = text.replace(
            new RegExp(`\\b(${floatTriggers.join('|')})\\b`, 'gi'),
            match => `<span class="float-text">${match}</span>`
        );

        // Apply scramble effect
        newText = newText.replace(
            new RegExp(`\\b(${scrambleTriggers.join('|')})\\b`, 'gi'),
            match => `<span class="scramble-text">${match}</span>`
        );

        // Apply glitch effect
        newText = newText.replace(
            new RegExp(`\\b(${glitchTriggers.join('|')})\\b`, 'gi'),
            match => `<span class="glitch-text">${match}</span>`
        );

        content.innerHTML = newText;
    }

    // Add random subtle effects to some words
    function addRandomEffects() {
        const paragraphs = document.querySelectorAll('.blog-content p');
        paragraphs.forEach(p => {
            const words = p.textContent.split(' ');
            const randomIndex = Math.floor(Math.random() * words.length);
            if (Math.random() > 0.7) { // 30% chance for random word effect
                words[randomIndex] = `<span class="scramble-text">${words[randomIndex]}</span>`;
                p.innerHTML = words.join(' ');
            }
        });
    }

    applyTextEffects();
    addRandomEffects();
}); 