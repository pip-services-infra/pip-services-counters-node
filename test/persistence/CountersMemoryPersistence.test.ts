let _ = require('lodash');

import { CountersMemoryPersistence } from '../../src/persistence/CountersMemoryPersistence';
import { CountersPersistenceFixture } from './CountersPersistenceFixture';

suite('CountersMemoryPersistence', ()=> {
    let persistence: CountersMemoryPersistence;
    let fixture: CountersPersistenceFixture;

    suiteSetup((done) => {
        persistence = new CountersMemoryPersistence();
        fixture = new CountersPersistenceFixture(persistence);
        done();
    });
    
    setup((done) => {
        persistence.clear(null, done);
    });

    test('Read and Write', (done) => {
        fixture.testReadWrite(done);
    });

});