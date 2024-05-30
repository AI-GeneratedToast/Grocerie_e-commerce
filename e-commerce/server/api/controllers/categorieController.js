const mongoose = require('mongoose');
const Categorie = require('../models/categorieModel');

exports.list_all_categorie = function(req, res) {
  Categorie.find({}, function(err, categorie) {
    if (err)
      res.send(err);
    res.json(categorie);
  });
};

exports.create_a_categorie = function(req, res) {
  var new_categorie = new Categorie(req.body);
  new_categorie.save(function(err, categorie) {
    if (err)
      res.send(err);
    res.status(201).json(categorie);
  });
};


exports.read_a_categorie = function(req, res) {
  Categorie.findById(req.params.categorieId, function(err, categorie) {
    if (err)
      res.send(err);
    res.json(categorie);
  });
};


exports.update_a_categorie = function(req, res) {
  Categorie.findOneAndUpdate({_id: req.params.categorieId}, req.body, {new: true}, function(err, categorie) {
    if (err) {
      res.status(404).send(err);
  } else {
      res.status(200).send({ message: 'La m-a-j a été effectuée avec succès' });
  }

  });
};


exports.delete_a_categorie = function(req, res) {
  Categorie.deleteOne({
    _id: req.params.categorieId
  }, function(err, categorie) {
    if (err)
      res.send(err);
    res.json({ message: 'Catégorie supprimée avec succès.' });
  });
};


exports.create_many_categories = function(req, res) {
  let categoryArray = req.body;

  if (!Array.isArray(categoryArray)) {
    return res.status(400).send({ message: "L'entrée doit être une liste de catégories." });
  }

  Categorie.insertMany(categoryArray, function(err, categories) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json(categories);
    }
  });
  };


exports.delete_all_categories = function(req, res) {
  Categorie.deleteMany({}, function(err) {
      if (err) {
          res.status(500).send(err);
      } else {
          res.status(200).send({ message: 'Toutes les catégories ont été supprimées' });
      }
  });
  };


  /* Fonctionnalites additionnelles */

  exports.delete_many_categories = async function(req, res) {
    let deletedIds = req.body;
    
    if (!Array.isArray(deletedIds)) {
      return res.status(400).send({message: "L'entrée doit être une liste d'identifiants."});
    }

    try {
      await Categorie.deleteMany({ _id: {$in: deletedIds} } );
      return res.status(200).send({message: 'Les catégories ont été supprimées'});
    } catch (error) {
      return res.status(500).send(error);
    }
  };


  exports.update_many_categories = async function(req, res) {
    let updatedCategories = req.body;
    
    if (!Array.isArray(updatedCategories)) {
      return res.status(400).send({message: "L'entrée doit être une liste de catégories."});
    }

    try {
      for (const category of updatedCategories) {
        const updatedCategory = await Categorie.findOneAndUpdate(
          { _id: category.id },
          { code: category.code, designation: category.designation},
          { new: true}
        )
        if (!updatedCategory) {
          return res.status(404).send({ message: `Catégorie non trouvée avec l'identifiant ${category.id}` });
        }
      };

      return res.status(200).send({ message: 'Les catégories ont été mises à jour'});
    } catch (error) {
      return res.status(500).send(error);
    }
  };

  exports.search_by_designation = async function(req, res) {
    const designationQuery = req.query.designation;

    try {
      const categories = await Categorie.find({ designation: new RegExp(`${designationQuery}`, 'i')});
      
      if (categories) 
        return res.status(200).send(categories);
      else 
        return res.status(404).send({ message: 'Aucune correspondance.' });
    } catch (error) {
      return res.status(500).send(error);
    }
  }

