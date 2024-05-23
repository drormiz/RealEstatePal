import { UserModel } from './user.model.js';
import { hashPassword } from '../services/hashPassword.js';

export const usersData = [
    { name: 'John Doe', username: 'john@example.com', password: '11111111' },
    { name: 'Jane Smith', username: 'jane@example.com', password: '22222222' },
    { name: 'Ben', username: 'ben@example.com', password: '33333333' }
];

const seedUsers = async () => {
    try {
        await UserModel.deleteMany({});
        const hashedUsers = await Promise.all(usersData.map(async user => ({ ...user, password: await hashPassword(user.password) })));

        await UserModel.insertMany(hashedUsers);

        console.log('Users seeded successfully');
    } catch (error) {
        console.error('Error seeding users:', error);
    }
};

export default seedUsers;