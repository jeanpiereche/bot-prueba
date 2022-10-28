const { Schema, model } = require('mongoose')

const messageSchema = new Schema({
	object: String,
	id_conversation: String,
	messaging_product: String,
	display_phone_number: String,
	phone_number_id: String,
	name: String,
	message_from: String,
	message_id: String,
	message_timestamp: String,
	message_body: String,
	message_type: String
})

const Message = model('message', messageSchema)

module.exports = Message