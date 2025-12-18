const app = require('./app.js');
const {connectDB} = require('./data/connection.js');
const {ensureAdminExists} = require('./models/userModel.js');

const PORT = 3000;

connectDB().then(async () => {
  await ensureAdminExists();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});