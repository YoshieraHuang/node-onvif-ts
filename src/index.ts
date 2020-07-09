type scream = string;

export default function scream(sentence: string): scream {
  return addExclamationPoints(sentence).toUpperCase();
}

export function addExclamationPoints(str: string): string {
  return str.replace(/\?/g, "?!").replace(/\.$/, "!!!");
}