/**
 * components.js
 * -----------------------------------------------------------------------
 * Reusable, framework-free UI components. Every component is a pure
 * function: (config) -> DOM node. State lives in data.js; components
 * read the current value in and call back out through onChange.
 * -----------------------------------------------------------------------
 */

const components = {
  /**
   * A "Select one" choice group rendered as square checkbox-style controls
   * that behave as a mutually exclusive set (radio semantics for a11y,
   * checkbox visuals to match the source document).
   *
   * options: [{ value, label, hasDate?, hasText? }]
   * getValue: () => currentValue
   * onSelect: (value) => void
   * extra: { onDateChange, onTextChange, dateValue, textValue, textLabel }
   */
  choiceGroup({ name, legend, options, getValue, onSelect, extra = {} }) {
    const fieldset = utils.el("fieldset", { class: "choice-group", role: "radiogroup", "aria-label": legend || name });
    if (legend) {
      fieldset.appendChild(utils.el("legend", { class: "choice-group__legend", text: legend }));
    }

    const optionsWrap = utils.el("div", { class: "choice-group__options" });

    options.forEach((opt) => {
      const checked = getValue() === opt.value;
      const optionId = utils.uid("opt");

      const box = utils.el("span", { class: "checkbox-box", "aria-hidden": "true" }, [
        utils.el("img", { class: "checkbox-box__check", src: "assets/icons/check.svg", alt: "" })
      ]);

      const labelText = utils.el("span", { class: "choice-option__label" }, opt.label);

      const inlineControls = [];
      if (opt.hasDate) {
        const dateInput = components.dateInput({
          id: `${optionId}-date`,
          value: extra.dateValue ? extra.dateValue() : "",
          disabled: !checked,
          onChange: extra.onDateChange
        });
        inlineControls.push(dateInput);
      }
      if (opt.hasText) {
        const textInput = utils.el("input", {
          type: "text",
          class: "inline-text-input",
          id: `${optionId}-text`,
          value: extra.textValue ? extra.textValue() : "",
          "aria-label": extra.textLabel || opt.label,
          disabled: !checked,
          placeholder: extra.textPlaceholder || "",
          oninput: (e) => extra.onTextChange && extra.onTextChange(e.target.value)
        });
        inlineControls.push(textInput);
      }

      const option = utils.el(
        "label",
        {
          class: `choice-option${checked ? " is-checked" : ""}`,
          for: optionId
        },
        [
          utils.el("input", {
            type: "radio",
            name,
            id: optionId,
            value: opt.value,
            class: "choice-option__input sr-only",
            checked,
            onchange: () => onSelect(opt.value)
          }),
          box,
          labelText,
          ...inlineControls
        ]
      );

      optionsWrap.appendChild(option);
    });

    fieldset.appendChild(optionsWrap);
    return fieldset;
  },

  /** A single standalone toggle checkbox (used for the declaration acknowledgement). */
  checkbox({ id, label, checked, onChange }) {
    const box = utils.el("span", { class: "checkbox-box", "aria-hidden": "true" }, [
      utils.el("img", { class: "checkbox-box__check", src: "assets/icons/check.svg", alt: "" })
    ]);

    return utils.el("label", { class: `choice-option${checked ? " is-checked" : ""}`, for: id }, [
      utils.el("input", {
        type: "checkbox",
        id,
        class: "choice-option__input sr-only",
        checked,
        onchange: (e) => onChange(e.target.checked)
      }),
      box,
      utils.el("span", { class: "choice-option__label" }, label)
    ]);
  },

  /** Styled native date input. */
  dateInput({ id, value, onChange, disabled = false, label }) {
    const wrap = utils.el("div", { class: "date-field" });
    if (label) wrap.appendChild(utils.el("label", { class: "field-label", for: id, text: label }));
    const input = utils.el("input", {
      type: "date",
      id,
      class: "date-input",
      value: value || "",
      disabled,
      oninput: (e) => onChange && onChange(e.target.value)
    });
    wrap.appendChild(input);
    return wrap;
  },

  /** Auto-expanding textarea with a live character counter. Resize handle disabled via CSS. */
  textarea({ id, label, value, placeholder, maxLength = 1000, onChange }) {
    const wrap = utils.el("div", { class: "textarea-field" });
    if (label) wrap.appendChild(utils.el("label", { class: "field-label", for: id, text: label }));

    const counter = utils.el("span", { class: "textarea-counter" }, `${(value || "").length} / ${maxLength}`);

    const grow = (node) => {
      node.style.height = "auto";
      node.style.height = `${node.scrollHeight}px`;
    };

    const textareaEl = utils.el("textarea", {
      id,
      class: "textarea-input",
      placeholder: placeholder || "",
      maxlength: maxLength,
      rows: "3",
      oninput: (e) => {
        grow(e.target);
        counter.textContent = `${e.target.value.length} / ${maxLength}`;
        onChange && onChange(e.target.value);
      }
    });
    textareaEl.value = value || "";

    wrap.appendChild(textareaEl);
    wrap.appendChild(counter);

    requestAnimationFrame(() => grow(textareaEl));
    return wrap;
  },

  /** 1–10 interactive pain scale. Only one value selected at a time; clicking the active value deselects it. */
  painScale({ min = 1, max = 10, getValue, onSelect }) {
    const wrap = utils.el("div", { class: "pain-scale", role: "radiogroup", "aria-label": "Pain or discomfort scale, 1 to 10" });
    const track = utils.el("div", { class: "pain-scale__track" });

    for (let i = min; i <= max; i++) {
      const isSelected = getValue() === i;
      const btn = utils.el(
        "button",
        {
          type: "button",
          class: `pain-scale__btn${isSelected ? " is-selected" : ""}`,
          "aria-pressed": isSelected ? "true" : "false",
          "aria-label": `Pain level ${i}${i === min ? " (no pain)" : i === max ? " (severe pain)" : ""}`,
          text: String(i),
          onclick: () => onSelect(getValue() === i ? null : i)
        },
        []
      );
      track.appendChild(btn);
    }

    const labels = utils.el("div", { class: "pain-scale__labels" }, [
      utils.el("span", {}, "1 · No pain"),
      utils.el("span", {}, "10 · Severe pain")
    ]);

    wrap.appendChild(track);
    wrap.appendChild(labels);
    return wrap;
  },

  /** A plain labeled text input (for "employer contact" style fields). */
  textInput({ id, label, value, placeholder, onChange }) {
    const wrap = utils.el("div", { class: "text-field" });
    if (label) wrap.appendChild(utils.el("label", { class: "field-label", for: id, text: label }));
    wrap.appendChild(
      utils.el("input", {
        type: "text",
        id,
        class: "text-input",
        value: value || "",
        placeholder: placeholder || "",
        oninput: (e) => onChange && onChange(e.target.value)
      })
    );
    return wrap;
  }
};
