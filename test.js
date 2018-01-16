let assert = require('chai').assert;

let bunyan = require('bunyan');
let logger = bunyan.createLogger({ name: 'mocha-test', level: bunyan.TRACE });
let integration = require('./integration');

integration.startup(logger);

const GOOD_IP_1 = '111.111.111.111';
const GOOD_IP_2 = '222.222.222.222';
const MISSING_IP = '999.999.999.999';
const MISSING_CONTAINER_IP = '123.123.123.123';

describe('Polarity Phantom Integration', () => {
    function getOptions() {
        return {
            host: 'https://localhost:5555',
            rejectUnauthorized: false
        };
    }
    describe('displaying events', () => {
        it('should display events that match a given ip', (done) => {
            integration.doLookup([{ value: GOOD_IP_1 }], getOptions(), (err, result) => {
                if (err) {
                    done(err);
                } else {
                    assert.isNotEmpty(result, 'got no results back');
                    assert.equal(result.length, 1);
                    assert.equal(GOOD_IP_1, result[0].data.details[0].tags[0])
                    done();
                }
            });
        });

        it('should display events that match a different ip', (done) => {
            integration.doLookup([{ value: GOOD_IP_2 }], getOptions(), (err, result) => {
                if (err) {
                    done(err);
                } else {
                    assert.isNotEmpty(result, 'got no results back');
                    assert.equal(result.length, 1);
                    assert.equal(GOOD_IP_2, result[0].data.details[0].tags[0])
                    done();
                }
            });
        });

        it('should display all events when passed multiple entities', (done) => {
            integration.doLookup([{ value: GOOD_IP_1 }, { value: GOOD_IP_2 }], getOptions(), (err, result) => {
                if (err) {
                    done(err);
                } else {
                    assert.isNotEmpty(result, 'got no results back');
                    assert.equal(result.length, 2);
                    assert.equal(GOOD_IP_1, result[0].data.details[0].tags[0])
                    assert.equal(GOOD_IP_2, result[1].data.details[0].tags[0])
                    done();
                }
            });
        });

        it('should handle entities with no matching search results', (done) => {
            integration.doLookup([{ value: MISSING_IP }], getOptions(), (err, result) => {
                if (err) {
                    done(err);
                } else {
                    assert.isEmpty(result, 'got some results back');
                    done();
                }
            });
        });

        it('should handle missing containers in phantom', (done) => {
            integration.doLookup([{ value: MISSING_CONTAINER_IP }], getOptions(), (err, result) => {
                assert.isOk(err, 'no error was returned');
                assert.equal(err.message, 'error looking up container 999');
                done();
            });
        });
    });

    describe('taking action on events', () => {

        it('should allow approval on playbooks for a given event???', () => {
            assert.isOk(false, 'test not implemented');
        });
    });

    describe('option validation', () => {
        function checkRequire(option, done) {
            let options = {};
            options[option] = '';

            integration.validateOptions(options, (_, errors) => {
                assert.equal(errors[0].key, option);
                done();
            });
        }
        it('should require a host', (done) => {
            checkRequire('host', done);
        });

        it('should pass when all values are provided', (done) => {
            integration.validateOptions({
                host: 'http://localhost:8080/'
            }, (_, errors) => {
                assert.isEmpty(errors);
                done();
            });
        });

        /*

            function validateOption(errors, options, optionName, errMessage) {
                if (typeof options[optionName].value !== 'string' ||
                    (typeof options[optionName].value === 'string' && options[optionName].value.length === 0)) {
                    errors.push({
                        key: optionName,
                        message: errMessage
                    });
                }
            }

        */
    });
});
