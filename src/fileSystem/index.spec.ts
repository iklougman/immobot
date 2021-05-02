// import fs from 'fs'
import { checkFileIsPresent } from '.'

describe('should do multiple actions with files', () => {
    it('should return false when there is no file', () => {
        expect(checkFileIsPresent('123')).toBeFalsy()
    });

    it('return true when file is found', () => {
        expect(checkFileIsPresent('mock')).toBeTruthy()
    });

    // TODO: add some fs mocks
})
