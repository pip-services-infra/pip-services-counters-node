let CountersProcess = require('../obj/src/container/CountersProcess').CountersProcess;

try {
    new CountersProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
