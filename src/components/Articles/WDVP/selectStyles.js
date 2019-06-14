export default {
  colors: {
    primary: "#114D4D",
    primary50: "#e0e9ee",
    primary25: "#e0e9ee",
  },
  borderRadius: 6,
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected ? data.color : isFocused ? `${data.color}22` : null,
      color: isDisabled
        ? '#e0e9ee'
        : isSelected
          ? "white"
          : data.color,
    };
  },
  multiValue: (styles, { data }) => {
    return {
      ...styles,
      backgroundColor: `${data.color}22`,
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  })
}