const express = require('express');
const http = require('node:http');
var bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));



app.get("/",(req,res)=>{
    res.sendFile(__dirname+'/signup.html');
})

app.post("/",function(req,res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.emailAdd;

    const data = {
        members : [{
            email_address : email , 
            status : "subscribed",
            merge_fields: {
                FNAME : firstName,
                LNAME : lastName , 
            }
        }]
    };

    const jsonData = JSON.stringify(data);

    const url = 'http://us14.api.mailchimp.com/3.0/lists/';

    const options = {
        method : 'POST',
        auth   : 'Christian Musico:'

    };

    const request = http.request(url, options,function(response){

        if(response.statusCode===426){
            res.sendFile(__dirname+'/success.html');
        } else {
            res.sendFile(__dirname+'/failure.html');
        }

        console.log(response.statusCode);

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

    
    
    request.write(jsonData);
    request.end();


   

})


app.post("/failure",(req,res)=>{
    res.redirect("/");
})

app.listen(process.env.PORT||3000,()=>{
    console.log("The server is running on port 3000 .....")
})

