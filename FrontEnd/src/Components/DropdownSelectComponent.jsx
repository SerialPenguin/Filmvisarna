/** @format */
import "../pages/Booking.css";

function DropdownSelect({
  value,
  options,
  placeholder,
  onChangeHandler,
  additionalOnChange,
  onBlurHandler,
  customOptions,
}) {
  return (
    <select
      style={{ width: "100%", height: "30px" }}
      value={value}
      onBlur={(e) => {
        if (onBlurHandler) {
          onBlurHandler(e.target.value);
        }
      }}
      onChange={(e) => {
        const selectedValue = e.target.value;
        onChangeHandler(selectedValue);
        if (additionalOnChange) {
          additionalOnChange(selectedValue);
        }
      }}>
      <option value="">{placeholder}</option>
      {customOptions
        ? customOptions
        : options.map((option) => (
            <option
              key={option._id || option.week}
              value={option._id || option.week}>
              {option.title || `Vecka ${option.week}`}
            </option>
          ))}
    </select>
  );
}

export default DropdownSelect;
