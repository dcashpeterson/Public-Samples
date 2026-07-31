import AppInsights from 'applicationinsights';
import { IAuthService } from './auth.js';
import { Message as IMessageType } from "@microsoft/microsoft-graph-types";
import "@pnp/graph/users/index.js";
import "@pnp/graph/mail/index.js";
import { IAppInsightUtil, MessageType, SeverityLevel } from './appinsightutil.js';

export async function sendNotification(auth: IAuthService, apu: IAppInsightUtil, subject: string, content: string): Promise<boolean> {
  const LOG_SOURCE = "sendNotification";
  let retVal = false;
  try {
    const message: IMessageType = {
      "subject": `SYSTEM NOTIFICATION: ${subject}`,
      "body": {
        "contentType": "html",
        "content": content
      },
      "toRecipients": [
        {
          "emailAddress": {
            "address": process.env.NotificationToEmailAddress,
            "name": "Automation"
          },
        }
      ]
    };
    await auth.graph.users.getById(process.env.MailAccountId).sendMail(message, true);
    retVal = true
  } catch (err) {
    apu.Log(MessageType.Exception, {
      logSource: LOG_SOURCE,
      exception: err,
      severity: SeverityLevel.Critical,
      properties: {
        method: "sendNotification"
      }
    });
  }
  return retVal;
}
