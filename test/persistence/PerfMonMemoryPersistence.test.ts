let _ = require('lodash');

import { PerfMonMemoryPersistence } from '../../src/persistence/PerfMonMemoryPersistence';
import { PerfMonPersistenceFixture } from './PerfMonPersistenceFixture';

suite('PerfMonMemoryPersistence', ()=> {
    let persistence: PerfMonMemoryPersistence;
    let fixture: PerfMonPersistenceFixture;

    suiteSetup((done) => {
        persistence = new PerfMonMemoryPersistence();
        fixture = new PerfMonPersistenceFixture(persistence);
        done();
    });
    
    setup((done) => {
        persistence.clear(null, done);
    });

    test('Read and Write', (done) => {
        fixture.testReadWrite(done);
    });

});