import IFinding from '../types/IFinding';
export declare const constructSingleMessage: (diff: IFinding) => string;
/**
 * add some logic for many matches. Send list of matches instead off annoying messages
 */
export declare const writingFile: (findings: any) => void;
export declare const readFile: (filePath?: string, fileName?: string) => any;
export declare const findMatches: (findings?: never[]) => never[];
export declare const textFilter: (titleString: string) => void;
