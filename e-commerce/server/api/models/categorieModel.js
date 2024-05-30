var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CategorieSchema = new Schema({
  code: {
    type: String,
    required: 'Enter the code of the Categorie please'
  },

  designation:{
    type:String
  }

});

module.exports = mongoose.model('Categorie', CategorieSchema);
