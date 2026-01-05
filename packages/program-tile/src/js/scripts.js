(cms => {
  cms.attach('program-tile', context => {
    const elements = context.querySelectorAll('.program-tile');
    elements.forEach(element => {
      const content = element.querySelector('.program-tile__content');
      const expand_button = element.querySelector('.program-tile__expand');
      const collapse_button = element.querySelector('.program-tile__collapse');

      /**
       * Gets the animation duration for the current tile.
       *
       * Conditions and user preferences may change after page load,
       * therefore animation durations are computed in a just-in-time
       * fashion. If this function is called, a reflow is already
       * imminent due to the a guaranteed height change in an element.
       *
       * @param e
       *   The event that triggered this call.
       *
       * @returns {string}
       */
      const getAnimationDuration = (e) => {
        // Assume no animations are allowed by default.
        let duration = '0ms';

        // If animations are not disabled and the user does not prefer reduced
        // motion, the target height animation duration will be half a
        // millisecond for each pixel of tile height.
        if (!e?.detail?.disable_animation && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          duration = content.scrollHeight / 2;
        }

        // Finally, the duration is clamped by the range [200ms, 800ms].
        return Math.min(Math.max(duration, 200), 800) + 'ms';
      };

      // On activate, three things happen: the transition duration animation
      // is revalidated, the "inert" attribute is removed from the tile
      // content, and focus is hijacked / moved to the tile content. This focus
      // hijacking happens because certain user agents and A/T seem to
      // completely lose focus when the expand button is hidden.
      //
      // Whether or not a focus ring appears around the content is based on the
      // focus-visible heuristic which is controlled by the user agent, but as
      // a general rule mouse interactions do not result in a focus ring, but
      // keyboard interactions do.
      element.addEventListener('component:activate', e => {
        element.style['transition-duration'] = getAnimationDuration(e);
        content.removeAttribute('inert');
        content.focus();
      });

      // On deactivate, three things happen: the transition duration animation
      // is revalidated, the "inert" attribute is added to the tile content,
      // and focus is hijacked / moved to the expand button. This focus
      // hijacking happens because certain user agents and A/T seem to
      // completely lose focus when the collapse button is hidden.
      //
      // Whether or not a focus ring appears around the content is based on the
      // focus-visible heuristic which is controlled by the user agent, but as
      // a general rule mouse interactions do not result in a focus ring, but
      // keyboard interactions do.
      element.addEventListener('component:deactivate', e => {
        element.style['transition-duration'] = getAnimationDuration(e);
        content.setAttribute('inert', '');
        expand_button.focus();
      });

      // Proxy expand button clicks to the activate handler.
      expand_button.addEventListener('click', () => {
        element.dispatchEvent(new CustomEvent('component:activate', {
          detail: {
            activation_type: 'USER_ACTIVATE',
          }
        }));
      });

      // Proxy collapse button clicks to the deactivate handler.
      collapse_button.addEventListener('click', () => {
        element.dispatchEvent(new CustomEvent('component:deactivate'));
      });
    });
  });
})(cms);
