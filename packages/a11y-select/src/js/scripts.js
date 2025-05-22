(cms => {
  cms.attach('a11y-select', context => {
    const a11y_selects = cms.once('a11y-select', '.a11y-select', context);
    a11y_selects.forEach(a11y_select => {

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
          new_option = listbox.querySelector('[role="option"]:first-child');
        }
        else if (e.key === 'ArrowDown') {
          if (!selected_option) {
            new_option = listbox.querySelector('[role="option"]:first-child');
          }
          else {
            new_option = selected_option.nextElementSibling
            if (!new_option) {
              new_option = listbox.querySelector('[role="option"]:first-child');
            }
          }
        }
        else if (e.key === 'ArrowUp') {
          if (!selected_option) {
            new_option = listbox.querySelector('[role="option"]:last-child');
          }
          else {
            new_option = selected_option.previousElementSibling;
            if (!new_option) {
              new_option = listbox.querySelector('[role="option"]:last-child');
            }
          }
        }
        else if (e.key === 'End') {
          new_option = listbox.querySelector('[role="option"]:last-child');
        }
        else {
          return;
        }
        e.preventDefault();
        combobox.setAttribute('aria-activedescendant', new_option?.getAttribute('id'));
        selected_option?.setAttribute('aria-selected', 'false');
        new_option.setAttribute('aria-selected', 'true');
        combobox.value = listbox.querySelector('[aria-selected="true"]')?.textContent ?? combobox.value;
      })
    });
  });
})(cms);