import gulp = require('gulp');
import Orchestrator = require('orchestrator');
/**
 * A helper utility for gulp which can be extended to provide additional features to gulp vinyl streams
 */
export declare class GulpProxy extends Orchestrator {
    src: gulp.SrcMethod;
    dest: gulp.DestMethod;
    watch: gulp.WatchMethod;
    constructor(gulpInstance: gulp.Gulp);
    task(): any;
}
//# sourceMappingURL=GulpProxy.d.ts.map