(cms => {
  cms.attach('a11y-select', context => {
    const a11y_selects = cms.once('a11y-select', '.a11y-select', context);
    a11y_selects.forEach(a11y_select => {
      const select = a11y_select.querySelector('.a11y-select__select');
      if (select) {
        const options = select.querySelectorAll(':scope > option, :scope > optgroup');
        if (options.length) {
          const combobox = document.createElement('input');
          combobox.setAttribute('type', 'text');
          combobox.setAttribute('role', 'combobox');
          combobox.setAttribute('aria-autocomplete', 'both');
          combobox.setAttribute('aria-expanded', 'false');
          combobox.setAttribute('aria-controls', 'a11y-select-listbox');
          a11y_select.appendChild(combobox);

          const listbox = document.createElement('ul');
          listbox.setAttribute('id', 'a11y-select-listbox');
          listbox.setAttribute('role', 'listbox');
          listbox.setAttribute('aria-label', 'Demo options');
          a11y_select.appendChild(listbox);

          options.forEach(option => {
            if (option.tagName.toLowerCase() === 'option') {
              const listbox_option = document.createElement('li');
              listbox_option.setAttribute('role', 'option');
              listbox_option.setAttribute('id', option.value);
              listbox_option.setAttribute('aria-selected', 'false');
              listbox_option.textContent = option.textContent;
              listbox.appendChild(listbox_option);
            }
            else {
              const listbox_group = document.createElement('ul');
              listbox_group.setAttribute('role', 'group');
              listbox_group.setAttribute('aria-label', option.getAttribute('label'));
              const suboptions = option.querySelectorAll('option');
              suboptions.forEach(subption => {
                const listbox_option = document.createElement('li');
                listbox_option.setAttribute('role', 'option');
                listbox_option.setAttribute('id', subption.value);
                listbox_option.setAttribute('aria-selected', 'false');
                listbox_option.textContent = subption.textContent;
                listbox_group.appendChild(listbox_option);
              });
              listbox.appendChild(listbox_group);
            }
          });

          combobox.addEventListener('click', () => {
            if (combobox.getAttribute('aria-expanded') === 'true') {
              combobox.setAttribute('aria-expanded', 'false');
            }
            else {
              combobox.setAttribute('aria-expanded', 'true');
            }
          });

          combobox.addEventListener('keydown', e => {
            let selected_option = listbox.querySelector('[aria-selected="true"]');
            let new_option = null;
            if (e.key === 'ArrowDown') {
              if (!selected_option) {
                selected_option = listbox.querySelector('[role="option"]:first-child');
              }

              new_option = selected_option.nextElementSibling;
              if (!new_option) {
                new_option = listbox.querySelector('[role="option"]:first-child');
              }
              if (new_option && new_option.getAttribute('role') === 'group') {
                new_option = new_option.querySelector('[role="option"]:first-child');
              }
            }
            else if (e.key === 'ArrowUp') {
              if (!selected_option) {
                selected_option = listbox.querySelector('[role="option"]:last-child');
              }

              new_option = selected_option.previousElementSibling;
              if (!new_option) {
                new_option = listbox.querySelector('[role="option"]:last-child');
              }
              if (new_option && new_option.getAttribute('role') === 'group') {
                new_option = new_option.querySelector('[role="option"]:last-child');
              }
            }
            if (new_option) {
              selected_option.setAttribute('aria-selected', 'false');
              new_option.setAttribute('aria-selected', 'true');
              combobox.setAttribute('aria-activedescendant', new_option.getAttribute('id'));
            }
          });

        }
      }
    });
  });
})(cms);