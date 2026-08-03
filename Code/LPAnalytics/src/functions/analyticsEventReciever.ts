import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from "@azure/functions";
import { AppInsightUtil, MessageType, SeverityLevel } from "../common/appinsightutil.js";
import { ILPAnalyticsEvent } from "../models/analyticsModels.js";

const queueOutput = output.storageQueue({
  queueName: process.env.CompleteQueuePath,
  connection: 'AzureWebJobsStorage',
});

export async function analyticsEventReciever(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const LOG_SOURCE = "analyticsEventReciever";
  const _apu = new AppInsightUtil();
  _apu.Init(context.invocationId);

  _apu.Log(MessageType.Event, {
    logSource: `${LOG_SOURCE}`,
    properties: {
      source: LOG_SOURCE,
      message: "Starting provision complete http trigger"
    }
  });

  try {
    //Recieves the http post converts it to a JSON object and puts it on the queue
    var requestBody = await request.json();
    var data: ILPAnalyticsEvent = requestBody as ILPAnalyticsEvent;
    context.extraOutputs.set(queueOutput, JSON.stringify(data));
    return { status: 200 };
  } catch (err) {
    _apu.Log(MessageType.Exception, {
      logSource: LOG_SOURCE,
      exception: err,
      severity: SeverityLevel.Critical,
      properties: {
        method: "analyticsEventReciever"
      }
    });
  }
};

app.http('analyticsEventReciever', {
  methods: ['POST'],
  authLevel: 'anonymous',
  extraOutputs: [queueOutput],
  handler: analyticsEventReciever,
});

