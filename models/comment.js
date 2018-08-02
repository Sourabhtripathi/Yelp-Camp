var mongoose = require("mongoose");

commentsSchema = new mongoose.Schema({
	content : String,
	author : {
		id : {
			type : mongoose.Schema.Types.ObjectId,
			ref : "User"
		},
		username : String
	}
});

module.exports = mongoose.model("Comment" , commentsSchema);