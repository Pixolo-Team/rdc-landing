import React from "react";

interface Option {
  value: string;
  label: string;
}
interface Props {
  id: string;
  label: string;
  options: Option[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // unchanged
  disabled?: boolean;
}

const SyledSelect: React.FC<Props> = ({
  id,
  label,
  options,
  value,
  onChange,
  disabled,
}) => {
  const [open, setOpen] = React.useState(false);
  const [highlight, setHighlight] = React.useState<number>(() =>
    Math.max(
      0,
      options.findIndex((o) => o.value === value),
    ),
  );

  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const listRef = React.useRef<HTMLUListElement | null>(null);

  const selected = options.find((o) => o.value === value) || null;

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t)) return;
      if (listRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // Ensure highlight tracks current value when opening
  React.useEffect(() => {
    if (open) {
      setHighlight(
        Math.max(
          0,
          options.findIndex((o) => o.value === value),
        ),
      );
    }
  }, [open, options, value]);

  // Helper: notify parent using same onChange signature
  const selectValue = (newValue: string) => {
    // Create a minimal synthetic event so caller can read e.target.value
    const synthetic = {
      target: { value: newValue },
    } as unknown as React.ChangeEvent<HTMLSelectElement>;
    onChange(synthetic);
    setOpen(false);
  };

  const onKeyDownBtn = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    switch (e.key) {
      case " ":
      case "Enter":
      case "ArrowDown":
      case "ArrowUp":
        e.preventDefault();
        setOpen(true);
        break;
      default:
        break;
    }
  };

  const onKeyDownList = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (!open) return;
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setOpen(false);
        btnRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setHighlight((h) => Math.min(options.length - 1, h + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlight((h) => Math.max(0, h - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (options[highlight]) selectValue(options[highlight].value);
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full">
      {/* Hidden input for form submissions */}
      <input type="hidden" id={`${id}-value`} name={id} value={value} />

      <div className="relative">
        {/* Trigger button */}
        <button
          id={`${id}-button`}
          ref={btnRef}
          type="button"
          className="w-full text-left bg-transparent border-b border-n-800 py-2 text-n-900 text-sm focus:outline-none focus:border-sky-500 flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          disabled={!!disabled}
          onClick={() => !disabled && setOpen((o) => !o)}
          onKeyDown={onKeyDownBtn}
        >
          <span
            data-slot="current-label"
            className={`truncate text-xl text-n-900 ${selected ? "text-n-900" : "text-n-500"} lg:max-w-[300px] xl:max-w-[450px] 2xl:max-w-[600px]`}
          >
            {selected ? selected.label : `${label} `}
            {!selected && <span className="text-red-500">*</span>}
          </span>
          <img
            src="/icons/down-arrow.svg"
            alt=""
            className={`w-4 h-4 pointer-events-none transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Options list */}
        <ul
          id={`${id}-list`}
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={
            open && options[highlight] ? `${id}-opt-${highlight}` : undefined
          }
          className={`absolute z-10 mt-2 px-5 w-full bg-white shadow-lg rounded-2xl border border-n-200 max-h-60 overflow-auto ${
            open ? "" : "hidden"
          }`}
          onKeyDown={onKeyDownList}
        >
          {options.map((optionItem, oi) => {
            const isSelected = optionItem.value === value;
            const isActive = oi === highlight;
            return (
              <li
                id={`${id}-opt-${oi}`}
                key={optionItem.value}
                role="option"
                aria-selected={isSelected}
                data-value={optionItem.value}
                data-index={oi}
                className={`cursor-pointer text-base py-4 border-b last:border-0 hover:bg-n-50 ${
                  isActive ? "bg-n-50" : ""
                }`}
                onMouseEnter={() => setHighlight(oi)}
                onMouseDown={(e) => e.preventDefault()} // prevent losing focus before click
                onClick={() => selectValue(optionItem.value)}
              >
                {optionItem.label}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Optional: visually-hidden native select for accessibility (not required) */}
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SyledSelect;
