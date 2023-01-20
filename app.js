const express = require("express");
const bodyParser = require("body-parser");
const https =require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended :true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname,
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us12.api.mailchimp.com/3.0/lists/6456a37899";

    const options = {
        method: "POST",
        auth: "apikey-us12:d60675983c3b81882480e7ddaa632923-us12",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": jsonData.length
        }
    }

    const request = https.request(url, options, function(response) {
        response.on("data", function(data) {
            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});


app.post("/failure", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.listen(3000, function() {
    console.log("Server is runnning on port 3000");
});


// apikey
// d60675983c3b81882480e7ddaa632923-us12

//6456a37899