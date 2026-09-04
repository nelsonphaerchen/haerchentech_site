document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Aplica o tema salvo anteriormente
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        if (toggleBtn) toggleBtn.textContent = '[Modo Escuro]';
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            
            let theme = 'dark';
            if (document.body.classList.contains('light-mode')) {
                theme = 'light';
                toggleBtn.textContent = '[Modo Escuro]';
            } else {
                toggleBtn.textContent = '[Modo Claro]';
            }

            localStorage.setItem('theme', theme);
        });
    }
});