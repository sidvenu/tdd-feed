const cleanSpecialCharacters = (s: string) => {
  return s.replaceAll(/[^a-z0-9\.,\s$]/gi, " ");
};

export const getSearchRegexFromSearchTerm = (
  searchTerm: string
): { searchRegex: RegExp; exactMatchStrings: string[] } => {
  const searchSplit = searchTerm.split('"');
  const exactMatchStrings = searchSplit.filter((_, i) => i % 2 === 1);
  const searchRegex = RegExp(
    searchSplit
      .map((v) => {
        return cleanSpecialCharacters(v.toLowerCase()).split(/[\.,\s]+/);
      })
      .flat()
      .join(".*"),
    "gi"
  );
  return { searchRegex, exactMatchStrings };
};
