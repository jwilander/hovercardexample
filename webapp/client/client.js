import request from 'superagent';

export default class Client {
    constructor() {
        this.url = window.location.origin;
    }

    getUserLdapAttributes = async (userId) => {
        return this.doGet(`${this.url}/plugins/ldapextras/users/${userId}/attributes`);
    }

    doGet = async (url, headers = {}) => {
        try {
            const response = await request.
                get(url).
                set({...headers, 'X-Requested-With': 'XMLHttpRequest'}).
                type('application/json').
                accept('application/json');

            return JSON.parse(response.text);
        } catch (err) {
            throw err;
        }
    }
}
