import 'dotenv/config';
import { connectToDatabase } from './config/db.js';
import { expressApp } from './config/express.js';

const port = process.env.PORT || 3000;

connectToDatabase()
    .then(()=> {
        const app = expressApp();

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(error => {
        console.log(error);
    });