declare interface IHelloWorldForTeamsWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'HelloWorldForTeamsWebPartStrings' {
  const strings: IHelloWorldForTeamsWebPartStrings;
  export = strings;
}
