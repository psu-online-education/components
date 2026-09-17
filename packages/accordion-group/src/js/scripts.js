/**
 * @file
 * Provides accordion handling for accordion groups based on data attributes.
 */
((cms) => {
  cms.attach('accordion-group', context => {
    const accordionGroups = cms.once('accordion-group', '.accordion-group', context);
    accordionGroups.forEach(group => {
      group.addEventListener('component:activate', e => {
        if (group.dataset.singleOpen !== 'true') return;

        const activatedAccordion = e.target.closest('.accordion');
        group.querySelectorAll('.accordion').forEach(child => {
          if (child !== activatedAccordion) {
            child.dispatchEvent(new CustomEvent('component:deactivate'));
          }
        });
      }, true);
    });
  });
})(cms);
