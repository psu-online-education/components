((cms) => {
  cms.attach('program-tile', context => {
    const elements = context.querySelectorAll('.program-tile');
    elements.forEach(element => {
      const content = element.querySelector('.program-tile__content');
      if (content) {
        const details = content.closest('.program-tile__details');
        details.addEventListener('toggle', (e) => {
          details.style.transitionDuration = (!e?.detail?.disable_animation ? Math.min(Math.max(content.scrollHeight / 2, 200), 800) : 0) + 'ms';
          if (details.hasAttribute('open')) {
            details.setAttribute('data-open', '');
          }
          else if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            details.removeAttribute('data-open');
          }
        });
        content.addEventListener('transitionend', () => {
          if (!details.hasAttribute('open')) {
            details.removeAttribute('data-open');
          }
        });
      }
    });
  });
})(cms);