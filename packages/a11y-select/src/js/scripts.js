(cms => {

  /**
   * Adds event listeners to all a11y-select elements in context.
   */
  cms.attach('a11y-select', context => {
    const a11y_selects = cms.once('a11y-select', '.a11y-select', context);
    a11y_selects.forEach(a11y_select => {


      // Apply the combobox treatment as a progressive enhancement.
      a11y_select.querySelector('.a11y-select__fallback').style.display = 'none';
      a11y_select.querySelector('.a11y-select__enhanced').style.display = 'block';

      const combobox = a11y_select.querySelector('.a11y-select__combobox');
      const listbox = a11y_select.querySelector('.a11y-select__listbox');

      const options = a11y_select.querySelectorAll('.a11y-select__option');
      options.forEach(option => {

        option.addEventListener('click', () => {
          a11y_select.querySelector('.a11y-select__option[aria-selected="true"]')?.setAttribute('aria-selected', 'false');
          option.setAttribute('aria-selected', 'true');
          option.classList.remove('a11y-select__option--activedescendant');
          combobox.removeAttribute('aria-activedescendant');
          combobox.setAttribute('aria-expanded', 'false');
          combobox.querySelector('.a11y-select__combobox-value').textContent = option.textContent;
        });
      });

      // Toggle the aria-expanded attribute on click.
      combobox.querySelector('.a11y-select__combobox-value').addEventListener('click', e => {
        if (combobox.getAttribute('aria-expanded') === 'true') {
          combobox.removeAttribute('aria-activedescendant');
          combobox.setAttribute('aria-expanded', 'false');
        }
        else {
          combobox.setAttribute('aria-expanded', 'true');
        }
      });

      combobox.addEventListener('focusout', e => {
        if (!combobox.contains(e.relatedTarget)) {
          combobox.setAttribute('aria-expanded', 'false');
        }
      });

      // Respond to various keydown events.
      combobox.addEventListener('keydown', e => {
        let selected_option = document.getElementById(combobox.getAttribute('aria-activedescendant')) ??
          listbox.querySelector('[role="option"][aria-selected="true"]') ??
          listbox.querySelector('[role="option"]:first-child');
        let new_option = null;

        if (e.key === 'Enter') {
          if (combobox.getAttribute('aria-expanded') === 'true') {
            selected_option?.click();
            selected_option?.classList.remove('a11y-select__option--activedescendant');
          }
          else {
            combobox.setAttribute('aria-expanded', 'true');
          }
        }
        else if (e.key === 'Escape') {
          selected_option?.classList.remove('a11y-select__option--activedescendant');
          combobox.setAttribute('aria-expanded', 'false');
          combobox.focus();
        }
        if (e.key === 'Home') {
          combobox.setAttribute('aria-expanded', 'true');
          new_option = listbox.querySelector('[role="option"]:first-child');
          selected_option?.classList.remove('a11y-select__option--activedescendant');
          new_option?.classList.add('a11y-select__option--activedescendant');
        }
        else if (e.key === 'ArrowDown') {
          if (e.altKey) {
            new_option = selected_option;
          }
          else {
            // Get the next option if available...
            if (selected_option.nextElementSibling && selected_option.nextElementSibling.getAttribute('role') === 'option' ) {
              new_option = selected_option.nextElementSibling;
            }
            else if (selected_option.nextElementSibling && selected_option.nextElementSibling.getAttribute('role') === 'group' ) {
              new_option = selected_option.nextElementSibling.querySelector('[role="option"]');
            }
            else if (selected_option.parentElement.getAttribute('role') === 'group' && selected_option.parentElement.nextElementSibling) {
              if (selected_option.parentElement.nextElementSibling.getAttribute('role') === 'group') {
                new_option = selected_option.parentElement.nextElementSibling.querySelector('[role="option"]');
              }
              else {
                new_option = selected_option.parentElement.nextElementSibling;
              }
            }
          }
          combobox.setAttribute('aria-expanded', 'true');
          if (new_option) {
            selected_option?.classList.remove('a11y-select__option--activedescendant');
            new_option.classList.add('a11y-select__option--activedescendant');
            combobox.setAttribute('aria-activedescendant', new_option.getAttribute('id'));
          }
        }
        else if (e.key === 'ArrowUp') {
          if (e.altKey) {
            new_option = selected_option;
          }
          else {
            // Get the next option if available...
            if (selected_option.previousElementSibling && selected_option.previousElementSibling.getAttribute('role') === 'option' ) {
              new_option = selected_option.previousElementSibling;
            }
            else if (selected_option.previousElementSibling && selected_option.previousElementSibling.getAttribute('role') === 'group' ) {
              new_option = selected_option.previousElementSibling.querySelector('[role="option"]:last-child');
            }
            else if (selected_option.parentElement.getAttribute('role') === 'group' && selected_option.parentElement.previousElementSibling) {
              if (selected_option.parentElement.previousElementSibling.getAttribute('role') === 'group') {
                new_option = selected_option.parentElement.previousElementSibling.querySelector('[role="option"]:last-child');
              }
              else {
                new_option = selected_option.parentElement.previousElementSibling;
              }
            }
          }
          combobox.setAttribute('aria-expanded', 'true');
          if (new_option) {
            selected_option?.classList.remove('a11y-select__option--activedescendant');
            new_option.classList.add('a11y-select__option--activedescendant');
            combobox.setAttribute('aria-activedescendant', new_option.getAttribute('id'));
          }
        }
        else if (e.key === 'End') {
          combobox.setAttribute('aria-expanded', 'true');
          new_option = listbox.querySelector('[role="option"]:last-child');
          selected_option?.classList.remove('a11y-select__option--activedescendant');
          new_option?.classList.add('a11y-select__option--activedescendant');
        }
        else {
          return;
        }
        e.preventDefault();
      });
    });
  });
})(cms);