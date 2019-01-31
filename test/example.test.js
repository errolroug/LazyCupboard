var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server");
var db = require("../models");
var expect = chai.expect;

// Setting up the chai http plugin
chai.use(chaiHttp);

var request;

describe("GET /api/ingredients", function() {
  // Before each test begins, create a new request server for testing
  // & delete all examples from the db
  beforeEach(function() {
    request = chai.request(server);
    return db.sequelize.sync({ force: true });
  });

  it("should find all ingredients", function(done) {
    // Add some examples to the db to test with

    
    db.Measurements.bulkCreate([
      { measurementType: "cup", createdAt: "2019-01-30 19:46:18", updatedAt: "2019-01-30 19:46:18" },
      { measurementType: "teaspoon", createdAt: "2019-01-30 19:46:18", updatedAt: "2019-01-30 19:46:18" }
    ]).then(function(measurements) {

      db.Ingredients.bulkCreate([
        { name: "Chicken Breasts", quantity: 2, MeasurementID: null, createdAt: "2019-01-30 19:46:18", updatedAt: "2019-01-30 19:46:18" },
        { name: "Rice", quantity: 1, MeasurementID: 1, createdAt: "2019-01-30 19:46:18", updatedAt: "2019-01-30 19:46:18" }
      ]).then(function() {
        // Request the route that returns all examples
        request.get("/api/ingredients").end(function(err, res) {
          var responseStatus = res.status;
          var responseBody = res.body;
  
          // Run assertions on the response
  
          expect(err).to.be.null;
  
          expect(responseStatus).to.equal(200);
  
          expect(responseBody)
            .to.be.an("array")
            .that.has.lengthOf(2);
  
          expect(responseBody[0])
            .to.be.an("object")
            .that.includes({ name: "Chicken Breasts", quantity: 2 });
  
          expect(responseBody[1])
            .to.be.an("object")
            .that.includes({ name: "Rice", quantity: 1 });
  
          // The `done` function is used to end any asynchronous tests
          done();
        })

      });
    });
    });
  });
