const regex = /\bg?e?such(?:t?|en?|e?)\b/gm;
/**
 * this filter allows to reduce amount of wrong apllications
 * for example when someone searching a house but creates an 
 * inserate of announcement type
 */
export const searchFilter = (sentence: string): boolean => {

    const words = sentence.split(' ')

    return words.some((word: string): boolean => regex.test(word))

}

export const vbFilter = (parsedPrice: string = ''): boolean => parsedPrice.trim() !== 'VB'