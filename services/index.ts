export const trimString = (input: string) => {
  if (input.length > 14) {
    return `${input.substring(0, 12)}...`;
  }
  return input;
};

export * from "./ens";
