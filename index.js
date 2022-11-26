const express = require('express');
require('dotenv').config()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qoygz5c.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoriesCollection = client.db('resaleFurnitureStore').collection('categories');
        const productsCollection = client.db('resaleFurnitureStore').collection('products');
        const blogsCollection = client.db('resaleFurnitureStore').collection('blogs');

        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoriesCollection.find(query).toArray();
            res.send(categories);
        });
        app.get('/products', async (req, res) => {
            const query = {};
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        });
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { category: id }
            const products = await productsCollection.find(query).toArray();
            res.send(products);

        });
        app.get('/blogs', async (req, res) => {
            const query = {};
            const blogs = await blogsCollection.find(query).toArray();
            res.send(blogs);
        });
        app.get('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const blogs = await blogsCollection.findOne(query);
            res.send(blogs);
        })



    }
    finally {

    }
}
run()
    .catch(err => console.log(err))




app.get('/', async (req, res) => {
    res.send('resale furniture store server is running!');

});

app.listen(port, async () => {
    console.log(`Server listening on port ${port}`);

})
