const express = require('express');
const router = express.Router({mergeParams: true});

const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas")
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn } = require("../middleware");

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// list camps
router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds })
}))

// add new
router.get("/new", isLoggedIn, (req, res, next) => {
    res.render("campgrounds/new")
})

// post new camp
router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError("Invalid campground data.", 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully created a new camp.");
    res.redirect(`/campgrounds/${campground._id}`)
}))

// show details
router.get("/:id", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews").populate("author");
    //console.log(campground)
    if (!campground) {
        req.flash("error", "Cannot find that campground.")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/show", { campground })

}))

// edit camps page
router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Cannot find that campground.")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/edit", { campground })
}))

// edit data route
router.put("/:id", isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash("success", "Successfully updated camp.");
    res.redirect(`/campgrounds/${campground._id}`)
}))

// delete camp
router.delete("/:id", isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id)
    req.flash("success", "Successfully deleted camp.")
    res.redirect("/campgrounds")
}))

module.exports = router;