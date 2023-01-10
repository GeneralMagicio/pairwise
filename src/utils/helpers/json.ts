export const isJSON = (str: string) => {
  try {
    return JSON.parse(str) && !!str
  } catch (e) {
    return false
  }
}
