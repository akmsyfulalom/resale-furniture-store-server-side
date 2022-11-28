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
        const usersCollection = client.db('resaleFurnitureStore').collection('users');

        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoriesCollection.find(query).toArray();
            res.send(categories);
        });

        app.post('/products', async (req, res) => {
            const addProduct = req.body;
            const result = await productsCollection.insertOne(addProduct);
            res.send(result);
        })

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

        app.get('/product', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        });
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(filter);
            res.send(result);
        })


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
        });
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });
        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });
        app.get('/users', async (req, res) => {
            const role = req.query.role;
            const query = { role: role };
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        });
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user.role === 'admin' });
        });

        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user.role === 'seller' });
        });

        app.get('/users/buyers/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isBuyer: user.role === 'buyer' });
        });



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

});

