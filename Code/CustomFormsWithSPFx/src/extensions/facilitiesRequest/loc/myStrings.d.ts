declare interface IFacilitiesRequestFormCustomizerStrings {
  issueTypeValues: string[];
  severityValues: string[];
  statusValues: string[];
  
  newRequestIntro: string;
  issueTypeLabel: string;
  locationLabel: string;
  reportedDateLabel: string;
  severityLabel: string;
  issueDescriptionLabel: string;
  imageLabel: string;
  reportedByLabel: string;
  equipmentIdLabel: string;
  assigneeLabel: string;
  verificationDateLabel: string;
  requestStatusLabel: string;
  additionalCommentsLabel: string;
  estimatedResolutionDateLabel: string;
  resolvedByLabel: string;
  resolutionDateLabel: string;
  resolutionDescriptionLabel: string;
  reviewDateLabel: string;
  reviewerLabel: string;
  reviewNotesLabel: string;
  inspectionDateLabel: string;
  editRequestHeader: string;
  errorHeader: string;
  
  reportIssueButton: string;
  cancelButton: string;
  editReportButton: string;
  updateReportButton: string;
  editReviewButton: string;
  invalidateReportButton: string;
  validateReportButton: string;
  unableToResolveButton: string;
  completedButton: string;
  editResolutionButton: string;
  
  reportedIssueHeader: string;
  reviewAssignHeader: string;
  issueResolutionHeader: string;
}

declare module 'FacilitiesRequestFormCustomizerStrings' {
  const strings: IFacilitiesRequestFormCustomizerStrings;
  export = strings;
}
