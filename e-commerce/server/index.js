require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerConfig = require('./api/data/swaggerConfig');
const serverConfig = require('./api/data/serverConfig.json');

const categorieRoutes = require('./api/routes/categorieRoutes'); 
const produitRoutes = require('./api/routes/produitRoutes'); 
const userRoutes = require('./api/routes/userRoutes');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// initialisations
const app = express();
const swaggerSpec = swaggerJSDoc(swaggerConfig);

// middlewares
app.use(cors());
app.use(cors({ origin: `http://localhost:3000/`, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// connexion mongoose
mongoose.Promise = global.Promise;
mongoose.connect(serverConfig.dbConnection, 
    { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Connecté à la base de données.'));

// routes
app.use(categorieRoutes);
app.use(produitRoutes);
app.use(userRoutes);
app.get('/', (req, res) => res.send('Bienvenue sur le serveur.'));

//Stripe payment
app.post('/checkout', async (req, res) => {
  try {
    console.log('Checkout request body:', req.body);
    const items = req.body.items;
    let lineItems = items.map(item => ({
      price: item.stripeId,
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `http://localhost:3000/`,
      cancel_url: `http://localhost:3000/`
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// demarrage
app.listen(serverConfig.port);
console.log(`RESTful API de gestion de produits à l'écoute sur le port ${serverConfig.port}.`);