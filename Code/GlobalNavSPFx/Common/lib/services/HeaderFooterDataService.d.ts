import IHeaderFooterData from '../model/IHeaderFooterData';
export default class HeaderFooterDataService {
    static get(url: string): Promise<IHeaderFooterData | string>;
}
