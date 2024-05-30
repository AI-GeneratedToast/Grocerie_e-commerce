const produit = require('../controllers/produitController');
const router = require('express').Router();

/**
* @openapi
* /produit:
*   post:
*     description: Crée un nouveau produit.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               code:
*                 type: string
*                 description: Code du produit.
*               libelle:
*                 type: string
*                 description: Libellé du produit.
*               prix:
*                 type: number
*                 description: Prix du produit.
*               categories:
*                 type: array
*                 items:
*                   type: string
*                 description: Identifiants des catégories dont le produit fait partie.
*     responses:
*       201:
*         description: Produit créé avec succès.
*/
router.route('/produit')
  .post(produit.create_a_produit);

/**
* @openapi
* /produit/{produitId}:
*   get:
*     description: Retourne une catégorie spécifique par son ID.
*     parameters:
*       - in: path
*         name: produitId
*         required: true
*         description: Identifiant du produit à retrouver.
*         schema:
*           type: string
*     responses:
*       200:
*         description: Un produit spécifique.
*   put:
*     description: Met à jour un produit spécifique par son ID.
*     parameters:
*       - in: path
*         name: produitId
*         required: true
*         description: Identifiant du produit à mettre à jour.
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
*                 description: Code du produit.
*               libelle:
*                 type: string
*                 description: Libellé du produit.
*               prix:
*                 type: number
*                 description: Prix du produit.
*               categories:
*                 type: array
*                 items:
*                   type: string
*                 description: Identifiants des catégories dont le produit fait partie.
*     responses:
*       200:
*         description: Produit mis à jour avec succès.
*   delete:
*     description: Supprime un produit spécifique par son identifiant.
*     parameters:
*       - in: path
*         name: produitId
*         required: true
*         description: Identifiant du produit à supprimer.
*         schema:
*           type: string
*     responses:
*       200:
*         description: Produit supprimé avec succès.
*/
router.route('/produit/:produitId')
  .get(produit.read_a_produit)
  .put(produit.update_a_produit)
  .delete(produit.delete_a_produit);

router.route('/produit/code/:produitCode')
  .get(produit.read_a_produit_by_code)

/**
 * @openapi
 * /produits:
 *   get:
 *     description: Retourne une liste de tous les produits avec pagination. Par défaut, la limite par page est de 10 produits.
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Numéro de la page à afficher.
 *         required: false
 *         schema:
 *           type: number
 *       - name: limit
 *         in: query
 *         description: Nombre d'éléments par page.
 *         required: false
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Une liste de produits.
 *   post:
 *     description: Crée plusieurs produits.
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
 *                   description: Code du produit.
 *                 libelle:
 *                   type: string
 *                   description: Libellé du produit.
 *                 prix:
 *                   type: number
 *                   description: Prix du produit.
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Tableau des identifiants de catégories dont le produit fait partie.
 *     responses:
 *       201:
 *         description: Produits créés avec succès.
 */
router.route('/produits')
  .get(produit.list_all_produit)
  .post(produit.create_many_produits);

/**
 * @openapi
 * /produits/order-by-price:
 *   get:
 *     description: Retourne la liste des produits triés par prix.
 *     parameters:
 *       - name: ascending
 *         in: query
 *         description: Ordre de tri. Par défaut, les prix sont croissants.
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Succès
 *       500:
 *         description: Erreur serveur
 */
router.route('/produits/order-by-price')
  .get(produit.order_by_price);


/**
 * @openapi
 * /produits/order-by-libelle:
 *   get:
 *     description: Retourne la liste des produits triés par libellé.
 *     parameters:
 *       - name: ascending
 *         in: query
 *         description: Ordre de tri. Par défaut, dans l'ordre alphabétique.
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Succès
 *       500:
 *         description: Erreur serveur
 */
router.route('/produits/order-by-libelle')
  .get(produit.order_by_libelle);

module.exports = router;