import "@pnp/graph/users/index.js";
import "@pnp/graph/mail/index.js";
import { Message as IMessageType, EmailAddress as IEmailAddressType } from "@microsoft/microsoft-graph-types";
import { IEmail, IEmailAttachment, IEmailRecipient } from "../models/EmailModels.js";
import { IAppInsightUtil, MessageType, SeverityLevel } from './appinsightutil.js';
import { IAuthService } from './auth.js';

export async function sendMail(auth: IAuthService, apu: IAppInsightUtil, sender: string, responseEmail: IEmailAddressType, recipient: IEmailRecipient[], email: IEmail, attachments: IEmailAttachment[], bccList: IEmailRecipient[] = [], saveToSentItems: boolean = true): Promise<boolean> {
  const LOG_SOURCE = "sendMail";
  let retVal = false;
  try {
    const message: IMessageType = {
      "subject": email.EmailSubject,
      "body": {
        "contentType": "html",
        "content": email.EmailTemplate
      },
      "replyTo": [
        {
          "emailAddress": responseEmail
        }
      ],
      "toRecipients": [],
      "hasAttachments": (attachments.length > 0)
    };

    // Add the recipients
    for (let i = 0; i < recipient.length; i++) {
      message.toRecipients.push({ emailAddress: { address: recipient[i].EMail.trim(), name: recipient[i].FullName } });
    }

    // Add the BCC recipients
    if (bccList.length > 0) {
      message["bccRecipients"] = [];
      for (let i = 0; i < bccList.length; i++) {
        message["bccRecipients"].push({ emailAddress: { address: bccList[i].EMail.trim(), name: bccList[i].FullName } });
      }
    }

    // Add File Attachments
    for (let i = 0; i < attachments.length; i++) {
      if (attachments[i].fileBase64 != null) {
        if (message["attachments"] == null) { message["attachments"] = []; }
        message["attachments"].push({
          contentType: "application/pdf",
          size: Buffer.from(attachments[i].fileBase64).length,
          isInline: false,
          name: attachments[i].fileName
        });
        message.attachments[i]["@odata.type"] = "#microsoft.graph.fileAttachment";
        message.attachments[i]["contentBytes"] = Buffer.from(attachments[i].fileBase64).toString('base64');
      }
    }

    try {
      apu.Log(MessageType.Trace, {
        logSource: LOG_SOURCE,
        message: "Mail message body",
        severity: SeverityLevel.Verbose,
        properties: {
          method: "sendMail",
          message: JSON.stringify(message)
        }
      });
      await auth.graph.users.getById(sender).sendMail(message, saveToSentItems);
      retVal = true;
    } catch (err) {
      apu.Log(MessageType.Exception, {
        logSource: LOG_SOURCE,
        exception: err,
        severity: SeverityLevel.Critical,
        properties: {
          method: "sendMail - mail"
        }
      });
    }
  } catch (err) {
    apu.Log(MessageType.Exception, {
      logSource: LOG_SOURCE,
      exception: err,
      severity: SeverityLevel.Critical,
      properties: {
        method: "sendMail"
      }
    });
  }
  return retVal;
}