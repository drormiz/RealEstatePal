import 'dotenv/config';
import { connectToDatabase } from './config/db.js';
import { expressApp } from './config/express.js';

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

connectToDatabase()
  .then(() => {
    const app = expressApp();

    app.listen(port, host, () => {
      console.log(
        `Server is running on http://${host}:${port}, host: ${host}, port: ${port}`
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
