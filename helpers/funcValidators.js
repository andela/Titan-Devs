export const isEmpty = value => {
  return (
    typeof value === "undefined" ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && !value.trim().length)
  );
};
export const isEmailValid = () => {
  return true;
};
