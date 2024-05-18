const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError=require("./utils/ExpressError")
const wrapAsync=require("./utils/wrapAsync")

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Root is here!");
});

app.get("/weather", (req, res) => {
  res.render("index.ejs");
});


app.get("/weather/city",wrapAsync( async (req, res) => {
  try {
    let { city } = req.query;
    let API_URL = "https://api.openweathermap.org/data/2.5/weather";
    let API_KEY = "ae8adcd0d439ff8c43540c5836669c05";
    let response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}`);
    if (response.ok) {
      let data = await response.json();
      console.log(data); 
      res.render("cityWeather.ejs", { weatherData: data });
    } else {
      console.error("Error fetching weather data:", response.statusText);
    let message="Error fetching weather data"
    res.render("error.ejs",{message});
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.render("error.ejs",{message:error});
  }
}))

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"))
  })

app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"}=err
    res.status(status).render("error.ejs",{message})
  })


app.listen(3000, () => {
  console.log("Server is started at port 3000");
});
