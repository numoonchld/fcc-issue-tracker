/*
*
*
*       Complete the API routing below
*
*
*/

/* 
References:
  https://docs.mongodb.com/manual/crud/
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
    
const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {   
  
    app.route('/api/issues/:project')
      // app.route('/api/issues/issueTracker')

      // 6. I can GET /api/issues/{projectname} for an array of all issues on that specific project with all the information for each issue as was returned when posted.
      // 7. I can filter my get request by also passing along any field and value in the query(ie. /api/issues/{project}?open=false). I can pass along as many fields/values as I want.
      .get(function (req, res){
        var project = req.params.project;
        console.log('GET',project); 

        // limit to one project 'issueTracker' and one for the test suite for this glitch example:          
        if (project === 'issueTracker' || project === 'test') {
        
          console.log('---- GET: ', project);
          // console.log('--- GET:' ,req.query);
          
          // https://expressjs.com/en/api.html#req.query
          // As req.query’s shape is based on user-controlled input, all properties and values in this object are untrusted and should be validated before trusting. 
          // For example, req.query.foo.toString() may fail in multiple ways, for example foo may not be there or may not be a string, and toString may not be a 
          // function and instead a string or other user-input.  


          MongoClient.connect(CONNECTION_STRING, function(err, db) {

              if (err) { console.error(err) }
              else {

                console.log('connected to db') 
                console.log('query string is: ', req.query,' ==> ', req.query.getQuery);

                // https://docs.mongodb.com/manual/tutorial/iterate-a-cursor/#read-operations-cursors
                // https://stackoverflow.com/a/49810038/3161273
                // https://expressjs.com/en/api.html#req.query 

                if (req.query.getQuery === '' || req.query.getQuery === undefined ) {

                  console.log('no query specified');

                  db.collection(project).find({}).toArray( function(err,retDB){
                    res.send(retDB);
                  })

                } else if (req.query.getQuery !== '' ) {

                  // allowed queries:                      
                  const allowedQueries = ['issue_title','issue_text','created_on','updated_on','created_by','assigned_to','open','status_text']

                  // try to parse request url:
                  if (req.query.getQuery[0] === '?') {
                    var queryArray = req.query.getQuery.substring(1).split('&');
                  } else {
                    var queryArray = req.query.getQuery.split('&');
                  }

                  console.log('log pt.A:',queryArray)
                  
                  var queryObj = {}

                  // iterate over scrollable object:issue_text
                  for (var i = 0; i < queryArray.length; i++) {

                    var pairArr = queryArray[i].split('=');

                    // check if queries belong to list of allowed queries:                       
                    if ( allowedQueries.indexOf(pairArr[0]) != -1 ) {

                      // Since open is a boolean, query object is created a little differently for that
                      // Needs more data validation for queries: 
                      if (pairArr[0] !== 'open' ) {
                        
                        if ( pairArr[0] === 'issue_title' || pairArr[0] === 'issue_text' || pairArr[0] === 'created_by' || pairArr[0] === 'assigned_to' || pairArr[0] === 'status_text' || pairArr[0] === 'created_on' || pairArr[0] === 'updated_on') {
                          queryObj[pairArr[0]] = pairArr[1];
                        } 
                        // else if ( pairArr[0] === 'created_on' || pairArr[0] === 'updated_on' ) {
                        //   queryObj[pairArr[0]] = new Date(pairArr[1]); 
                        // }

                      } else if (pairArr[0] === 'open') { 

                        if (pairArr[1] === 'true') {
                          queryObj['open'] = true;
                        } else if ( pairArr[1] === 'false' ) {
                          queryObj['open'] = false;
                        }

                      }
                    }

                  }

                  console.log('log pt.B:',queryObj);

                  db.collection(project).find(queryObj).toArray( function(err,retDB){
                    res.send(retDB);
                  })

                }

              }

          })

        }
        else { console.log('issues for this project not tracked'); }

      })

      // 2. POST /api/issues/{projectname} with form data containing required issue_title, issue_text, created_by, and optional assigned_to and status_text.
      // 3. The object saved (and returned) will include all of those fields (blank for optional no input) and also include created_on(date/time), updated_on(date/time), open(boolean, true for open, false for closed), and _id.         
      .post(function (req, res){
      
        // console.log(req);
       
        var project = req.params.project;
        console.log('Project of interest: ',project);  
      
        // limit to one project 'issueTracker' and 'test' project for this glitch example:          
        if (project === 'issueTracker' || project === 'test') {

          console.log('--- POST:' ,req.body);
          
          if (req.body.issue_title && req.body.issue_text && req.body.created_by) {
            MongoClient.connect(CONNECTION_STRING, function(err, db) {

              if (err) { console.error(err) }
              else { 
                
                console.log('connected to db')
                
                var po_rnDate = new Date(Date.now());
                // console.log(rnDate.getFullYear()+'-'+rnDate.getMonth()+'-'+rnDate.getDate());
                
                db.collection(project).insertOne(
                  
                  {
                    issue_title: req.body.issue_title,
                    issue_text: req.body.issue_text,
                    created_by: req.body.created_by,
                    assigned_to: req.body.assigned_to,
                    status_text: req.body.status_text,
                    // created_on: new Date(  Date.now() ),
                    // updated_on: new Date(  Date.now() ),
                    created_on: po_rnDate.getFullYear()+'-'+po_rnDate.getMonth()+'-'+po_rnDate.getDate(),
                    updated_on: po_rnDate.getFullYear()+'-'+po_rnDate.getMonth()+'-'+po_rnDate.getDate(),
                    open: true
                  }, function(err,callbackObj) {
                    
                    if (err) {
                      console.error(err);
                    }
                    else if (callbackObj.result.n == 1) {
                      console.log(callbackObj.ops[0]);
                      res.json(callbackObj.ops[0]);
                    } else {
                      res.send('update unsuccessful');
                    }

                  }
                );

              }

          })
          } 
          else {
            res.json({message: 'Required fields are missing'});
          }

        } 
        else {
          console.log('issues for this project not tracked');  
        }

      }) 

      // 4. I can PUT /api/issues/{projectname} with a _id and any fields in the object with a value to object said object. 
      //   Returned will be 'successfully updated' or 'could not update '+_id. This should always update updated_on. If no fields are sent return 'no updated field sent'.
      .put(function (req, res){

        var project = req.params.project;
        console.log('PUT',project);

        if (project === 'issueTracker' || project === 'test') {

          console.log('--- PUT:' ,req.body);
          MongoClient.connect(CONNECTION_STRING, function(err, db) {

              if (err) { console.error(err) }
              else {

                console.log('connected to db', req.body._id)
                var pu_rnDate = new Date(Date.now());

                // return message if no update field is provided:
                if (!req.body.issue_title && !req.body.issue_text && !req.body.created_by && !req.body.assigned_to && !req.body.status_text && !req.body.open ) {
                  res.json({message: 'no updated field sent'});
                } else {   

                  // update each field if user has entered it: issue_title
                  if (req.body.issue_title) {
                    
                    var pu_rnDate = new Date(Date.now());

                    db.collection(project).update(
                      { "_id": ObjectId(req.body._id) } ,
                      { 
                        $set: { 
                          issue_title: req.body.issue_title,
                          updated_on: pu_rnDate.getFullYear() + '-' + pu_rnDate.getMonth() + '-' + pu_rnDate.getDate(),
                          open: true
                        }
                      }, function(err,callbackObj){
                        if (err) {
                          res.json( {message: 'could not update: ' + req.body._id + '; error updating issue_title'});
                        } else {
                          console.log(callbackObj.result.n);
                        }
                      }
                    )

                  }

                  // update each field if user has entered it: issue_text
                  if (req.body.issue_text) {

                    db.collection(project).update(
                      { "_id": ObjectId(req.body._id) } ,
                      { 
                        $set: { 
                          issue_text: req.body.issue_text,
                          updated_on: pu_rnDate.getFullYear() + '-' + pu_rnDate.getMonth() + '-' + pu_rnDate.getDate(),
                          open: true
                        }
                      }, function(err,callbackObj){
                        if (err) {
                          res.json( {message: 'could not update: ' + req.body._id + '; error updating issue_text'});
                        }
                      }
                    )

                  }

                  // update each field if user has entered it: created_by
                  if (req.body.created_by) {

                    db.collection(project).update(
                      { "_id": ObjectId(req.body._id) } ,
                      { 
                        $set: { 
                          created_by: req.body.created_by,
                          updated_on: pu_rnDate.getFullYear() + '-' + pu_rnDate.getMonth() + '-' + pu_rnDate.getDate(),
                          open: true
                        }
                      }, function(err,callbackObj){
                        if (err) {
                          res.json( {message: 'could not update: ' + req.body._id + '; error updating created_by' } );
                        }
                      }
                    )

                  }

                  // update each field if user has entered it: assigned_to
                  if (req.body.assigned_to) {

                    db.collection(project).update(
                      { "_id": ObjectId(req.body._id) } ,
                      { 
                        $set: { 
                          assigned_to: req.body.assigned_to,
                          updated_on: pu_rnDate.getFullYear() + '-' + pu_rnDate.getMonth() + '-' + pu_rnDate.getDate(),
                          open: true
                        }
                      }, function(err,callbackObj){
                        if (err) {
                          res.json({message: 'could not update: ' + req.body._id + ';  error updating assigned_to'});
                        }
                      }
                    )

                  }

                  // update each field if user has entered it: status_text
                  if (req.body.status_text) {

                    db.collection(project).update(
                      { "_id": ObjectId(req.body._id) } ,
                      { 
                        $set: { 
                          status_text: req.body.status_text,
                          updated_on: pu_rnDate.getFullYear() + '-' + pu_rnDate.getMonth() + '-' + pu_rnDate.getDate(),
                          open: true
                        }
                      },function(err,callbackObj){
                        if (err) {
                          res.json({message: 'could not update: ' + req.body._id + ';  error updating status_text'});
                        }
                      }
                    )

                  }

                  // update each field if user has entered it: open: 'false'
                  if (req.body.open == 'false') {

                    db.collection(project).update(
                      { "_id": ObjectId(req.body._id) } ,
                      { 
                        $set: { 
                          open: false,
                          updated_on: pu_rnDate.getFullYear() + '-' + pu_rnDate.getMonth() + '-' + pu_rnDate.getDate()
                        }
                      },function(err,callbackObj){
                        if (err) {
                          res.json({message: 'could not update: ' + req.body._id + ';  error updating status_text'});
                        }
                      }
                    )

                  }

                  res.send('successfully updated')

                }

              }
          })

        }
        else  { console.log('issues for this project not tracked') }
    
    })

      // 5. I can DELETE /api/issues/{projectname} with a _id to completely delete an issue. If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could not delete '+_id.   
      .delete(function (req, res){
        var project = req.params.project;
        console.log('DELETE',project);

        if (project != 'issueTracker' || project !== 'test') {

          console.log('--- DELETE:' ,req.body); 
          
          if (!req.body._id) { res.json({message:'_id error'} ) }
          else { 

            MongoClient.connect(CONNECTION_STRING, function(err, db){

            if (err) { console.error(err) }
            else {

              db.collection(project).remove(

                { "_id": ObjectId(req.body._id) },
                function(err,retDoc) {

                  if (err) {
                    console.error(err);
                  } else if (retDoc.result.n == 1) {
                    res.json({ message: 'deleted '+ req.body._id});
                  } else {
                    res.json({message: 'could not delete ' + req.body._id} );
                  }

                }

              )
            }

            })



          }

        } 
        else { console.log('issues for this project not tracked') }

      })

};
     