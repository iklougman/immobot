import { regexFilter } from './filters'

describe('should compare two objects and return differences', () => {
    it('should return true if there are "suche" words', () => {
        const slug = "lorem ipsum sucht ein Zuhause"
        expect(regexFilter(slug)).toBeTruthy()
    });

    it('should return true if there are "gesucht" words', () => {
        const slug = "lorem ipsum gesucht ein Zuhause"
        expect(regexFilter(slug)).toBeTruthy()
    });

    it('should return true if there are "Suchen" words', () => {
        const slug = "Suchen lorem ipsum ein Zuhause"
        console.log('Suchen', regexFilter(slug))
        expect(regexFilter(slug)).toBeTruthy()
    });

    it('should return true if there are "suche" words', () => {
        const slug = "lorem ipsum lkfrflkrmf ölermg rgmer rgeör"
        expect(regexFilter(slug)).toBeFalsy()
    });
})