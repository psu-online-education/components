(cms => {
  cms.attach('program-tile', context => {
    const elements = context.querySelectorAll('.program-tile');
    elements.forEach(element => {
      const content = element.querySelector('.program-tile__content');
      const expand = element.querySelector('.program-tile__expand');

      element.addEventListener('component:activate', e => {
        content.removeAttribute('inert');
        cms.expand(content);
      });

      element.addEventListener('component:deactivate', e => {
        function afterCollapse() {
          content.removeEventListener('transitionend', afterCollapse);
          expand.focus();
        }
        content.addEventListener('transitionend', afterCollapse);
        content.setAttribute('inert', '');
        cms.collapse(content);
      });

      expand.addEventListener('click', () => {
        element.dispatchEvent(new CustomEvent('component:activate', {
          detail: {
            activation_type: 'USER_ACTIVATE',
          }
        }));
      });

      const collapse = element.querySelector('.program-tile__collapse');
      collapse.addEventListener('click', () => {
        element.dispatchEvent(new CustomEvent('component:deactivate'));
      });
    });
  });
})(cms);