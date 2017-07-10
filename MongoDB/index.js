//This was the first mongodb tutorial in which I developed app using methods in  native MongoDB

var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var mongo=require('mongodb').MongoClient;
var objectId=require('mongodb').ObjectID;
var assert=require('assert');

var url="mongodb://localhost:27017/test";

app.set('view engine','ejs');

app.get('/homepage', function(req, res){
  res.render('homepage');
});

app.get('/profile',function(req,res){
  mongo.connect(url,function(err,db){
    var resultArray=[];
    assert.equal(null,err);
    var cursor=db.collection('avatars-data').find();
    cursor.forEach(function(doc,err){
      assert.equal(null,err);
      resultArray.push(doc);
    },function(){
      db.close();
      console.log('Cnnection closed here');
      res.render('homepage',{ar:resultArray});
    });
  });

});

app.get('/signup',function(req,res){
  res.render('signup');
})

app.post('/signup',urlencodedParser,function(req,res){
  console.log(req.body.nick_name);
  var avatar={name:req.body.nick_name};
  mongo.connect(url,function(err,db){
    assert.equal(null,err);
    db.collection('avatars-data').insertOne(avatar,function(err,result){
      assert.equal(null,err);
      db.close();
      console.log("Connection Closed");
    });
  });
  res.redirect('profile');
});

app.get('/update',function(req,res){
  res.render('update');
});

app.post('/update',urlencodedParser,function(req,res){
  var id=req.body.uid;
  var avatar={name:req.body.navatar};
  mongo.connect(url,function(err,db){
    db.collection('avatars-data').updateOne({"_id":objectId(id)},{$set:avatar},function(err,result){
      assert.equal(null,err);
      db.close();
    });
  });
  res.end();
});

app.get('/delete',function(req,res){
  res.render('delete');
});

app.post('/delete',urlencodedParser,function(req,res){
  var id=req.body.did;
  mongo.connect(url,function(err,db){
    db.collection('avatars-data').deleteOne({"_id":objectId(id)},function(err,result){
      assert.equal(null,err);
      db.close();
    });
  });
  res.end();
});
app.listen(3000);
