(function () {
    try {
        const savedTheme = localStorage.getItem('theme');
        const theme = savedTheme === 'dark' ? 'dark' : 'light';
        const root = document.documentElement;
        root.classList.remove('dark-mode', 'light-mode');
        root.classList.add(`${theme}-mode`);
        root.setAttribute('data-theme', theme);
    } catch (_) {
        document.documentElement.classList.add('light-mode');
        document.documentElement.setAttribute('data-theme', 'light');
    }
})();
