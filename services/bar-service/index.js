const {MongoClient} = require('mongodb');
const express = require('express');

MongoClient.connect('mongodb://localhost/jambon').then(db => {
	const app = express();

	app.get('/foos', (req, res) => {
		db.collection('foos').find().toArray().then(foos => res.json(foos));
	});

	app.listen(9000);
});