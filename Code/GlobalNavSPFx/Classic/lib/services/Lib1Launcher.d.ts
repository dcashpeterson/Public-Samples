import '../component/Lib1Styles.css';
import { ILink } from "@dcashpeterson/globalnavcommon";
export interface ILib1LauncherProps {
    domElement: HTMLDivElement;
    items: ILink[];
}
export interface ILib1Launcher {
    launch: () => void;
}
export declare class Lib1Launcher implements ILib1Launcher {
    private domElementHeader;
    private items;
    constructor(props: ILib1LauncherProps);
    launch(): void;
    private renderHeader;
}
