define([], function() {
  return {
    "issueTypeValues": ["Electrical", "Plumbing", "HVAC", "Safety Hazard"],
    "severityValues": ["Low", "Medium", "High", "Urgent"],
    "statusValues": ["Reported","Pending Verification", "Verified", "Resolved","Closed", "Unable to Resolve"],
    
    "newRequestIntro": "To submit a new facilities issue please fill out the name of the requestor (if not you) and a description of the issue. Please be as specific as possible. Your issue will be reviewed and assigned to the appropriate department.",
    "issueTypeLabel": "Issue Type",
    "locationLabel": "Location",
    "reportedDateLabel": "Reported Date",
    "severityLabel": "Severity",
    "issueDescriptionLabel": "Issue Description",
    "issueDescriptionDescription": "lease provide a detailed explanation of the issue that help the team understand the situation. Minimum of 20 characters and a maximum of 500 characters.",
    "imageLabel": "Image",
    "reportedByLabel": "Reported By",
    "equipmentIdLabel": "Equipment ID or Asset ID",
    "equipmentIdDescription": "Unique identifier assigned to the equipment or asset. Watch out for a label with in the form ACME-1234-5678",
    "assigneeLabel": "Assigned To",
    "assigneeDescription": "Select the person who will be responsible for resolving the issue.",
    "verificationDateLabel": "Verification Date",
    "requestStatusLabel": "Status",
    "additionalCommentsLabel": "Comments",
    "additionalCommentsDescription": "Additional information or notes about the issue. Include any relevant details or observations that may help in resolving the issue. If there are any special instructions or considerations, please include them here.",
    "estimatedResolutionDateLabel": "Estimated Resolution Date",
    "estimatedResolutionDateDescription": "Estimated date that the issue should be resolved. This should be based on the current state of the asset and the estimated effort required to fix the issue.",
    "resolvedByLabel": "Resolved By",
    "resolutionDateLabel": "Resolution Date",
    "resolutionDateDescription": "Actual date the issue was resolved.",
    "resolutionDescriptionLabel": "Resolution Description",
    "resolutionDescriptionDescription": "Please provide a detailed explanation of the resolution to the issue. Include any relevant actions taken to address the problem. Remember to include any necessary documentation or updates to the asset's inventory. Also, be sure to include any follow-up steps or recommendations for future maintenance.",
    "reviewDateLabel": "Review Date",
    "reviewedByLabel": "Reviewer",
    "reviewNotesLabel": "Reviewer Notes",
    "inspectionDateLabel": "Next Inspection Date",
    "inspectionDateDescription": "If a follow-up inspection is required, please provide the date that the inspection should be completed.",
    "editRequestHeader": "Edit Request",
    "errorHeader": "The form is not valid. Please fix the following errors and try again.",
    
    "reportIssueButton": "Report Issue",
    "cancelButton": "Cancel",
    "editReportButton": "Edit Report",
    "updateReportButton": "Update Report",
    "editReviewButton"  : "Edit Review",
    "invalidateReportButton": "Invalidate Report",
    "validateReportButton": "Validate Report",
    "unableToResolveButton": "Unable to Resolve",
    "completedButton": "Completed",
    "editResolutionButton": "Edit Resolution",
    
    "reportedIssueHeader": "Reported Issue",
    "reviewAssignHeader": "Review and Assign",
    "issueResolutionHeader" : "Issue Resolution",    
  }
});