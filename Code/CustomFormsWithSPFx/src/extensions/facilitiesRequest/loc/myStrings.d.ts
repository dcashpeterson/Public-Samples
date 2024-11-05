declare interface IFacilitiesRequestFormCustomizerStrings {
  statusValues: string[];
  saveButton: string;
  cancelButton: string;
  errorHeader: string;
  newRequestHeader: string;
  newRequestIntro: string;
  editRequestHeader: string;
  requestorLabel: string;
  requestDescriptionLabel: string;
  responsibleDepartmentLabel: string;
  assigneeLabel: string;
  serviceNotesLabel: string;
}

declare module 'FacilitiesRequestFormCustomizerStrings' {
  const strings: IFacilitiesRequestFormCustomizerStrings;
  export = strings;
}
