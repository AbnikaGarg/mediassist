var express = require("express");
var app = express();

var mysql = require("mysql");
app.listen(3008, function () {
    console.log("Server Started");
})

app.use(express.static("public"));//to server .css and .js files to client


var path = require("path");
app.get("/frontpage", function (req, resp) {
    var fullpath = path.join(process.cwd(), "public", "frontpage.html");
    resp.sendFile(fullpath);
})
app.get("/hlomed", function (req, resp) {
    var fullpath = path.join(process.cwd(), "public", "medmanager.html");
    resp.sendFile(fullpath);
})
app.get("/medpage", function (req, resp) {
    var fullpath = path.join(process.cwd(), "public", "med-avail.html");
    resp.sendFile(fullpath);
})
//.
app.get("/nedpro", function (req, resp) {
    var fullpath = path.join(process.cwd(), "public", "needy-details.html");
    resp.sendFile(fullpath);
})
app.get("/nedfind", function (req, resp) {
    var fullpath = path.join(process.cwd(), "public", "med-finder.html");
    resp.sendFile(fullpath);
})
//'...............sql
var dbConfigObj = {
    host: "localhost",//fixed
    user: "root",  //fixed
    password: "", //""
    database: "abnika",  //jo bhi aapka hai
   
}
var dbcon = mysql.createConnection(dbConfigObj);
dbcon.connect(function (err) {
    if (err)
        console.log(err.message);
    else
        console.log("Connected Successfully");
});
//,,,,,,,,,,,,,,,,
app.get("/ajax-check-uid", function (req, resp) {

    var data = [req.query.kuch, req.query.kuchj, req.query.kuchk, req.query.kuchl, req.query.dateofsignup];
    dbcon.query("insert into user values (?,?,?,?,current_date())", data, function (err, res) {
        if (err)
            resp.write(err.message);
        else
            resp.write("Saved");
        resp.end();
    })

})

//...........
app.get("/ajax-checkuu-uid", function (req, resp) {

    dbcon.query("select * from user where email=? and pwd=?", [req.query.kuch, req.query.kuchj], function (err, res1) {

        resp.send(res1);

    })

})
//...................
var fileuploading = require("express-fileupload");

app.use(fileuploading());//inform nodejs about express-fileupload module
app.use(express.urlencoded({ extended: true })); //used to convert post data to object in body

//.....................
app.post("/submit", function (req, resp) {
    resp.setHeader("Content-Type", "text/html");
   // console.log(req.body);
   
     req.body.picname = req.files.ppic.name;//for upload name in req bodu.
     console.table(req.body);
     console.log("File uploaded by user:" + JSON.stringify(req.files.ppic.name));
     
    
     if(req.files==null)
    req.body.picname="nopic.png";
    else
    {
        req.body.picname=req.files.ppic.name;
        var uploadingPath= path.join(process.cwd(),"public","pics",req.files.ppic.name);
        req.files.ppic.mv(uploadingPath,function(err){
        if(err)
           console.log(err);
           else
           console.log("Uploaded");

    });
    }

 
    var data = [req.body.email, req.body.uname, req.body.address, req.body.city,req.body.mobile,req.body.adhaar,req.body.picname];
    dbcon.query("insert into profiles values (?,?,?,?,?,?,?)", data, function (err) {
        if (err)
            resp.write(err.message);
        else
            resp.write("Saved");
        resp.end();
    });
   
})
//.............
//,,,,,,,,,,,,,,,,
app.get("/ajax-checkemail",function(req,resp){
    console.log(req.query.kuchUid);
    dbcon.query("select * from profiles where email=? ",[req.query.kuchUid],function(err,res){

     resp.send(res);  //how many records will be sent: 1 or 0 send to client
    
    })
    
})
//...........
app.post("/med-submit", function (req, resp) {
    resp.setHeader("Content-Type", "text/html");
   
     req.body.picname = req.files.ppic.name;//for upload name in req bodu.
     console.table(req.body);
     console.log("File uploaded by user:" + JSON.stringify(req.files.ppic.name));
     
    
     if(req.files==null)
    req.body.picname="nopic.png";
    else
    {
        req.body.picname=req.files.ppic.name;
        var uploadingPath= path.join(process.cwd(),"public","pics",req.files.ppic.name);
        req.files.ppic.mv(uploadingPath,function(err){
        if(err)
           console.log(err);
           else
           console.log("Uploaded");

    });
    }
 var format=req.body.date;
    req.body.dateofsignup=format;
 

     var data = [req.body.email, req.body.medname, req.body.company,req.body.city, req.body.dateofsignup,req.body.sel1,req.body.qty,req.body.picname];
    dbcon.query("insert into medecines values (null,?,?,?,?,?,?,?,?,current_date(),'available')", data, function (err) {
        if (err)
            resp.write(err.message);
        else
            resp.write("Saved");
        resp.end();
    });

})//.........
//-------------------
app.get("/fetchProfiles",function(req,resp){
    dbcon.query("select * from medecines",function(err,res)
    {
      //  debugger;
        resp.send(res);
    })
})
//----------------
app.get("/doDeleteProfile",function(req,resp){
    console.log(req.query.email);

    dbcon.query("delete from medecines where email=?",[req.query.email],function(err,res)
    {
        if(err)
        resp.send(err);
        else
        {
          resp.send("Record Deleted Successfully");
          //resp.send(res.affectedrows);  
        }
    })
})
//,,,,,,,,,,,,,,,,
app.get("/ajax-check-usr", function (req, resp) {

    var data = [req.query.usr, req.query.name, req.query.address, req.query.city, req.query.adh, req.query.dateofsignup];
    dbcon.query("insert into needy values (?,?,?,?,?,current_date())", data, function (err, res) {
        if (err)
            resp.write(err.message);
        else
            resp.write("Saved");
        resp.end();
    })

})
//.......
app.get("/fetchBranches",function(req,resp){
    dbcon.query("select distinct city from medecines",function(err,res)
    {
        resp.send(res);
    })
})
//...........
//.......
app.get("/fetchcitytomedi",function(req,resp){
    dbcon.query("select * from medecines where city=? ",[req.query.selc],function(err,res)
    {
        resp.send(res);
    })
})
app.get("/fetchcitytomediaa",function(req,resp){
    dbcon.query("select * from medecines where city=? and medname=? ",[req.query.selc,req.query.selctmed],function(err,res)
    {
        resp.send(res);
    })
})
//,,,,,,,,,,,,,,,,
app.get("/ajax-check-usremail",function(req,resp){
    console.log(req.query.kuchUid);
    dbcon.query("select * from needy where email=? ",[req.query.kuchUid],function(err,res){

     resp.send(res);  //how many records will be sent: 1 or 0 send to client
    })
})
//............
app.get("/ajax-check-update",function(req,resp){
   // console.log(req.query.kuchUid);
   var data = [req.query.name, req.query.address, req.query.city, req.query.adh , req.query.usr];
   console.log(data);
    dbcon.query("update needy set name=?,address=?,city=?,adh=?,dos=current_date() where email=? ",data,function(err,res){  
        if (err) 
            
        console.log(err);
            else
        resp.send(res); 
    })
})//...........
app.get("/fetchprodetails",function(req,resp){
    dbcon.query("select * from profiles where email=? ",[req.query.pro],function(err,res)
    {
        resp.send(res);
    })
})