var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require("mongojs");
var db = mongojs('leon',['note']);
var ObjectId = mongojs.ObjectId;
var app = express();
var note = [{'when':'','where':'','what':''}];

app.set('views', path.join('views'));
app.set('view engine', 'ejs');
//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//global vars
app.use(function(req, res, next){
    res.locals.errors = null;
    next();
});
//Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
// Set Static Path
app.use(express.static('public'));

app.get('/', function(req, res){
    db.note.find(function(err, docs){
        //console.log(docs);
        res.render('index',{
            title:'Notes:',
            notes:docs
        });
    })
});

app.post('/note/add',function(req,res){
    req.checkBody('date','When do you do this?').notEmpty();
    req.checkBody('where','Where do you do this?').notEmpty();
    req.checkBody('what','What do you do?').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        res.render('index',{
            title:'Notes',
            notes:note,
            errors:errors
          });
    }else{
      var newNote = {
          date:req.body.date,
          where:req.body.where,
          what:req.body.what
      }
      db.note.insert(newNote,function(err,result){
          if(err){
            console.log(err);
          }
          res.redirect('/');
      })
      console.log('Success');
    }
});

app.delete('/note/delete/:id', function(req, res){

      db.note.remove({_id:ObjectId(req.params.id)},function(err,result){
          if(err){
              console.log(err);
          }
          res.redirect('/');
          console.log('done');
      });
});

app.listen(3000, function(){
    console.log('Server Started on Port 3000');
});
