import { create } from 'middleware-axios/dist';

// URL APIS Proxys
export const apiMedia = create({
    baseURL: 'http://localhost:2001/',
});
export const apiMail = create({
    baseURL: 'https://baloo.pet/mail',
});