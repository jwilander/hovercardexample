import {Client} from 'client';

export function getUserLdapAttributes(userId) {
    return async (dispatch, getState) => {
        let attributes;
        try {
            attributes = await Client.getUserLdapAttributes(userId);
        } catch (error) {
            return {data: null, error};
        }

        return {data: attributes, error: null};
    };
}
