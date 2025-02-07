
const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers") 
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelpcamp")

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected!")
})

const sample = array => array[Math.floor(Math.random() * array.length)]; 

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const r = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[r].city}, ${cities[r].state}`,
            price,
            image: `https://picsum.photos/600/400.jpg`,
            description: `  Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas dolor consequatur esse eos officia quo tempora enim dignissimos quibusdam laudantium fugit iusto similique, soluta at ea nemo mollitia libero non.
                            Odit, assumenda deleniti ea unde, atque impedit debitis consequatur rerum nobis nisi itaque! Est deserunt officiis id nisi hic nesciunt. Nisi sapiente, obcaecati voluptatibus suscipit molestiae voluptatem quasi tenetur ad?
                            Laboriosam ratione nihil sed ut nobis sapiente, quo tempora rerum rem iure voluptatum consequuntur atque blanditiis vel numquam aut ullam, incidunt est autem pariatur vitae. Et deserunt debitis vero nemo.`,
        })
        //console.log(camp)
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
});