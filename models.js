var mongoose = require('mongoose');
//var connect = process.env.MONGODB_URI;
mongoose.connect(process.env.MONGODB_URI);

var userSchema = mongoose.Schema({
  username: String,
  password: String,
})

User = mongoose.model('User', userSchema);

module.exports = {
  User
}
