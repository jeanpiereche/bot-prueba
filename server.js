require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.send(
		"Simple WhatsApp Webhook tester</br>There is no front-end, see server.js for implementation!"
	);
})

app.get("/webhook", (req, res) => {
	if (
		req.query["hub.mode"] == "subscribe" &&
		req.query["hub.verify_token"] == "token"
	) {
		res.send(req.query["hub.challenge"]);
	} else {
		res.sendStatus(400);
	}
});

app.post("/webhook", (req, res) => {
	console.log("Incoming webhook: " + JSON.stringify(req.body));
	res.sendStatus(200);
});

const PORT = process.env.PORT || 3001
const listener = app.listen(PORT, () => {
	console.log("Your app is listening on port " + listener.address().port);
});