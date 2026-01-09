(cms => {

  cms.attach('program-tile-grid', context => {
    const elements = context.querySelectorAll('.program-tile-grid');
    elements.forEach(element => {

      const revalidateMaxWidths = () => {
        const tiles = element.querySelectorAll('.program-tile');
        const rows = [];
        let last_y = -1;
        let i = 0;
        tiles.forEach(tile => {
          tile.style.transition = 'none';
          tile.querySelector('.program-tile__content').style.transition = 'none';
          const y = tile.getBoundingClientRect().top;
          if (y !== last_y) {
            last_y = y;
            ++i;
            rows[i] = [tile]
          }
          else {
            rows[i].push(tile);
          }
        });
        rows.forEach(row => {
          let max = 0;
          let states = [];
          row.forEach((tile, index) => {
            const content = tile.querySelector('.program-tile__content');
            states[index] = content.hasAttribute('inert');
            content.setAttribute('inert', '');
          });
          row.forEach(tile => {
            tile.style.maxHeight = 'unset';
            if (tile.getBoundingClientRect().height > max) {
              max = tile.getBoundingClientRect().height;
            }
          });
          row.forEach((tile, index) => {
            tile.style.maxHeight = max + 'px';
            if (!states[index]) {
              const content = tile.querySelector('.program-tile__content');
              content.removeAttribute('inert');
            }
            tile.style.transition = 'max-height .2s linear';
            tile.querySelector('.program-tile__content').style.transition = 'max-height .2s linear';
          });
        });
      };

      let last_width = element.getBoundingClientRect().width;
      const observer = new ResizeObserver(entries => {
        if (element.getBoundingClientRect().width === last_width) {
          return;
        }
        last_width = element.getBoundingClientRect().width
        observer.disconnect();
        revalidateMaxWidths();
        observer.observe(element);
      });
      revalidateMaxWidths();
      observer.observe(element);
    });
  });

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
          //element.style['transition-duration'] = getAnimationDuration(e);
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
          //element.style['transition-duration'] = getAnimationDuration(e);
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
