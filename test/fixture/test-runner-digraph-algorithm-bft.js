// Encapsule/jsgraph/test/fixture/test-runner-digraph-algorithm-bft.js
//

var assert = require('chai').assert;
var BFT = require('../../src/digraph-algorithm-bft');
var SearchPathRecorder = require('./bfv-results-recorder');

/*
  request = {
      testName: string
      validConfig: boolean
      request: breadthFirstTraverse request object
      expectedResults: {
          error: null or string
          result: null or JSON
          path: null or JSON
      }
*/

module.exports = function (testVector_) {

    var testName = "BFT test case: " + testVector_.testName + ":";

    describe(testName, function() {

        var searchResponse = null;
        var searchPathRecorder = null;

        before(function() {
            var visitor;
            if ((testVector_.request !== null) && testVector_.request && (testVector_.request.visitor !== null) && testVector_.request.visitor) {
                visitor = testVector_.request.visitor;
            }
            searchPathRecorder = new SearchPathRecorder(visitor);
            var bftRequest = testVector_.request;
            if (bftRequest) {
                bftRequest.visitor = searchPathRecorder.visitorInterface;
            }
            var executeRequestedBFT = function() {
                searchResponse = BFT(bftRequest);
            };
            assert.doesNotThrow(executeRequestedBFT);
        });

        it("The call to BFT should have returned a response object.", function() {
            assert.isDefined(searchResponse);
            assert.isNotNull(searchResponse);
            assert.isObject(searchResponse);
            assert.property(searchResponse, 'error');
            assert.property(searchResponse, 'result');
        });

        if (testVector_.validConfig) {

            describe("Test case is expected to pass. analyze the search results and recorded traversal path.", function() {
                it("searchResponse.error should be null.", function() {
                    assert.isNull(searchResponse.error);
                });

                it("searchResponse.result should match expected search response JSON.", function() {
                    assert.equal(JSON.stringify(searchResponse.result), testVector_.expectedResults.result);
                });

                it("actualSearchPath should match the expected search path JSON.", function() {
                    assert.equal(searchPathRecorder.toJSON(), testVector_.expectedResults.path);
                });
            });

        } else {

            describe("Test case is expected to fail. ensure the response error string is as expected.", function() {

                it("searchResponse.result should be null.", function() {
                    assert.isNull(searchResponse.result);
                });

                it("searchResponse.error should be a non-null string.", function() {
                    assert.isDefined(searchResponse.error);
                    assert.isNotNull(searchResponse.error);
                    assert.isString(searchResponse.error);
                });

                it("searchResponse.error string should match expected error string.", function() {
                    assert.equal(searchResponse.error, testVector_.expectedResults.error);
                });
                
            });

        }

    });
    
};
