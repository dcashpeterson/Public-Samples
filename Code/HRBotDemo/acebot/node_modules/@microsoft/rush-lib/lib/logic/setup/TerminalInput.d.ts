export interface IBasePromptOptions {
    message: string;
}
export interface IPromptYesNoOptions extends IBasePromptOptions {
    defaultValue?: boolean | undefined;
}
export interface IPromptPasswordOptions extends IBasePromptOptions {
    /**
     * The string length must not be longer than 1.  An empty string means to show the input text.
     * @defaultValue `*`
     */
    passwordCharacter?: string;
}
export interface IPromptLineOptions extends IBasePromptOptions {
}
export declare class TerminalInput {
    private static _readLine;
    static promptYesNo(options: IPromptYesNoOptions): Promise<boolean>;
    static promptLine(options: IPromptLineOptions): Promise<string>;
    static promptPasswordLine(options: IPromptLineOptions): Promise<string>;
}
//# sourceMappingURL=TerminalInput.d.ts.map