const express = require('express');
require('dotenv').config()
const cors = require('cors');
const jwt = require('jsonwebtoken');
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
        const ordersCollection = client.db('resaleFurnitureStore').collection('orders');
        const wishlistsCollection = client.db('resaleFurnitureStore').collection('wishlists');


        function verifyJWT(req, res, next) {

            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).send('unauthorized access');
            }

            const token = authHeader.split(' ')[1];

            jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
                console.log(decoded);
                if (err) {
                    return res.status(403).send({ message: 'forbidden access' })
                }
                req.decoded = decoded;
                next();
            })

        }

        app.get('/categories', async (req, res) => {

            const query = {};
            const categories = await categoriesCollection.find(query).toArray();
            res.send(categories);
        });

        app.post('/products', async (req, res) => {


            const addProduct = req.body;
            const result = await productsCollection.insertOne(addProduct);
            res.send(result);
        });

        app.post('/addedorders', async (req, res) => {

            const addOrder = req.body;
            const result = await ordersCollection.insertOne(addOrder);
            res.send(result);
        });

        app.post('/wishlist', async (req, res) => {

            const addWishlist = req.body;
            const result = await wishlistsCollection.insertOne(addWishlist);
            res.send(result);
        })

        app.get('/myWishlist', async (req, res) => {


            const wlist = req.query.email;
            const query = { email: wlist };
            const wishlist = await wishlistsCollection.find(query).toArray();
            res.send(wishlist);
        })




        app.get('/myOrder', async (req, res) => {

            const order = req.query.email;
            const query = { email: order };
            const orders = await ordersCollection.find(query).toArray();
            res.send(orders);
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

            const product = req.query.email;
            const query = { email: product }
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
            const query = { email: user.email };
            const queryResult = await usersCollection.findOne(query);
            if (queryResult) {
                return res.status(403).send({ message: 'forbidden access' })
            }
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
        app.get('/advertisement', async (req, res) => {
            const query = { advertisement: 'ads' };
            const result = await productsCollection.find(query).toArray();
            res.send(result);
        });

        app.put('/advertisement/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    advertisement: 'ads'

                }
            }
            const result = await productsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
        })




        app.get('/users', async (req, res) => {
            const role = req.query.role;
            const query = { role: role };
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/verifiedUsers', async (req, res) => {
            const verified = req.query.verified
            const query = { verified: verified };
            console.log(query)
            const result = await usersCollection.find(query).toArray();

            res.send(result);
        })

        app.put('/user/verify/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    verified: 'true'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
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






        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1d' })
                return res.send({ accessToken: token });
            }
            res.status(403).send({ accessToken: '' })
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

