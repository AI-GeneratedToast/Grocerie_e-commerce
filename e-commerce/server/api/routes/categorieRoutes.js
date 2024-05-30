const categorie = require('../controllers/categorieController');
const router = require('express').Router();

/**
* @openapi
* /categorie:
*   post:
*     description: Crée une nouvelle catégorie.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               code:
*                 type: string
*                 description: Code de la catégorie.
*               designation:
*                 type: string
*                 description: Désignation de la catégorie.
*     responses:
*       201:
*         description: Catégorie créée avec succès.
*/
router.route('/categorie')
    .post(categorie.create_a_categorie);

        
/** 
* @openapi
* /categorie/search:
*   get:
*     description: Cherche des catégories par leur désignation.
*     parameters:
*       - name: "designation"
*         in: "query"
*         description: "Désignation à rechercher."
*         required: true
*         type: "string"
*     responses:
*       200:
*         description: Recherche réussie.
*       404:
*         description: Aucune correspondance trouvée.
*       500:
*         description: "Erreur serveur."
*/
router.route('/categorie/search')
    .get(categorie.search_by_designation); 


/**
* @openapi
* /categorie/{categorieId}:
*   get:
*     description: Retourne une catégorie spécifique par son ID.
*     parameters:
*       - in: path
*         name: categorieId
*         required: true
*         description: ID de la catégorie à retrouver.
*         schema:
*           type: string
*     responses:
*       200:
*         description: Une catégorie spécifique.
*   put:
*     description: Met à jour une catégorie spécifique par son ID.
*     parameters:
*       - in: path
*         name: categorieId
*         required: true
*         description: ID de la catégorie à mettre à jour.
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               code:
*                 type: string
*                 description: Code de la catégorie.
*               designation:
*                 type: string
*                 description: Désignation de la catégorie.
*     responses:
*       200:
*         description: Catégorie mise à jour avec succès.
*   delete:
*     description: Supprime une catégorie spécifique par son ID.
*     parameters:
*       - in: path
*         name: categorieId
*         required: true
*         description: ID de la catégorie à supprimer.
*         schema:
*           type: string
*     responses:
*       200:
*         description: Catégorie supprimée avec succès.
*/
router.route('/categorie/:categorieId')
    .get(categorie.read_a_categorie)
    .put(categorie.update_a_categorie)
    .delete(categorie.delete_a_categorie);

/**
* @openapi
* /categories:
*   get:
*     description: Retourne une liste de toutes les catégories.
*     responses: 
*       200:
*         description: Catégories retournés avec succès.
*   post:
*     description: Crée plusieurs catégories.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: array
*             items:
*               type: object
*               properties:
*                 code:
*                   type: string
*                   description: Code de la catégorie.
*                 designation:
*                   type: string
*                   description: Désignation de la catégorie.
*     responses:
*       200:
*         description: Catégories créées avec succès.
*   delete:
*     description: Supprime toutes les catégories.
*     responses:
*       200:
*         description: Toutes les catégories ont été supprimées.
*/
router.route('/categories')
    .get(categorie.list_all_categorie)
    .post(categorie.create_many_categories)
    .delete(categorie.delete_all_categories);

/**
 * @openapi
 * /categories/bulk-delete:
 *   delete:
 *     description: Permet de supprimer plusieurs catégories en une seule opération.
 *     requestBody:
 *       required: true
 *       description: Tableau d'identifiants de catégories.
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: string
 *     responses:
 *       200:
 *         description: Suppression réussie.
 *       400:
 *         description: Requête mal formatée.
 *       500:
 *         description: Erreur côté serveur.
 */
router.route('/categories/bulk-delete')
    .delete(categorie.delete_many_categories);

/**
 * @openapi
 * /categories/bulk-update:
 *   put:
 *     description: Met à jour plusieurs catégories simultanément.
 *     requestBody:
 *       required: true
 *       description: Tableau d'objets catégorie avec `id`, `code`, et `designation`.
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Identifiant de la catégorie.
 *                 code:
 *                   type: string
 *                   description: Code de la catégorie.
 *                 designation:
 *                   type: string
 *                   description: Désignation de la catégorie.
 *     responses:
 *       200:
 *         description: Mise à jour réussie.
 *       400:
 *         description: Données de la requête invalides.
 *       404:
 *         description: Catégorie(s) non trouvée(s).
 *       500:
 *         description: Erreur côté serveur.
 */    
router.route('/categories/bulk-update')
    .put(categorie.update_many_categories);

module.exports = router;