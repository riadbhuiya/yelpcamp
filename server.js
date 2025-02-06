const express = require("express");
const app = express();
const port= 8080;
const path = require("path");
const ejsMate = require("ejs-mate")
const mongoose = require("mongoose");
const methodOverride = require("method-override")
const Campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/yelpcamp")

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!")
})


app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))

app.get("/", (req, res) => {
    res.render("home")
})

// list camps
app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds })
})

// add new
app.get("/campgrounds/new", async (req,res) => {
    res.render("campgrounds/new")
})

// post new camp
app.post("/campgrounds", async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

// show details
app.get("/campgrounds/:id", async (req, res) => {
    try {
        const campground = await Campground.findById(req.params.id);
        res.render("campgrounds/show", { campground })
        //console.log(campground)
    } catch (e) {
        console.log(e)
    }
})

// edit camps page
app.get("/campgrounds/:id/edit", async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground })
})

// edit data route
app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
})

// delete camp
app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
})



app.listen(port, () => {
    console.log(`listening to http://localhost:${port}`)
})