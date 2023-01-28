const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const userHandler = require('./routes/user_handler');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());


const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

const connection = () => {
  mongoose.set("strictQuery", false);
  mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.rbe1w.mongodb.net/${DB_NAME}`)
    .then(() => console.log('connection successful'))
    .catch((err) => console.log(err));
}
connection();



app.use('/api/v1/users', userHandler);



app.get('/', (req, res) => {
  res.send({
    data: 'The connection established!'
  });
});

app.listen(process.env.PORT || 5000, (e) => {
  console.log(`server running`);
});



