const bodyParser = require("body-parser");
const express = require("express");
const request=require("request");
const https=require("https");

const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.listen(process.env.PORT||3000,function(){
    console.log("The server is listening to port 3000");
});

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
})

app.post("/",function(req,res){
    
    let firstName=req.body.firstname;
    let lastName=req.body.lastname;
    let email=req.body.email;


    const url="https://us1.api.mailchimp.com/3.0/lists/"+process.env.MAILCHIMP_LIST_KEY;

    const options={
        method:"POST", 
        auth : "SaurabhFrenzy17:"+ process.env.MAILCHIMP_API_KEY
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
