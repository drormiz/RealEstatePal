import { compare, hash } from 'bcrypt';

export const hashPassword = async (password, saltRounds = 10) => await hash(password, saltRounds);

export const comparePaswords = async (passowrd, hashedPaswords) => await compare(passowrd, hashedPaswords);