import * as React from "react";
import './Lib2Styles.css';
export interface ILibItem {
    title: string;
    description: string;
    url: string;
}
export interface IContainerItemProps {
    item: ILibItem;
}
export interface IContainerItemState {
}
export declare class ContainerItemState implements IContainerItemState {
    constructor();
}
export default class ContainerItem extends React.Component<IContainerItemProps, IContainerItemState> {
    private LOG_SOURCE;
    constructor(props: any);
    private onClick;
    render(): React.ReactElement<IContainerItemProps>;
}
