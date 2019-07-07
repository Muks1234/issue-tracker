/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var mongoose = require('mongoose');   
mongoose.Promise = global.Promise; 
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});
 

var issuesCollection = mongoose.Schema({
            issue_title: {type:String, required:true},
            issue_text:{type:String, required:true},
            created_on:{type:Date, default: Date.now},
            updated_on:{type:Date, default: Date.now},
            created_by:{type:String, required:true},   
            assigned_to:String,  
            open:{type:Boolean, default:true},
            status_text:String
          })     
   

module.exports = function (app) { 

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      var issues = mongoose.model(project, issuesCollection)
        
        var open = req.query.open;
        var assigned_to = req.query.assigned_to;
        var _id = req.query._id;
        var issue_title = req.query.issue_title;
        var issue_text = req.query.issue_text;
        var created_on = req.query.created_on;
        var updated_on =req.query.updated_on;
        var created_by = req.query.created_by;
    
      var myQueryObj = {
        open: open , 
        assigned_to: assigned_to ||'',
        //_id: _id ||'',
        //issue_title:issue_title ||'',
        //issue_text:issue_text ||'',
        //created_on:created_on ||'',
        //updated_on:updated_on ||'',
        //created_by:created_by ||''        
      }            
      console.log(req.query) 
  
      issues.find(req.query,function(err, data){
        if(err){  
          console.log(err) 
        }
        else{
          //console.log(data)
          //console.log(req.query)
          res.send(data)
        }
      })
    })   
      
    .post(function (req, res){   
      var project = req.params.project;
      var issues = mongoose.model(project, issuesCollection)

      var issue = new issues(req.body)
                                                 
       issue.save(function(err, data){ 
         if(err){
           console.log(err)   
         }
         else{
           //console.log("king") 
           res.redirect('/api/issues/:project')
         }  
       })            
    })
   
    
    .put(function (req, res){ 
      var project = req.params.project;
      var issues = mongoose.model(project, issuesCollection)
      
      console.log(req.body)
      issues.findOne({_id : req.body._id}, function(err, data){
        if(err){  
          console.log(err) 
        } 
        else{    
          
          if(req.body.open){
            data.open=req.body.open
          }
          if(req.body.issue_title){
            data.issue_title = req.body.issue_title
          }
          if(req.body.issue_text){
             data.issue_text = req.body.issue_text
          }
          if(req.body.status_text){
             data.status_text = req.body.status_text
          }
          if(req.body.assigned_to){
             data.assigned_to = req.body.assigned_to
          }
          if(req.body.created_by){
             data.created_by = req.body.created_by
          }
            
          data.updated_on = Date()
          //console.log(data)   
          data.save(function(err,data){
            if(err){ 
              console.log(err)
              res.send("could not update "+ req.body._id)
            }            
            else{   
              res.send("successfully updated")
            }
          })
        }    
      })    
    })
        
    .delete(function (req, res){    
      var project = req.params.project;   
      var issues = mongoose.model(project, issuesCollection)   
      console.log(req.body)  
      
      if(!req.body._id){
        res.send("_id error")
      }
      else{
        issues.findByIdAndRemove(req.body, function(err, data){
        if(err){
          res.send("could not delete " + req.body._id)
        }
        else{  
          res.send("deleted " + req.body._id)
        }
      })
      }   
    });      
}; 
