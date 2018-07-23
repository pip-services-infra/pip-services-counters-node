let PerfMonProcess = require('../obj/src/container/PerfMonProcess').PerfMonProcess;

try {
    new PerfMonProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
