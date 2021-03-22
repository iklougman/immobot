// import { fs, vol } from 'memfs';
import fs from 'fs'
import { findDiffs } from './createTelegramMessage'
import { oldFindings, newFindings } from '../fixtures'

describe('should compare two objects and return differences', () => {
    it('should return 1 diff', () => {
        jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(oldFindings))
        jest.spyOn(fs, 'writeFile').mockReturnValue()
        const result = findDiffs(newFindings)
        console.log(result)
        expect(result).toHaveLength(1)
    });

    it('should return  2 diff if no json file stored', () => {
        jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify([]))
        jest.spyOn(fs, 'writeFile').mockReturnValue()
        const result = findDiffs(newFindings)
        expect(result).toHaveLength(2)
    });

    it('should return  no finding when new data is []', () => {
        jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(oldFindings))
        jest.spyOn(fs, 'writeFile').mockReturnValue()
        const result = findDiffs([])
        expect(result).toHaveLength(0)
    });
})
