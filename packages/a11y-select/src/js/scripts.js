(cms => {

  const a11ySelect = ((native_select, unique_id) => {

  function maintainScrollVisibility(activeElement, scrollParent) {
    const { offsetHeight, offsetTop } = activeElement;
    const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent;

    const isAbove = offsetTop < scrollTop;
    const isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight;

    if (isAbove) {
      scrollParent.scrollTo(0, offsetTop);
    } else if (isBelow) {
      scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
    }
  }

  const options = [];
  let last_selected_option = null;
  let selected_option = null;
  let aria_active_descendant_index = 0;

  const wrapping_element = Object.assign(document.createElement('div'), {
    className: 'a11y-select',
  });

  // If there is a label wrapping the native select, move the entire label inside.
  const wrapping_label = native_select.closest('label');
  if (wrapping_label) {
    wrapping_label.insertAdjacentElement('beforebegin', wrapping_element);
    wrapping_element.appendChild(wrapping_label);
  }
  else {
    native_select.insertAdjacentElement('beforebegin', wrapping_element);
    wrapping_element.appendChild(native_select);
  }

  const combobox = Object.assign(document.createElement('div'), {
    className: 'a11y-select__combobox',
    tabIndex: '0',
    ariaControls: [`a11y-select-${unique_id}--listbox`],
    ariaHasPopup: 'listbox',
    role: 'combobox',
    ariaExpanded: 'false',
  });

  const combobox_value = Object.assign(document.createElement('div'), {
    className: 'a11y-select__value',
  });
  combobox.appendChild(combobox_value);

  const listbox = Object.assign(document.createElement('div'), {
    className: 'a11y-select__listbox',
    id: `a11y-select-${unique_id}--listbox`,
    role: 'listbox',
    tabIndex: '-1',
  });

  let group_counter = 0;
  let option_counter = 0;
  native_select.querySelectorAll(':scope > option, :scope > optgroup').forEach(native_element =>  {
    if (native_element.tagName.toLowerCase() === 'optgroup') {
      ++group_counter;

      const group_accessible_name = Object.assign(document.createElement('div'), {
        className: 'a11y-select__group-accessible-name',
        role: 'presentation',
        id: `a11y-select-${unique_id}--optgroup-${group_counter}`,
        textContent: native_element.getAttribute('label'),
      });

      const group = Object.assign(document.createElement('div'), {
        className: 'a11y-select__group',
        role: 'group',
      });
      if (native_element.hasAttribute('disabled')) {
        group.setAttribute('aria-disabled', 'true');
      }

      group.appendChild(group_accessible_name);
      group.setAttribute('aria-labelledby', `a11y-select-${unique_id}--optgroup-${group_counter}`);
      native_element.querySelectorAll('option').forEach(native_subelement => {
        ++option_counter;
        const option = Object.assign(document.createElement('div'), {
          className: 'a11y-select__option',
          id: `a11y-select-${unique_id}--option-${option_counter}`,
          role: 'option',
          ariaSelected: native_subelement.hasAttribute('selected') ? 'true' : 'false',
          textContent: native_subelement.textContent,
        });
        if (native_subelement.hasAttribute('selected')) {
          last_selected_option = selected_option = option;
        }
        option.setAttribute('data-native-option-value', native_subelement.getAttribute('value'));
        if (native_subelement.hasAttribute('disabled')) {
          option.setAttribute('aria-disabled', 'true');
        }
        else {
          option.addEventListener('click', () => {
            last_selected_option?.classList.remove('a11y-select__option--active-descendant', 'a11y-select__option--selected');
            last_selected_option?.setAttribute('aria-selected', 'false');

            last_selected_option = selected_option = option;

            selected_option.setAttribute('aria-selected', 'true');
            selected_option.classList.add('a11y-select__option--selected');
            combobox.setAttribute('aria-expanded', 'false');
            combobox.removeAttribute('aria-activedescendant');
            combobox_value.textContent = selected_option.textContent;
          });
        }
        options.push(option);
        group.appendChild(option);
      });

      listbox.appendChild(group);
    }
    else {
      ++option_counter;
      const option = Object.assign(document.createElement('div'), {
        className: `a11y-select__option${native_element.hasAttribute('selected') ? ' a11y-select__option--selected' : ''}`,
        id: `a11y-select-${unique_id}--option-${option_counter}`,
        role: 'option',
        ariaSelected: native_element.hasAttribute('selected') ? 'true' : 'false',
        textContent: native_element.textContent,
      });
      if (native_element.hasAttribute('selected')) {
        last_selected_option = selected_option = option;
      }
      option.setAttribute('data-native-option-value', native_element.getAttribute('value'));
      if (native_element.hasAttribute('disabled')) {
        option.setAttribute('aria-disabled', 'true');
      }
      else {
        option.addEventListener('click', () => {
          last_selected_option?.classList.remove('a11y-select__option--active-descendant', 'a11y-select__option--selected');
          last_selected_option?.setAttribute('aria-selected', 'false');

          last_selected_option = selected_option = option;

          selected_option.setAttribute('aria-selected', 'true');
          selected_option.classList.add('a11y-select__option--selected');
          combobox.setAttribute('aria-expanded', 'false');
          combobox.removeAttribute('aria-activedescendant');
          combobox_value.textContent = selected_option.textContent;
        });
      }
      options.push(option);
      listbox.appendChild(option);
    }
  });
  if (!selected_option) {
    last_selected_option = selected_option = options[0];
    selected_option.setAttribute('aria-selected', 'true');
    selected_option.classList.add('a11y-select__option--selected');
  }
  combobox_value.textContent = selected_option.textContent;

  aria_active_descendant_index = options.indexOf(selected_option);

  combobox.appendChild(listbox);
  wrapping_element.appendChild(combobox);

  combobox.addEventListener('click', e => {
    if (e.target === combobox.querySelector('.a11y-select__value')) {
/*      if (combobox.getAttribute('aria-expanded') === 'true') {
        combobox.setAttribute('aria-expanded', 'false');
        document.getElementById(combobox.getAttribute('aria-activedescendant'))?.classList.remove('a11y-select__option--active-descendant');
        combobox.removeAttribute('aria-activedescendant');
        selected_option?.setAttribute('aria-selected', 'false');
        selected_option?.classList.remove('a11y-select__option--selected');
        last_selected_option?.setAttribute('aria-selected', 'true');
        last_selected_option?.classList.add('a11y-select__option--selected');
        selected_option = last_selected_option;
      }*/
//      else {
        combobox.setAttribute('aria-expanded', 'true');
        combobox.setAttribute('aria-activedescendant', selected_option?.getAttribute('id') ?? options[0].getAttribute('id'));
        selected_option?.classList.add('a11y-select__option--active-descendant');
        aria_active_descendant_index = options.indexOf(selected_option);
//      }
    }
  });

/*  combobox.addEventListener('focusout', e => {
    if (!combobox.contains(e.relatedTarget)) {
      options[aria_active_descendant_index].classList.remove('a11y-select__option--active-descendant');
      combobox.removeAttribute('aria-activedescendant');
      combobox.setAttribute('aria-expanded', 'false');
      selected_option?.setAttribute('aria-selected', 'false');
      selected_option?.classList.remove('a11y-select__option--selected');
      last_selected_option?.setAttribute('aria-selected', 'true');
      last_selected_option?.classList.add('a11y-select__option--selected');
      selected_option = last_selected_option;
    }
  });*/

  combobox.addEventListener('keydown', e => {
    if (e.key === 'Tab' && options[aria_active_descendant_index]?.getAttribute('aria-disabled') !== 'true') {
      last_selected_option?.classList.remove('a11y-select__option--selected');
      last_selected_option?.setAttribute('aria-selected', 'false');

      last_selected_option = selected_option = options[aria_active_descendant_index];

      selected_option?.classList.add('a11y-select__option--selected');
      selected_option.setAttribute('aria-selected', 'true');
      combobox_value.textContent = selected_option.textContent;
    }
    else if (e.key === 'Escape') {
      options[aria_active_descendant_index].classList.remove('a11y-select__option--active-descendant');
      combobox.removeAttribute('aria-activedescendant');
      combobox.setAttribute('aria-expanded', 'false');
      selected_option?.setAttribute('aria-selected', 'false');
      selected_option?.classList.remove('a11y-select__option--selected');
      last_selected_option?.setAttribute('aria-selected', 'true');
      last_selected_option?.classList.add('a11y-select__option--selected');
      selected_option = last_selected_option;
    }
    else if (e.key === 'Enter') {
      if (combobox.getAttribute('aria-expanded') === 'true') {
        if (options[aria_active_descendant_index]?.getAttribute('aria-disabled') !== 'true') {
          last_selected_option?.classList.remove('a11y-select__option--selected');
          last_selected_option?.setAttribute('aria-selected', 'false');

          last_selected_option = selected_option = options[aria_active_descendant_index];

          selected_option?.classList.add('a11y-select__option--selected');
          selected_option.setAttribute('aria-selected', 'true');

          combobox.setAttribute('aria-expanded', 'false');
          combobox_value.textContent = selected_option.textContent;
        }
      }
      else {
        if (aria_active_descendant_index === null) {
          aria_active_descendant_index = selected_option ? options.indexOf(selected_option) : 0;
        }
        combobox.setAttribute('aria-activedescendant', options[aria_active_descendant_index].getAttribute('id'));
        options[aria_active_descendant_index].classList.add('a11y-select__option--active-descendant');
        combobox.setAttribute('aria-expanded', 'true');
      }
    }
    else if (e.key === 'Home') {
      if (combobox.getAttribute('aria-expanded') === 'true') {
        e.preventDefault();
        options[aria_active_descendant_index].classList.remove('a11y-select__option--active-descendant');
        aria_active_descendant_index = 0;
        combobox.setAttribute('aria-activedescendant', options[aria_active_descendant_index].getAttribute('id'));
        options[aria_active_descendant_index].classList.add('a11y-select__option--active-descendant');
        maintainScrollVisibility(options[aria_active_descendant_index], listbox);
      }
    }
    else if (e.key === 'End') {
      if (combobox.getAttribute('aria-expanded') === 'true') {
        e.preventDefault();
        options[aria_active_descendant_index].classList.remove('a11y-select__option--active-descendant');
        aria_active_descendant_index = options.length - 1;
        selected_option?.setAttribute('aria-selected', 'false');
        selected_option = options[aria_active_descendant_index];
        combobox.setAttribute('aria-activedescendant', selected_option.getAttribute('id'));
        selected_option.classList.add('a11y-select__option--active-descendant');
        selected_option.setAttribute('aria-selected', 'true');
        maintainScrollVisibility(options[aria_active_descendant_index], listbox);
      }
    }
    else if (e.key === 'PageDown') {
      if (combobox.getAttribute('aria-expanded') === 'true') {
        e.preventDefault();
        options[aria_active_descendant_index].classList.remove('a11y-select__option--active-descendant');
        aria_active_descendant_index = Math.min(aria_active_descendant_index + 10, options.length - 1);
        selected_option?.setAttribute('aria-selected', 'false');
        selected_option = options[aria_active_descendant_index];
        combobox.setAttribute('aria-activedescendant', selected_option.getAttribute('id'));
        selected_option.classList.add('a11y-select__option--active-descendant');
        selected_option.setAttribute('aria-selected', 'true');
        if (combobox.getAttribute('aria-expanded') === 'false') {
          combobox.setAttribute('aria-expanded', 'true');
        }
        combobox.setAttribute('aria-activedescendant', options[aria_active_descendant_index].getAttribute('id'));
        options[aria_active_descendant_index].classList.add('a11y-select__option--active-descendant');
        maintainScrollVisibility(options[aria_active_descendant_index], listbox);
      }
    }
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      options[aria_active_descendant_index].classList.remove('a11y-select__option--active-descendant');

      if (combobox.getAttribute('aria-expanded') === 'true' || (combobox.getAttribute('aria-expanded') === 'false' && !e.altKey)) {
        aria_active_descendant_index = Math.min(aria_active_descendant_index + 1, options.length - 1);
      }
      selected_option?.setAttribute('aria-selected', 'false');
      selected_option = options[aria_active_descendant_index];
      combobox.setAttribute('aria-activedescendant', selected_option.getAttribute('id'));
      selected_option.classList.add('a11y-select__option--active-descendant');
      selected_option.setAttribute('aria-selected', 'true');
      if (combobox.getAttribute('aria-expanded') === 'false') {
        combobox.setAttribute('aria-expanded', 'true');
      }
      combobox.setAttribute('aria-activedescendant', options[aria_active_descendant_index].getAttribute('id'));
      options[aria_active_descendant_index].classList.add('a11y-select__option--active-descendant');
      maintainScrollVisibility(options[aria_active_descendant_index], listbox);
    }
    else if (e.key === 'PageUp') {
      if (combobox.getAttribute('aria-expanded') === 'true') {
        e.preventDefault();
        options[aria_active_descendant_index].classList.remove('a11y-select__option--active-descendant');
        aria_active_descendant_index = Math.max(0, aria_active_descendant_index - 10);
        selected_option?.setAttribute('aria-selected', 'false');
        selected_option = options[aria_active_descendant_index];
        combobox.setAttribute('aria-activedescendant', selected_option.getAttribute('id'));
        selected_option.classList.add('a11y-select__option--active-descendant');
        selected_option.setAttribute('aria-selected', 'true');
        if (combobox.getAttribute('aria-expanded') === 'false') {
          combobox.setAttribute('aria-expanded', 'true');
        }
        combobox.setAttribute('aria-activedescendant', options[aria_active_descendant_index].getAttribute('id'));
        options[aria_active_descendant_index].classList.add('a11y-select__option--active-descendant');
        maintainScrollVisibility(options[aria_active_descendant_index], listbox);
      }
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      options[aria_active_descendant_index].classList.remove('a11y-select__option--active-descendant');
      if (combobox.getAttribute('aria-expanded') === 'true' || (combobox.getAttribute('aria-expanded') === 'false' && !e.altKey)) {
        aria_active_descendant_index = Math.max(0, aria_active_descendant_index - 1);
      }
      selected_option?.setAttribute('aria-selected', 'false');
      selected_option = options[aria_active_descendant_index];
      combobox.setAttribute('aria-activedescendant', selected_option.getAttribute('id'));
      selected_option.classList.add('a11y-select__option--active-descendant');
      selected_option.setAttribute('aria-selected', 'true');
      if (combobox.getAttribute('aria-expanded') === 'false') {
        combobox.setAttribute('aria-expanded', 'true');
      }
      combobox.setAttribute('aria-activedescendant', options[aria_active_descendant_index].getAttribute('id'));
      options[aria_active_descendant_index].classList.add('a11y-select__option--active-descendant');
      maintainScrollVisibility(options[aria_active_descendant_index], listbox);
    }
  });

  native_select.style.display = 'none';

  // Next up, determine the accessible name for the native select.
  // @see https://www.w3.org/TR/accname-1.2/
  if (native_select.hasAttribute('aria-describedby')) {

  }
});

  /**
   * Adds event listeners to all a11y-select elements in context.
   */
  cms.attach('a11y-select', context => {

    // Only enhance select elements in non-Safari, or Safari 18+.
    if (navigator.vendor !== 'Apple Computer, Inc.' ||
    'contentVisibility' in document.documentElement.style) {
      const selects = cms.once('a11y-select', '#a11y-select-demo', context);
      selects.forEach(select => {
        a11ySelect(select, 'demo');
      });
    }
  });
})(cms);