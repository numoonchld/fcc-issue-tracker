/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha', 
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          // fill me in too!
          assert.equal( res.body.issue_title , 'Title' ); 
          assert.equal( res.body.issue_text , 'text' ); 
          assert.equal( res.body.created_by , 'Functional Test - Every field filled in' ); 
          assert.equal( res.body.assigned_to , 'Chai and Mocha' ); 
          assert.equal( res.body.status_text , 'In QA' ); 
          done(); // A mechanism to notify the testing framework that the callback has completed. Otherwise, the test will pass before the assertions are checked.
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: 'Title',
            issue_text: 'text',
            created_by: 'Required fields filled in'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            // fill me in too!
            assert.equal( res.body.issue_title , 'Title' ); 
            assert.equal( res.body.issue_text , 'text' ); 
            assert.equal( res.body.created_by , 'Required fields filled in' ); 
            done(); // A mechanism to notify the testing framework that the callback has completed. Otherwise, the test will pass before the assertions are checked.
          });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          assigned_to: 'Chai and Mocha', 
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          // fill me in too!
          assert.equal( res.body.message , 'Required fields are missing' ); 
          done(); // A mechanism to notify the testing framework that the callback has completed. Otherwise, the test will pass before the assertions are checked.
        });  
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '5c1b4671819a31372e7b5cfb'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          // fill me in too!
          assert.equal(res.body.message, 'no updated field sent' ); 
          done(); // A mechanism to notify the testing framework that the callback has completed. Otherwise, the test will pass before the assertions are checked.
        });  
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '5c1b4eda68cd5146dc54be24',
          assigned_to: 'One field to update'          
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          // fill me in too!
          assert.equal(res.text, 'successfully updated' ); 
          done(); // A mechanism to notify the testing framework that the callback has completed. Otherwise, the test will pass before the assertions are checked.
        });  
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '5c1b4eda68cd5146dc54be24',
          assigned_to: 'Multiple fields to update',
          status_text: 'testing multiple fields update'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          // fill me in too!
          assert.equal(res.text, 'successfully updated' ); 
          done(); // A mechanism to notify the testing framework that the callback has completed. Otherwise, the test will pass before the assertions are checked.
        });   
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({getQuery: ''})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          // assert.equal(console.log(res.body));
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query( {getQuery: '?issue_title=Title'} )
        .end( function(err,res){
          assert.equal(res.status,200);
          // assert.equal( console.log("CHAI: ", res.body[0] ));
          assert.equal(res.body[0].issue_title,'Title' );
          done();
        });
        
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({getQuery: '?' })
        .end()
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        
      });
      
      test('Valid _id', function(done) {
        
      });
      
    });

});
