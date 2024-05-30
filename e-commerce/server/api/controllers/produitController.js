const mongoose = require('mongoose');
const Produit = require('../models/produitModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


exports.list_all_produit = function(req, res) {
  Produit.find({})
    .exec(function(err, produits) {
      if (err) {
        res.status(500).send(err);
      }
      else {
        res.json(produits);
      }
    });
};


exports.create_a_produit = async function(req, res) {
  try {
    // Step 1: Create the product in Stripe
    console.log('Creating product in Stripe...');
    const stripeProduct = await stripe.products.create({
      name: req.body.libelle,
      description: "The name of the item is: " + req.body.libelle  
    });
    console.log('Product created in Stripe:', stripeProduct);

    // Step 2: Optionally create a price for the product in Stripe
    console.log('Creating price for product in Stripe...');
    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: req.body.prix * 100, 
      currency: 'cad', 
    });
    console.log('Price created in Stripe:', stripePrice);

    // Step 3: Save the product in MongoDB with the Stripe product ID
    const new_produit = new Produit({
      code: req.body.code,
      libelle: req.body.libelle,
      prix: req.body.prix,
      stripeId: stripePrice.id,
      categorie: req.body.categorie 
    });
    const produit = await new_produit.save();

    // Step 4: Respond with the product data from both MongoDB and Stripe
    res.json({
      produit,
      stripeProduct,
      stripePrice
    });
  } catch (err) {
    // Log the error for debugging purposes
    console.error('Error in create_a_produit:', err);

    // Handle any errors
    res.status(500).send(err);
  }
};



exports.read_a_produit = function(req, res) {
  Produit.findById(req.params.produitId, function(err, produit) {
    if (err)
      res.send(err);
    res.json(produit);
  });
};

exports.read_a_produit_by_code = function(req, res) {
  Produit.find({"code": req.params.produitCode}, function(err, produit) {
    if (err)
      res.send(err);
    res.json(produit);
  });
};


exports.update_a_produit = function(req, res) {
  Produit.findOneAndUpdate({_id: req.params.produitId}, req.body, {new: true}, function(err, produit) {
    if (err)
      res.send(err);
    res.json(produit);
  });
};


exports.delete_a_produit = function(req, res) {
  Produit.deleteOne({
    _id: req.params.produitId
  }, function(err, produit) {
    if (err)
      res.send(err);
    res.json({ message: 'Produit supprimé avec succès.' });
  });
};

exports.create_many_produits = function(req, res) {
  let productArray = req.body;

  if (!Array.isArray(productArray)) {
    return res.status(400).send({ message: "L'entrée doit être une liste de produits." });
  }

  Produit.insertMany(productArray, function(err, products) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json(products);
    }
  });
  };


exports.order_by_price = function(req, res) {
  const ascending = req.query.ascending === 'false' ? false : true;

  const sortDirection = ascending ? 1 : -1;

  Produit.find().sort({ prix: sortDirection }).exec(function(err, produits) {
    if (err)
      res.send(err);

    res.json(produits);
  });
};


exports.order_by_libelle = function(req, res) {
  const ascending = req.query.ascending === 'false' ? false : true;

  const sortDirection = ascending ? 1 : -1;

  Produit.find().sort({ libelle: sortDirection }).exec(function(err, produits) {
    if (err)
      res.send(err);

    res.json(produits);
  });
};

