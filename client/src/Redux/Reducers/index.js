import { combineReducers } from 'redux';
import { authentication } from './authentication.reducer';
import { users } from './users.reducer';
import { alert } from './alert.reducer';
import { usersMenu } from './usersmenu.reducer';

const rootReducer = combineReducers({
    authentication,
    users,
    alert,
    usersMenu
});

export default rootReducer;