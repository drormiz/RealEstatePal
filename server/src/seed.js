import { connectToDatabase } from './config/db.js';
import seedUsers from './users/user.seed.js';

connectToDatabase()
    .then(async () => {
        await seedUsers();
    }).catch((e) => {
        console.log('unable to connect');
    })