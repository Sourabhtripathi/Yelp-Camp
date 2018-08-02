var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

usersSchema = new mongoose.Schema({
	
	username : String,
	password : String
});

usersSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User" , usersSchema);