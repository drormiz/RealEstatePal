import {getClient} from '.';

export const getAllUsersFn = async () => (await getClient().get('api/users/all')).data;

export const getUsersByFilterFn = async filter => filter.trim().length ? (await getClient().get(`api/users/filter/${filter}`)).data : [];