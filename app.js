const bodyParser = require("body-parser");
const express = require("express");
const request=require("request");
const https=require("https");
const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.listen(3000,function(){
    console.log("The server is listening to port 3000");
})

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
})

app.post("/",function(req,res){
    
    let firstName=req.body.firstname;
    let lastName=req.body.lastname;
    let email=req.body.email;


    const url="https://us1.api.mailchimp.com/3.0/lists/cd3a42dfdb";

    const options={
        method:"POST", 
        auth : "SaurabhFrenzy17:03c888310a3baeca2f640cba90a15d4d-us1"
    }

    const data = {
        members :[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    }

    const requestBody=JSON.stringify(data);

    const request=https.request(url,options,function(response){

        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(requestBody);
    request.end();

});

// 03c888310a3baeca2f640cba90a15d4d-us1
//cd3a42dfdb