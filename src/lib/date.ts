export const localDateString = (date = new Date()): string => {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

export const localDateAfter = (milliseconds: number): string => localDateString(new Date(Date.now() + milliseconds));
