export const getCurrentUnixTimestamp = () => {
  return Math.round(+new Date() / 1000);
};
