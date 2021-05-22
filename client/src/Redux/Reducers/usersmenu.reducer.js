import { userMenuConstants } from '../Constants';

export function usersMenu(state = {}, action) {
    switch (action.type) {
        case userMenuConstants.GETALL_MENU_REQUEST:
            return {
                loading: true
            };
        case userMenuConstants.GETALL_MENU_SUCCESS:
            return {
                items: action.menus
            };
        case userMenuConstants.GETALL_MENU_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}