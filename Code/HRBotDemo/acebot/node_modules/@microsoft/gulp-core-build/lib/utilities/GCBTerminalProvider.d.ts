import { TerminalProviderSeverity, ConsoleTerminalProvider } from '@rushstack/node-core-library';
import { GulpTask } from '../tasks/GulpTask';
/**
 * @public
 */
export declare class GCBTerminalProvider<TTask = {}> extends ConsoleTerminalProvider {
    private _gcbTask;
    constructor(gcbTask: GulpTask<TTask>);
    write(data: string, severity: TerminalProviderSeverity): void;
}
//# sourceMappingURL=GCBTerminalProvider.d.ts.map