export function getNameWithoutOrderPrefix(name: string) {
    const match = name.match('^[0-9]{3} (.*)');
    return match?.[1] ?? "Name is not repescting format, it should start with 3 digits followed by a space.";
  }
  
export function getNameWithoutExtensionSuffix(name: string) {
  const match = name.match('(.+?)(\.[^(.|\n)]*$|$)');
  return match?.[1] ?? `Failed to remove extension from name ${name}`;
}
  