var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var category = mongoose.model('Categorie');


var ProduitSchema = new Schema({
  code: {
    type: String,
    required: 'Enter the code of the Product please'
  },

  libelle:{
    type:String
  },

  prix:{
    type:Number
  },

  stripeId:{
    type:String,
  },

  categorie: {
    type:Schema.Types.ObjectId,
    ref:'Categorie' // ou bien ref:category
  }

});

module.exports = mongoose.model('Produit', ProduitSchema);
