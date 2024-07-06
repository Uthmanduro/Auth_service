const express = require('express');
require('dotenv').config();
const bodyParser = require("body-parser");
const sequelize = require('./config.js');
const userRoute = require('./routes/userRoute.js')


const app = express();
const port = process.env.PORT || 8000;

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(userRoute);

// Sync the model with the database
(async () => {
  try {
    await sequelize.sync();
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Database synchronization error:', error);
  }
})();


app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
});



// const gracefulShutdown = async () => {
//     console.log('Received shutdown signal, shutting down gracefully...');
    
//     // Close the server to stop accepting new connections
//     server.close(async (err) => {
//       if (err) {
//         console.error('Error closing server:', err);
//         process.exit(1);
//       }
  
//       // Close the Sequelize connection
//       try {
//         await sequelize.close();
//         console.log('Sequelize connection closed gracefully.');
//         process.exit(0);
//       } catch (err) {
//         console.error('Error closing Sequelize connection:', err);
//         process.exit(1);
//       }
//     });
//   };
  
//   // Listen for termination signals
//   process.on('SIGTERM', gracefulShutdown);
//   process.on('SIGINT', gracefulShutdown);