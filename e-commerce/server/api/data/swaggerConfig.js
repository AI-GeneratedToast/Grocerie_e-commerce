const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Documentation API',
      version: '1.0.0',
      description: "Documentation de l'API de gestion de produits.",
    },
    servers: [
      {
        url: 'http://localhost:9001', // Replace with your server URL
        description: 'Serveur local',
      },
    ],
    // Ajoutez d'autres configurations ici si nécessaire
  };
  
  module.exports = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['./api/routes/*.js'], // Change this to the path where your route files are
  };
  