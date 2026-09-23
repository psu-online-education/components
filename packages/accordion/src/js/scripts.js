/**
 * @file
 * Provides an accessible accordion implementation.
 */
((cms) => {
  cms.attach('accordion', context => {
    const accordions = cms.once('accordion', '.accordion', context);

    accordions.forEach(accordion => {
      const button = accordion.querySelector('.accordion__button');
      const content = accordion.querySelector('.accordion__expandable-content');

      // Trying to keep transition to JS and height to CSS...
      const setTransitionDuration = () => {
        const duration = Math.min(
          Math.max(content.scrollHeight / 2, 200),
          800
        );

        // Set the transition duration as a CSS variable so that
        // it can be used in the CSS transition property.
        content.style.setProperty(
          '--accordion-transition-duration',
          `${duration}ms`
        );

        return duration;
      };

      accordion.addEventListener('component:activate', e => {
        if (e?.detail?.disable_animation || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          content.style.setProperty(
            '--accordion-transition-duration',
            '0ms'
          );
          content.style.visibility = 'visible';
          content.style.height = null;

          accordion.classList.add('accordion--expanded');
          button.setAttribute('aria-expanded', 'true');
        }
        else {
          setTransitionDuration();
          content.style.visibility = 'visible';
          accordion.classList.add('accordion--expanded');
          button.setAttribute('aria-expanded', 'true');
          cms.expand(content);
        }
      });

      accordion.addEventListener('component:deactivate', e => {
        if (e?.detail?.disable_animation || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          content.style.setProperty(
            '--accordion-transition-duration',
            '0ms'
          );
          content.style.height = '0';
          content.style.visibility = 'hidden';

          accordion.classList.remove('accordion--expanded');
          button.setAttribute('aria-expanded', 'false');
        }
        else {
          const duration = setTransitionDuration();

          content.style.visibility = 'visible';
          accordion.classList.remove('accordion--expanded');
          button.setAttribute('aria-expanded', 'false');
          cms.collapse(content);
          window.setTimeout(() => {
            if (!accordion.classList.contains('accordion--expanded')) {
              content.style.visibility = 'hidden';
            }
          }, duration);
        }
      });

      button.addEventListener('click', () => {
        const state = button.getAttribute('aria-expanded');

        if (state === 'true') {
          accordion.dispatchEvent(
            new CustomEvent('component:deactivate')
          );
        }
        else {
          accordion.dispatchEvent(new CustomEvent('component:activate', {
              detail: {
                activation_type: 'USER_ACTIVATE',
              }
            })
          );
        }
      });
    });
  });
})(cms);