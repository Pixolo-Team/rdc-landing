// REACT //
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
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}

const Select: React.FC<Props> = ({
  id,
  label,
  options,
  value,
  onChange,
  disabled,
}) => {
  return (
    <div className="w-full ">
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full cursor-pointer text-xl text-n-900 bg-transparent border-b border-n-900/80 placeholder-n-950 placeholder:font-medium focus:outline-none focus:border-sky-500 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="" className="text-n-500">
          {label}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-n-900">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
