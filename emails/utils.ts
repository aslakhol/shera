export const formatHostNamesShort = (hosts: Array<{ name: string | null }>) => {
  const namesWithValues = hosts
    .filter((h) => h.name !== null)
    .map((h) => h.name!);

  if (namesWithValues.length === 0) {
    return "the host";
  }

  if (namesWithValues.length <= 3) {
    return namesWithValues.join(", ").replace(/, ([^,]*)$/, " and $1");
  }

  return `the hosts`;
};

export const infoBoxFormatHostNames = (
  hosts: Array<{ name: string | null }>,
) => {
  const namesWithValues = hosts
    .filter((h) => h.name !== null)
    .map((h) => h.name!);

  if (namesWithValues.length === 0) {
    return null;
  }

  if (namesWithValues.length <= 3) {
    return namesWithValues.join(", ").replace(/, ([^,]*)$/, " and $1");
  }

  return `${namesWithValues[0]} and ${namesWithValues.length - 1} others`;
};
