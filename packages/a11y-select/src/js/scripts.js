(cms => {

  /**
   * Cleans up any observer instances that are observing the detaching context.
   */
  cms.detach('a11y-select', context => {
    const a11y_selects = cms.once('a11y-select', '.a11y-select', context);
    a11y_selects.forEach(a11y_select => {
      const observer = a11y_select.a11ySelectObserver;
      if (observer) {
        observer.disconnect();
      }
    });
  });

  /**
   * Adds event listeners to all a11y-select elements in context.
   */
  cms.attach('a11y-select', context => {
    const a11y_selects = cms.once('a11y-select', '.a11y-select', context);
    a11y_selects.forEach(a11y_select => {

      const native_select = a11y_select.querySelector('.a11y-select__fallback-select');

      // Re-initialize everything whenever the backing element changes.
      a11y_select.a11ySelectObserver = new MutationObserver(mutations => {

        // Remove the old options.
        a11y_select.querySelectorAll('.a11y-select__option').forEach(option => {
          option.remove();
        });

        // Add the new options.
        native_select.querySelectorAll('option').forEach(option => {
          const new_option = document.createElement('div');
          new_option.classList.add('a11y-select__option');
          new_option.setAttribute('id', option.getAttribute('value'));
          new_option.setAttribute('role', 'option');
          new_option.setAttribute('data-native-value', option.value);
          new_option.textContent = option.textContent;

          new_option.addEventListener('click', () => {
            a11y_select.querySelector('.a11y-select__option[aria-selected="true"]')?.setAttribute('aria-selected', 'false');
            new_option.setAttribute('aria-selected', 'true');
            combobox.setAttribute('aria-activedescendant', option.getAttribute('id'));
            combobox.setAttribute('aria-expanded', 'false');
            combobox.value = option.textContent;
            native_select.value = option.getAttribute('data-native-value');
          });
          a11y_select.appendChild(new_option);
        });
      });

      a11y_select.a11ySelectObserver.observe(native_select, { childList: true });

      // Apply the combobox treatment as a progressive enhancement.
      a11y_select.querySelector('.a11y-select__fallback').style.display = 'none';
      a11y_select.querySelector('.a11y-select__enhanced').style.display = 'initial';

      const combobox = a11y_select.querySelector('.a11y-select__combobox');
      const listbox = a11y_select.querySelector('.a11y-select__listbox');

      const options = a11y_select.querySelectorAll('.a11y-select__option');
      options.forEach(option => {

        option.addEventListener('click', () => {
          a11y_select.querySelector('.a11y-select__option[aria-selected="true"]')?.setAttribute('aria-selected', 'false');
          option.setAttribute('aria-selected', 'true');
          combobox.setAttribute('aria-activedescendant', option.getAttribute('id'));
          combobox.setAttribute('aria-expanded', 'false');
          combobox.value = option.textContent;
          native_select.value = option.getAttribute('data-native-value');
        });
      });

      combobox.addEventListener('input', e => {
        const value = combobox.value;
        listbox.querySelectorAll('[role="option"]').forEach(option => {
          option.classList.toggle('a11y-select__option--hidden', value && !option.textContent.toLowerCase().includes(value.toLowerCase()));
        });
      });

      // Toggle the aria-expanded attribute on click.
      combobox.addEventListener('click', () => {
        combobox.setAttribute('aria-expanded', combobox.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
      });

      // Respond to various keydown events.
      combobox.addEventListener('keydown', e => {
        let selected_option = listbox.querySelector('[aria-selected="true"]');
        let new_option = selected_option;

        if (e.key === 'Enter' || e.key === 'Escape') {
          combobox.click();
        }
        if (e.key === 'Home') {
          combobox.setAttribute('aria-expanded', 'true');
          new_option = listbox.querySelector('[role="option"]:first-child');
          while (new_option && new_option.classList.contains('a11y-select__option--hidden')) {
            new_option = new_option.nextElementSibling;
          }
        }
        else if (e.key === 'ArrowDown') {
          combobox.setAttribute('aria-expanded', 'true');
          if (!selected_option) {
            new_option = listbox.querySelector('[role="option"]:first-child');
          }
          else {
            new_option = selected_option.nextElementSibling;
            while (new_option && new_option.classList.contains('a11y-select__option--hidden')) {
              new_option = new_option.nextElementSibling;
            }
            if (!new_option) {
              new_option = listbox.querySelector('[role="option"]:first-child');
              while (new_option && new_option.classList.contains('a11y-select__option--hidden')) {
                new_option = new_option.nextElementSibling;
              }
            }
          }
        }
        else if (e.key === 'ArrowUp') {
          combobox.setAttribute('aria-expanded', 'true');
          if (!selected_option) {
            new_option = listbox.querySelector('[role="option"]:last-child');
          }
          else {
            new_option = selected_option.previousElementSibling;
            while (new_option && new_option.classList.contains('a11y-select__option--hidden')) {
              new_option = new_option.previousElementSibling;
            }
            if (!new_option) {
              new_option = listbox.querySelector('[role="option"]:last-child');
              while (new_option && new_option.classList.contains('a11y-select__option--hidden')) {
                new_option = new_option.previousElementSibling;
              }
            }
          }
        }
        else if (e.key === 'End') {
          combobox.setAttribute('aria-expanded', 'true');
          new_option = listbox.querySelector('[role="option"]:last-child');
          while (new_option && new_option.classList.contains('a11y-select__option--hidden')) {
            new_option = new_option.previousElementSibling;
          }
        }
        else {
          return;
        }
        e.preventDefault();
        combobox.setAttribute('aria-activedescendant', new_option?.getAttribute('id'));
        selected_option?.setAttribute('aria-selected', 'false');
        new_option.setAttribute('aria-selected', 'true');
        combobox.value = listbox.querySelector('[aria-selected="true"]')?.textContent ?? combobox.value;
        native_select.value = listbox.querySelector('[aria-selected="true"]')?.getAttribute('data-native-value') ?? native_select.value;
      })
    });
  });
})(cms);