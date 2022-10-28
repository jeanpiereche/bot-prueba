const messagesRouter = require('express').Router()
const Message = require('../models/Message')

messagesRouter.get('/', async (req, res) => {
	const message = await Message.find({})
	res.json(message)
})

messagesRouter.post('/', async (req, res) => {

	const { body } = req
	const { object } = body.object
	const { id: id_conversation, changes } = body.entry[0]
	const { messaging_product, metadata, contacts, messages } = changes[0].value
	const { display_phone_number, phone_number_id } = metadata
	const { name } = contacts[0].profile
	const { from: message_from,
		id: message_id,
		timestamp: message_timestamp,
		text,
		type: message_type } = messages[0]
	const { body: message_body } = text

	const newMessage = new Message({
		object,
		id_conversation,
		messaging_product,
		display_phone_number,
		phone_number_id,
		name,
		message_from,
		message_id,
		message_timestamp,
		message_body,
		message_type
	})

	try {
		const savedMessage = await newMessage.save()
		res.status(201).json(savedMessage)
	} catch (error) {
		console.log(error)
	}
})

module.exports = messagesRouter


