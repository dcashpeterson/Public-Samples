export interface IEmail {
  EmailSubject: string;
  EmailTemplate: string;
}

export interface IEmailAttachment {
  fileName: string;
  fileBase64?: ArrayBuffer;
  fileShareUrl?: string;
}

export interface IEmailRecipient {
  EMail: string;
  Greeting?: string;
  FullName: string;
}