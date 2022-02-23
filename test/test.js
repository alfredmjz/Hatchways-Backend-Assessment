const request = require('request');
const expect  = require("chai").expect;
const app = require('../server.js') //Execute with server.js when running the test cases

describe('Hatchways Backend Assessment', function(){

  describe('Step 1 - Validation', function(){
    it('should return status code 200 upon successful connection', function(done){
      request.get("http://localhost:3000/api/ping", function(err, res, body){
        expect(res.statusCode).to.equal(200);
        done();
      })
    });

    it('should return status code 404 upon wrong route', function(done){
      request.get("http://localhost:3000/api/pinggg", function(err, res, body){
        expect(res.statusCode).to.equal(404);
        done();
      })
    });

    it('should return the success body for step 1', function(done){
      request.get("http://localhost:3000/api/ping", function(err, res, body){
        expect(res.body).to.equal('{"success":true}');
        done();
      })
    });
  });

  describe('Step 2 - Data Fetching', function(){
    it('should return status code 200 upon successful connection with correct route', function(done){
      request.get("http://localhost:3000/api/posts?tags=history", function(err, res, body){
        expect(res.statusCode).to.equal(200);
        done();
      })
    });

    it('should return status code 404 upon incorrect route without "tags" field', function(done){
      request.get("http://localhost:3000/api/postssss", function(err, res, body){
        expect(res.statusCode).to.equal(404);
        done();
      })
    });

    it('should return appropriate body and status code 400 when "tags" field is incorrect', function(done){
      request.get("http://localhost:3000/api/posts?tag=history", function(err, res, body){
        expect(res.body).to.equal('{"error":"Tags parameter is required"}');
        expect(res.statusCode).to.equal(400);
        done();
      })
    });

    it('should return appropriate body and status code 400 when "tags" field is not filled', function(done){
      request.get("http://localhost:3000/api/posts?tags=", function(err, res, body){
        expect(res.body).to.equal('{"error":"Tags parameter is required"}');
        expect(res.statusCode).to.equal(400);
        done();
      })
    });

    it('should return appropriate body and status code 400 when "tags" field is missing', function(done){
      request.get("http://localhost:3000/api/posts/", function(err, res, body){
        expect(res.body).to.equal('{"error":"Tags parameter is required"}');
        expect(res.statusCode).to.equal(400);
        done();
      })
    });

    it('should return status code 200 even if "tags" field is in the wrong order', function(done){
      request.get("http://localhost:3000/api/posts?sortBy=id&tags=history", function(err, res, body){
        expect(res.statusCode).to.equal(200);
        done();
      })
    });

    it('should return status code 200 when all 3 parameters exist', function(done){
      request.get("http://localhost:3000/api/posts?tags=history&sortBy=likes&direction=desc", function(err, res, body){
        expect(res.statusCode).to.equal(200);
        done();
      })
    });

    it('should return status code 200 when "tags" field take more than 1 argument', function(done){
      request.get("http://localhost:3000/api/posts?tags=history,tech", function(err, res, body){
        expect(res.statusCode).to.equal(200);
        done();
      })
    });

    it('should pass the test for using required field (tags) with more than 1 argument and using default options for optional field', function(done) {
      request.get("http://localhost:3000/api/posts?tags=history,tech&sortBy&direction", function(err, res, body){
        let result = JSON.parse(body).posts;
        let arrID = [];
        let test = true;
        //Get all "Id" for default identifier of sortBy
        for (let i = 0; i < result.length; i++) {
          arrID.push(result[i].id)
        }

        //Check if the ids is sorted in ascending order
        //If a single value is wrongly sorted, break from the loop
        for (let i = 0; i < arrID.length; i++) {
          if (arrID[i] > arrID[i + 1]) {
            test = false;
            break
          }
        }
        expect(test).to.equal(true);
        done();
      })
    });

    it('should pass the test when the result does not have duplicate Id', function(done){
      request.get("http://localhost:3000/api/posts?tags=history,tech", function(err, res, body){
        let result = JSON.parse(body).posts;
        let arrID = []
        let dupIdHashmap = {}
        let test = true;

        //Refine response data to only hold "Id" attribute
        for(var i = 0; i < result.length; i++){
            arrID.push(result[i].id)
        };

        //Implement hashmap to count the number of occurance for a particular Id
        arrID.forEach(key => {
          if(!dupIdHashmap[key]){
            dupIdHashmap[key] += 1
          }
            dupIdHashmap[key] = 1
        })

        //Set test as false and break from loop if a single hash value has more than 1
        for (key in dupIdHashmap) {
          if (dupIdHashmap[key] > 1) {
            test = false
            break;
          }
        }

        expect(test).to.equal(true);
        done();
      });
    });

    it('should pass the test if result is correctly sorted by its identifier', function(done){
      request.get("http://localhost:3000/api/posts?tags=history,tech&sortBy=reads&direction=desc", function(err, res, body){
        let result = JSON.parse(body).posts;
        let allIdentifier = []
        let test = true;

        //Refine response data to only hold "reads" attribute (Set by user)
        for(i = 0; i < result.length; i++){
          allIdentifier.push(result[i].reads)
        };

        //Check if the response data is sorted in descending order (Set by user)
        for (i = 0; i < allIdentifier.length; i++) {
          if (allIdentifier[i] < allIdentifier[i + 1]) {
            test = false;
            break;
          }
        }

        expect(test).to.equal(true);
        done();
      })
    });

  });
});
