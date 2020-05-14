const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const app = express();
app.use(express.json());
const {DB_URL} = require("./credentials");

const connectionString = DB_URL

MongoClient.connect(connectionString, {useUnifiedTopology: true})
.then(client => {

    console.log('Connected to Database');
    const db = client.db('todo-items');
    const itemsCollection = db.collection('items');

    app.use(express.urlencoded({extended: true}));
    app.use(express.static("public"));
    app.set("view engine", "ejs");
    //app.use(express.json());

    var items = [];

    app.get('/', (req, res) => {
        db.collection('items').find().toArray()
        .then(items => {
            res.render('result.ejs', { items: items })
        })
        .catch(error => console.error(error))
    })

    app.get('/myForm', (req, res) => res.render("pages/myForm"));
    app.get('/result', (req, res) => res.render("pages/result", {
    items:items}));

    app.post('/myForm', (req, res) => {
        const itemPromises = req.body.items.map(item => {
            items.push(item);
            console.log(req.body)
            typeof(req.body)
            return itemsCollection.insertOne(item); // returns a promise
        });
        Promise.all(itemPromises)
            .then(() => res.redirect('/result')
            .catch(console.error));
    });

    app.put('/items', (req, res) => {
        itemsCollection.findOneAndUpdate(
            { item: 'anything' },
            {
                $set:{
                    items: req.body.items
                }
            },
            {
                upsert: true
            }
            )
            .then(result => res.json('Success'))
            .catch(error => console.error(error))
    })

    app.delete('/items', (req, res) => {
        itemsCollection.deleteOne(
            { items: req.body.items }
        )
        .then(result => {
            if(result.deletedCount === 0) {
                return res.json('Nothing to delete')
            }
            res.json('deleted the selected item')
        })
        .catch(error => console.error(error))
   })
   const port = 3000
   app.listen(port, function () {
     console.log(`listening on ${port}`)
   })
 }).catch(console.error)
    