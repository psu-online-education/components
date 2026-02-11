(cms => {
  cms.attach('program-tile-grid', context => {
    const elements = context.querySelectorAll('.program-tile-grid');
    elements.forEach(element => {

      // When an element inside the grid is activated, expand the item.
      element.addEventListener('component:activated', e => {
        e.target?.closest('.program-tile-grid__item')?.setAttribute('data-expanded', '');
      });

      // When an element inside the grid is deactivated, collapse the item.
      element.addEventListener('component:deactivated', e => {
        e.target?.closest('.program-tile-grid__item')?.removeAttribute('data-expanded');
      });
    });
  });
})(cms);
