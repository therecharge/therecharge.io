const localTime = new Date();

export const timezone = Math.abs(localTime.getTimezoneOffset() / 60);
