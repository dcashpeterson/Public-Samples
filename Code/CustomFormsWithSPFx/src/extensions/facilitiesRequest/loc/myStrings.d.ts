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
  issueDescriptionDescription: string;
  imageLabel: string;
  reportedByLabel: string;
  equipmentIdLabel: string;
  equipmentIdDescription: string;
  assigneeLabel: string;
  assigneeDescription: string;
  verificationDateLabel: string;
  requestStatusLabel: string;
  additionalCommentsLabel: string;
  additionalCommentsDescription: string;
  estimatedResolutionDateLabel: string;
  estimatedResolutionDateDescription: string;
  resolvedByLabel: string;
  resolutionDateLabel: string;
  resolutionDateDescription: string;
  resolutionDescriptionLabel: string;
  resolutionDescriptionDescription: string;
  reviewDateLabel: string;
  reviewerLabel: string;
  reviewNotesLabel: string;
  inspectionDateLabel: string;
  inspectionDateDescription: string;
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
