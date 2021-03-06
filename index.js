const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();


// middleware
app.use(cors());
app.use(express.json());

// connecting node js with mongodb
const uri = "mongodb+srv://zenon_garments:H1WmAnLUSy8AZSNd@cluster0.li11u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();

        // const sedanCollection = client.db("sedan_mela").collection("ourSedans");
        // const testimonialCollection = client.db("sedan_mela").collection("testimonials");
        const userCollection = client.db("zenon_textile").collection("users");
        const employeeCollection = client.db("zenon_textile").collection("employees");
        const applicantCollection = client.db("zenon_textile").collection("applicants");
        const reviewCollection = client.db("zenon_textile").collection("reviews");
        const pricingCollection = client.db("zenon_textile").collection("pricings");
        const orderCollection = client.db('zenon_textile').collection("orders");

        app.get("/users", async (req, res) => {
            const allUsers = await userCollection.find({}).toArray();
            res.json(allUsers);
        })

        // get a particular user
        app.get("/users/single", async (req, res) => {

            const particularUser = await userCollection.findOne({ email: req.query.email });
            res.json(particularUser);
        })
        app.get("/employees", async (req, res) => {

            const employee = await employeeCollection.find({}).toArray();
            res.json(employee);
        })
        app.get("/pricings", async (req, res) => {
            const pricings = await pricingCollection.find({}).toArray();
            res.json(pricings);
        })
        app.get("/pricings/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const pricing = await pricingCollection.findOne(filter);
            res.json(pricing);
        })
        // confirming does the logged in user is admin or not
        app.get("/users/admin", async (req, res) => {
            const email = req.query.email;
            const particularUser = await userCollection.findOne({ email: email });


            let isAdmin = false;
            if (particularUser?.role === "admin") {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })
        app.get("/reviews", async (req, res) => {
            const reviews = await reviewCollection.find({}).toArray();
            res.json(reviews);
        })
        app.get("/applicants", async (req, res) => {
            const applicant = await applicantCollection.find({}).toArray();
            res.json(applicant);

        })
        app.get("/applicants/:email", async (req, res) => {
            console.log(req.params.email);
            const particularUser = await applicantCollection.findOne({ email: req.params.email });
            res.json(particularUser);

        })
        app.get("/orders", async (req, res) => {
            const orders = await orderCollection.find({}).toArray();
            res.json(orders);
        })
        app.get("/orders/person", async (req, res) => {
            const email = req.query.email;
            console.log(req.query.email);

            const order = await orderCollection.findOne({ email: email });
            res.json(order);

        })
        // make a user admin
        app.put("/users", async (req, res) => {
            const email = req.query.email;
            const filter = { email: email };
            const options = { upsert: false };
            const updateDoc = { $set: { role: "admin" } };
            const newAdmin = await userCollection.updateOne(filter, updateDoc, options);
            res.json(newAdmin);

        })

        app.put("/applicants/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const updateDoc = { $set: { status: "Booked For Interview" } };
            const options = { upsert: false };
            const updatedStatus = await applicantCollection.updateOne(query, updateDoc, options);
            res.json(updatedStatus);
            res.json(result);
        })

        app.post("/users", async (req, res) => {
            console.log(req.body);
            const newUser = await userCollection.insertOne(req.body);
            res.json(newUser);
        })
        app.post("/applicants", async (req, res) => {

            const newUser = await applicantCollection.insertOne(req.body);
            res.json(newUser);
        })
        app.post("/orders", async (req, res) => {

            const order = await orderCollection.insertOne(req.body);
            res.json(order);
        })
        app.post("/employees", async (req, res) => {

            const newUser = await employeeCollection.insertOne(req.body);
            res.json(newUser);
        })
        app.post("/reviews", async (req, res) => {
            const review = await reviewCollection.insertOne(req.body);
            res.json(review);
        })

        app.put("/users", async (req, res) => {
            const filter = { email: req.body.email };
            const options = { upsert: true }
            const user = { $set: req.body };
            const result = await userCollection.updateOne(filter, user, options);
            res.json(result);
        })
        app.put("/orders/:id", async (req, res) => {
            const filter = { _id: ObjectId(req.params.id) };
            const upDoc = { $set: { "shipped": true } }
            const orders = await orderCollection.updateOne(filter, upDoc);
            res.json(orders);
        })
        // update a purchased product shipping status

    }
    finally {

    }
}
run().catch(console.dir);

app.get("/", (req, res) => {

    res.json("Backend is working");
})
app.listen(port, () => {
    console.log("Listening to port ", port);
})