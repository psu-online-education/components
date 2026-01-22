(cms => {
  cms.attach('program-tile-grid', context => {
    const elements = context.querySelectorAll('.program-tile-grid');
    elements.forEach(element => {
      element.addEventListener('component:activated', e => {
        console.log('expanded');
        e.target?.closest('.program-tile-grid__item')?.setAttribute('data-expanded', '');
      });

      element.addEventListener('component:deactivated', e => {
        e.target?.closest('.program-tile-grid__item')?.removeAttribute('data-expanded');
      });
    });
  });
})(cms);
