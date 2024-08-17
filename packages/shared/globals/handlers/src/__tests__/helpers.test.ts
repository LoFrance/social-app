import { firstLetterUpperCase, generateRandomUUIDs } from "../helpers";

describe('Helpers', () => {
  it('should capitalize only the first letter', () => {
    const word = 'tryToCapitalizeOnlythefirstONE'
    const result = firstLetterUpperCase(word)
    expect(result).toBe("Trytocapitalizeonlythefirstone");
  })

  it('should genereate random UUIDs', () => {
    const randomUUIDs = generateRandomUUIDs();
    console.log(randomUUIDs)
    expect(randomUUIDs).not.toBeNull();
  })
})