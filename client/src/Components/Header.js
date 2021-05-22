import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useLocation
  } from "react-router-dom";
  
  
import { PrivateRoute } from './PrivateRoute'
import { LoginPage,HomePage } from '../Pages'
import { NavBar } from '../Components';
import { useDispatch, useSelector } from 'react-redux'

import { authHeader } from '../Helpers';
import { userMenuActions } from '../Redux/Actions'


function Header() {
    
    const user = useSelector(state => state.authentication); 
    const userMenus = useSelector(state => state.usersMenu);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userMenuActions.getUsersMenu());
    }, []);
    console.log(user.loggedIn);
    return (
        <Router>
            { user.loggedIn &&
                <NavBar userMenus={userMenus.items} />
            }
            <Switch>
                <PrivateRoute exact path="/manage/dashboard" component={HomePage} />
                <PrivateRoute exact path="/manage/user" component={HomePage} />
                <PrivateRoute exact path="/manage/userprivilege" component={HomePage} />
                <PrivateRoute exact path="/manage/userprivilege" component={HomePage} />
                <PrivateRoute exact path="/manage/accesslist" component={HomePage} />
                <PrivateRoute exact path="/manage/acl" component={HomePage} />
                <PrivateRoute exact path="/manage/page" component={HomePage} />
                <PrivateRoute exact path="/manage/page/add" component={HomePage} />
                <PrivateRoute exact path="/manage/page/edit/:id" component={HomePage} />
                <PrivateRoute exact path="/manage/slider" component={HomePage} />
                <Route path="/" component={LoginPage} />
                <Redirect from="*" to="/" />
            </Switch>
        </Router>
    )
}

export { Header };

  