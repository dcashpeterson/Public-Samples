import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from "@azure/functions";
import { AppInsightUtil, MessageType, SeverityLevel } from "../common/appinsightutil.js";


const queueOutput = output.storageQueue({
  queueName: process.env.NotificationQueuePath,
  connection: 'AzureWebJobsStorage',
});

interface EventGridEvent {
    id: string;
    eventType: string;
    subject: string;
    dataVersion: string;
    metadataVersion: string;
    eventTime: string;
    data: any;
}

interface ValidationEvent {
    validationCode: string;
    validationUrl: string;
}

export async function handleListChange(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const LOG_SOURCE = "handleListChange";
  const _apu = new AppInsightUtil();
  _apu.Init(context.invocationId);

  _apu.Log(MessageType.Event, {
    logSource: `${LOG_SOURCE}`,
    properties: {
      source: LOG_SOURCE,
      message: "Starting list item change http trigger"
    }
  });

  try {
    const events = await request.json() as EventGridEvent[];
    // Handle Event Grid validation handshake
    if (events[0]?.eventType === 'Microsoft.EventGrid.SubscriptionValidationEvent') {
        const validationData = events[0].data as ValidationEvent;
        context.log('Handling Event Grid validation request');
        
        return {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                validationResponse: validationData.validationCode 
            })
        };
    }
    context.extraOutputs.set(queueOutput, JSON.stringify(events));
    return { status: 200 };
  } catch (err) {
    _apu.Log(MessageType.Exception, {
      logSource: LOG_SOURCE,
      exception: err,
      severity: SeverityLevel.Critical,
      properties: {
        method: "handleListChange"
      }
    });
  }
};

app.http('handleListChange', {
  methods: ['POST'],
  authLevel: 'anonymous',
  extraOutputs: [queueOutput],
  handler: handleListChange
});

