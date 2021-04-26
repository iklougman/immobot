import { searchFilter } from './filters'

describe('should compare two objects and return differences', () => {
    it('should return true if there are "suche" words', () => {
        const slug = "lorem ipsum sucht ein Zuhause"
        expect(searchFilter(slug)).toBeTruthy()
    });

    it('should return true if there are "suche" words', () => {
        const slug = "lorem ipsum lkfrflkrmf ölermg rgmer rgeör"
        expect(searchFilter(slug)).toBeFalsy()
    });
})