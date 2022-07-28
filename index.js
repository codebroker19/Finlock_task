const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const whoisinfo = require("whois-json");
const date = require("date-and-time");
const isvalid = require("is-valid-domain");
const moment = require("moment");
var arraydata = [];


app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.render("domainchecker", { success: "" });
});
app.post("/domainchecker", async (req, res) => {
  const domain = req.body.domain;
  try {
    if (isvalid(domain)) {
      var data = await whoisinfo(domain);
      // var date=moment(data.creationDate).format("YYYY-MM-DD");
      // var currentdate=moment(new Date()).format("YYYY-MM-DD");
      const url = "https://www." + data.domainName;
      const created_date = moment(data.creationDate).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const domain_name = data.domainName;
      const updated_date = moment(data.updated_date).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      const expiration_date = moment(
        data.registrarRegistrationExpirationDate
      ).format("YYYY-MM-DD HH:mm:ss");
      const registrar = data.registrar;
      const reg_country = data.techCountry;
     
      res.send({
        url,
        created_date,
        domain_name,
        updated_date,
        expiration_date,
        registrar,
        reg_country,
      });

      var feed = {
        url,
        created_date,
        domain_name,
        updated_date,
        expiration_date,
        registrar,
        reg_country,
      };
      if (domain_name !== "undefined") {
        arraydata.push(feed);
        console.log(feed);
      }
    }
  } catch (err) {
    if (err.errno == -3008) {
      res.send("No such website exists enter the correct domain name without http/https");
    } else {
      res.send(err);
    }
  }
});
app.listen(process.env.PORT || 3000, function () {
  console.log("SERVER STARTED PORT: 3000");
});