import { app, InvocationContext, input, output } from "@azure/functions";
import { AppInsightUtil, MessageType, SeverityLevel } from "../common/appinsightutil.js";
import { AuthService } from "../common/auth.js";
import { ILPAnalyticsEvent } from "../models/analyticsModels.js";
import { ListService } from "../services/listService.js";
import { TableService } from "../services/tableService.js";

export async function processEventQueue(queueItem: ILPAnalyticsEvent, context: InvocationContext): Promise<void> {
  const LOG_SOURCE = "processEventQueue";
  const _apu = new AppInsightUtil();
  _apu.Init(context.invocationId);

  _apu.Log(MessageType.Event, {
    logSource: `${LOG_SOURCE}`,
    properties: {
      source: LOG_SOURCE,
      message: "Starting notification queue trigger"
    }
  });

  try {
    const auth = new AuthService(_apu);
    const initialized = await auth.Init();
    let result = false;
    if (initialized) {
      const ls = new ListService(_apu, auth);
      const ts = new TableService(_apu, auth);
      const listResult = await ls.Process(queueItem);
      const tableResult = await ts.Process(queueItem);
      result = listResult && tableResult;
    }
    _apu.Log(MessageType.Trace, {
      message: `Completed: Initialized ${initialized} - Processed Provisioning ${result}`,
      logSource: LOG_SOURCE,
      properties: {
        initialized: initialized,
        provisionProcessed: result
      },
      severity: (result) ? SeverityLevel.Information : SeverityLevel.Critical
    });
    if (!result) {
      throw Error(``);
    }
  } catch (err) {
    _apu.Log(MessageType.Exception, {
      logSource: LOG_SOURCE,
      exception: err,
      severity: SeverityLevel.Critical,
      properties: {
        method: "processEventQueue"
      }
    });
    throw Error(`Queue item was not processed.`);
  }
}

app.storageQueue('processEventQueue', {
  queueName: process.env.CompleteQueuePath,
  connection: 'AzureWebJobsStorage',
  handler: processEventQueue
});
