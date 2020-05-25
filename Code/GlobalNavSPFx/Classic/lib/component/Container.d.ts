import * as React from "react";
import { ILibItem } from "@dcashpeterson/globalnavcommon";
export interface IContainerProps {
    items: ILibItem[];
}
export interface IContainerState {
}
export declare class ContainerState implements IContainerState {
    constructor();
}
export default class Container extends React.Component<IContainerProps, IContainerState> {
    private LOG_SOURCE;
    constructor(props: any);
    render(): React.ReactElement<IContainerProps>;
}
