declare interface IVacationRequestFormCustomizerStrings {
  Save: string;
  Cancel: string;
  Close: string;
  Approve: string;
  Reject: string;
  NewStatusMessage: string;
  PendingStatusMessage: string;
  ApprovedStatusMessage: string;
  RejectedStatusMessage: string;
  NoResultsMessage: string;
  NewFormIntro: string;
  EditFormIntro: string;
  StartDateLabel: string;
  EndDateLabel: string;
  FormDisabled: string;
}

declare module 'VacationRequestFormCustomizerStrings' {
  const strings: IVacationRequestFormCustomizerStrings;
  export = strings;
}
