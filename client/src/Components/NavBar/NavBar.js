import React, { useState, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as RiIcons from 'react-icons/ri';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useLocation
  } from "react-router-dom";
  
import { useDispatch, useSelector } from 'react-redux'
import { PrivateRoute } from '../PrivateRoute'
import { LoginPage, HomePage, DashboardPage } from '../../Pages'

import './NavBar.css'

const NavBar = (props) => {
	let history = useHistory();
	
	/*const location = useLocation();
	const { pathname } = location
	const splitLocation = pathname.split("/");
	*/

  	//const [sidebar, setSidebar] = useState(false);
	const [childeMenuShow, setchildeMenuShow] = useState('');
	//const [userMenus, setMenus] = useState([]);

	function ChildMenuList(props) {
		const menuList = props.menuList;
		const listItems = menuList.map((subMenus) =>
			// Wrong! The key should have been specified here:
			<li key={subMenus.id}>
				<Link to={subMenus.controller_name.toLowerCase()}>{subMenus.menu_name}</Link>
			</li>

		);
		return listItems;
	}
	
	function ParentMenu(props)
	{
		return ( <ul id="menu-content" className="menu-content collapse out">
		  { props.userMenu.map((menus) =>
			<li key={menus.id} onClick={()=>setchildeMenuShow((childeMenuShow == menus.menu_name.toLowerCase())?'':menus.menu_name.toLowerCase())}>
				{ menus.children ?
					<Link to="#">
						<FaIcons.FaInbox /> {menus.menu_name} <RiIcons.RiArrowDownSFill />
					</Link>
					 : 
					<Link to={menus.controller_name.toLowerCase()}>
						<FaIcons.FaUsers /> {menus.menu_name}
					</Link>
				}
				
				<ul  id={menus.menu_name.toLowerCase()}  className={'sub-menu collapse' + (childeMenuShow === menus.menu_name.toLowerCase()? ' in' : '')}>
					{ menus.children && <ChildMenuList menuList={menus.children} />}
				</ul>
			</li>
		  )}
		</ul>
		)
	}

	return (		
			<div className="nav-side-menu">
				<div className="brand">Brand Logo</div>
				<i className="fa fa-bars fa-2x toggle-btn"></i>      
				<div className="menu-list">
				{ props.userMenus &&
					<ParentMenu userMenu={props.userMenus} />
				}
				</div>
			</div>
		)
}

export { NavBar };