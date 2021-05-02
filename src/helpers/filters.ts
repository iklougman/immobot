const regex = /\bg?e?such(?:t?|en?|e?)\b/gm;
/**
 * this filter allows to reduce amount of wrong apllications
 * for example when someone searching a house but creates an 
 * inserate of announcement type
 */
export const regexFilter = (sentence: string): boolean => {

    const words = sentence.split(' ')

    return words.some((word: string): boolean => regex.test(word.toLowerCase()))

}

export const isVBPrice = (parsedPrice: string = ''): boolean => parsedPrice.trim() !== 'VB'