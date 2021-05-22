import { userMenuConstants } from '../Constants';
import { userMenuService } from '../../Services';
export const userMenuActions = {
    getUsersMenu
};

function getUsersMenu() {
    return dispatch => {
        dispatch(request());
        userMenuService.getUsersMenu()
            .then(
                menus => dispatch(success(menus) ),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userMenuConstants.GETALL_MENU_REQUEST } }
    function success(menus) { return { type: userMenuConstants.GETALL_MENU_SUCCESS, menus } }
    function failure(error) { return { type: userMenuConstants.GETALL_MENU_FAILURE, error } }
}
