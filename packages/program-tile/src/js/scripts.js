(cms => {
  cms.attach('program-tile', context => {
    const elements = context.querySelectorAll('.program-tile');
    elements.forEach(element => {
      const content = element.querySelector('.program-tile__content');
      const content_top = content.querySelector('.program-tile__content-top');
      const expand = element.querySelector('.program-tile__expand');

      element.addEventListener('component:activate', e => {
        content.removeAttribute('inert');
        content_top.focus();
        if (e?.detail?.disable_animation || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          content.style['transition-duration'] = '0ms';
          content.style['height'] = null;
        }
        else {
          content.style['transition-duration'] = Math.min(Math.max(content.scrollHeight / 2, 200), 800) + 'ms';
          cms.expand(content);
        }
      });

      element.addEventListener('component:deactivate', e => {
        function afterCollapse() {
          content.removeEventListener('transitionend', afterCollapse);
          expand.focus();
        }
        content.addEventListener('transitionend', afterCollapse);
        content.setAttribute('inert', '');
        if (e?.detail?.disable_animation || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          content.style['transition-duration'] = '1ms';
          content.style['height'] = '5rem';
        }
        else {
          content.style['transition-duration'] = Math.min(Math.max(content.scrollHeight / 2, 200), 800) + 'ms';
          cms.collapse(content);
        }
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