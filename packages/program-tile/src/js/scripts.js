(cms => {
  cms.attach('program-tile', context => {
    const elements = context.querySelectorAll('.program-tile');
    elements.forEach(element => {
      const expand_button = element.querySelector('.program-tile__expand');
      const collapse_button = element.querySelector('.program-tile__collapse');

      if (expand_button && collapse_button) {
        const content = element.querySelector('.program-tile__content');

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
          if (!e?.detail?.disable_animation && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && CSS.supports('interpolate-size', 'allow-keywords')) {
            // If animations are not disabled and the user does not prefer
            // reduced motion, the target height animation duration will be
            // half a millisecond for each pixel of tile height.
            duration = content.scrollHeight / 2;

            // Finally, the duration is clamped by the range [200ms, 800ms].
            duration = Math.min(Math.max(duration, 200), 800) + 'ms';
          }

          return duration;
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
          content.style['transition-duration'] = getAnimationDuration(e);
          content.removeAttribute('inert');
          content.focus();

          // Let parent element(s) know that this component was activated.
          element.dispatchEvent(new CustomEvent('component:activated', { detail: null, bubbles: true}));
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
          const animation_duration = getAnimationDuration(e);
          if (animation_duration !== '0ms') {
            const listener = () => {
              content.removeEventListener('transitionend', listener);
              // Let parent element(s) know that this component was activated.
              element.dispatchEvent(new CustomEvent('component:deactivated', { detail: null, bubbles: true}));
            };
            content.addEventListener('transitionend', listener);
          }
          else {
            // Let parent element(s) know that this component was activated.
            element.dispatchEvent(new CustomEvent('component:deactivated', { detail: null, bubbles: true}));
          }


          content.style['transition-duration'] = animation_duration;
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
      }
    });
  });
})(cms);
