import * as React from 'react';
import ILink from '../model/ILink';
import './HeaderFooter.module.scss';
export interface IHeaderProps {
    links: ILink[];
}
export default class Header extends React.Component<IHeaderProps, {}> {
    constructor(props: IHeaderProps);
    render(): JSX.Element;
}
