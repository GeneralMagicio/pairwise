/**
 * Takes one search string and text string or string array.
 * Returns true if the search string is included in at least
 * one of the text items. It performs a lowercase search.
 * @param search text search
 * @param text text to be searched on
 * @returns boolean stating if the search is included in the text.
 */
export const textSearch = (
  search: string,
  text: string | Array<string | null>
): boolean => {
  const checkIncludesLowerCase = (text: string, search: string) =>
    text.toLowerCase().includes(search.toLowerCase())
  if (typeof text === 'string') {
    return checkIncludesLowerCase(text, search)
  }
  return text.some((item) => checkIncludesLowerCase(item || '', search))
}
