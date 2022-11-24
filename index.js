const express = require('express');
require('dotenv').config()
const cors = require('cors');


const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json())




app.get('/', async (req, res) => {
    res.send('resale furniture store server is running!');

});

app.listen(port, async () => {
    console.log(`Server listening on port ${port}`);

})
