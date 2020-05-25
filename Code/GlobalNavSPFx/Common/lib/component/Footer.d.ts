import * as React from 'react';
import ILink from '../model/ILink';
export interface IFooterProps {
    message: string;
    links: ILink[];
}
export declare class Footer extends React.Component<IFooterProps, {}> {
    constructor(props: IFooterProps);
    render(): JSX.Element;
}
