const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const details = require("./details.json");

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.listen(process.env.PORT||3000, () => {
  console.log("The server started on port 3000 !!!!!!");
});

app.get("/", (req, res) => {
  res.send(
    "<h1 style='text-align: center'>Wellcome to mail sender <br></h1>"
  );
});

app.post("/sendmail", (req, res) => {
  try{
  console.log("request came");
  let user = req.body;
  sendMail(user, info => {
    console.log(`The mail has beed sent and the id is ${info.messageId}`);
    res.send(info);
  })
} catch (err) {
    next(err);
}
})

//Problem with google login error from the server read this link https://stackoverflow.com/questions/51980436/nodemailer-throws-error-invalid-login-534-5-7-14
async function sendMail(user, callback) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: details.email,
      pass: details.password
    },
    tls: {
      rejectUnauthorized: false
  }
  });

  let mailOptions = {
    from: 'Gemente Achtkarspelen', // sender address
    to: user.email, // list of receivers
    subject: "Welkom Achtkarspelen mail sender", // Subject line
    html: `<h1>Hi ${user.name}</h1><br>
    <h4>Thanks for melding find below your meld information</h4><br>
    <h4>MeldID : ${user.id}</h4>
    <h4>Email : ${user.email}</h4>
    <h4>Telephone : ${user.telephone}</h4>
    <h4>Category : ${user.categorie}</h4>
    <h4>Toelichting : ${user.toelichting}</h4>
    <h4>We will follow up on this information and will alert you. </h4>`
    
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  callback(info);
}


