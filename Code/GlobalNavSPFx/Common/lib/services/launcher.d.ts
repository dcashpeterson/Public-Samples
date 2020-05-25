export interface ILauncherProps {
    domElement: HTMLDivElement;
    reactControl: any;
    controlProps: any;
}
export interface ILauncher {
    launch: () => void;
}
export declare class Launcher implements ILauncher {
    private domElementHeader;
    private reactControl;
    private controlProps;
    constructor(props: ILauncherProps);
    launch(): void;
    private renderHeader;
}
