//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", function (request, response) {
  const firstName = request.body.fName;
  const lastName = request.body.lName;
  const email = request.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/9b998bd262";

  const options = {
    method: "POST",
    auth: "austin1:02c8502d328ad7353d9c8ae4d0240849-us10-us10",
  };

  const mailchimpRequest = https.request(
    url,
    options,
    function (mailchimpResponse) {
      if (mailchimpResponse.statusCode === 200) {
        response.sendFile(__dirname + "/success.html");
      } else {
        response.sendFile(__dirname + "/failure.html");
      }

      mailchimpResponse.on("data", function (data) {
        console.log(JSON.parse(data));
      });
    }
  );
  mailchimpRequest.write(jsonData);
  mailchimpRequest.end();
});

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/signup.html");
});

app.post("/failure", function (request, response) {
  response.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on port 3000");
});

// api key 440aad56fd63f1547f4b12179aa3d708-us10

// api key new 7cb716154df1dfcf40ab44406bf9e279-us10

// audience id 9b998bd262
