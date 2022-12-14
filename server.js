require('dotenv').config()
require('./mongo')
const request = require("request")
const express = require("express")
const body_parser = require("body-parser")
const axios = require("axios")
const app = express().use(body_parser.json()); // creates express http server
const url = require('url');
const token = process.env.WHATSAPP_TOKEN;
/*
const dataJson = {
	"object": "whatsapp_business_account",
	"entry": [
		{
			"id": "103563949229287",
			"changes": [
				{
					"value": {
						"messaging_product": "whatsapp",
						"metadata": {
							"display_phone_number": "15550052666",
							"phone_number_id": "100351229557779"
						},
						"contacts": [
							{
								"profile": {
									"name": "Jeanpierre"
								},
								"wa_id": "51986705000"
							}
						],
						"messages": [
							{
								"from": "51986705000",
								"id": "wamid.HBgLNTE5ODY3MDUwMDAVAgASGCAzREIzOTg0Q0ZCNERGMTVCNTg4NUMzODUyMTM3N0YzOQA=",
								"timestamp": "1666915772",
								"text": {
									"body": "Ehnrhnyrn"
								},
								"type": "text"
							}
						]
					},
					"field": "messages"
				}
			]
		}
	]
}
*/
const messagesRouter = require('./controllers/message')
app.use('/messages', messagesRouter)

//path test
app.get('/', (req, res) => {
	// axios({
	// 	method: 'post',
	// 	url: 'http://localhost:3001/messages',
	// 	data: dataJson
	// })
	console.log(req.protocol + "://" + req.headers.host)
	res.send('Enviado...')
})
// Accepts POST requests at /webhook endpoint
app.post("/webhook", async (req, res) => {
	// Parse the request body from the POST
	let body = req.body;
	const base_url = req.protocol + "://" + req.headers.host;
	// Check the Incoming webhook message
	const dataJson = JSON.stringify(req.body, null, 2);
	console.log(dataJson);
	// info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
	if (req.body.object) {
		if (
			req.body.entry &&
			req.body.entry[0].changes &&
			req.body.entry[0].changes[0] &&
			req.body.entry[0].changes[0].value.messages &&
			req.body.entry[0].changes[0].value.messages[0]
		) {
			let phone_number_id = req.body.entry[0].changes[0].value.metadata.phone_number_id;
			let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
			let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
			const URL = "https://graph.facebook.com/v12.0/" + phone_number_id + "/messages?access_token=" + token
			const DATA = {
				messaging_product: "whatsapp",
				to: from,
				text: { body: "Ack: " + msg_body },
			}

			// axios({
			// 	method: "POST", // Required, HTTP method, a string, e.g. POST, GET
			// 	url: URL,
			// 	data: DATA,
			// 	headers: { "Content-Type": "application/json" },
			// }).catch((e) => {
			// 	console.warn(e)
			// })

			await axios({
				method: 'POST',
				url: base_url + '/messages',
				data: dataJson,
				headers: { "Content-Type": "application/json" },
			}).catch((e) => {
				console.warn(e)
			})

		}
		res.sendStatus(200);
	} else {
		// Return a '404 Not Found' if event is not from a WhatsApp API
		res.sendStatus(404);
	}
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests 
app.get("/webhook", (req, res) => {
	/**
	 * UPDATE YOUR VERIFY TOKEN
	 *This will be the Verify Token value when you set up webhook
	**/
	console.log('ggg')
	const verify_token = process.env.VERIFY_TOKEN;

	// Parse params from the webhook verification request
	let mode = req.query["hub.mode"];
	let token = req.query["hub.verify_token"];
	let challenge = req.query["hub.challenge"];

	// Check if a token and mode were sent
	if (mode && token) {
		// Check the mode and token sent are correct
		if (mode === "subscribe" && token === verify_token) {
			// Respond with 200 OK and challenge token from the request
			console.log("WEBHOOK_VERIFIED");
			res.status(200).send(challenge);
		} else {
			// Responds with '403 Forbidden' if verify tokens do not match
			res.sendStatus(403);
		}
	}
});

// Sets server port and logs message on success
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log("webhook is listening"));
