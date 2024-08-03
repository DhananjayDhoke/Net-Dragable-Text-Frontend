import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = ({toggleSideBar}) => {

  console.log("togglesidebar",toggleSideBar)
  return (
    <div>
        {/* ======= Sidebar ======= */}
        <aside className="sidebar" style={{ left: toggleSideBar ? "0" : "" }}>
            <ul className="sidebar-nav">
              <li className="nav-item">
                <NavLink to={'/dashboard'} className={({isActive})=> isActive? "nav-link" :"nav-link collapsed"}>
                  <i className="bi bi-grid"></i>
                  <span>Dashboard</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to={'/imageSection'} className={({isActive})=> isActive? "nav-link" :"nav-link collapsed"}>
                  <i className="bi bi-file-check-fill"></i>
                  <span>Image</span>
                </NavLink>
              </li>
            </ul>
          </aside>
          {/* End Sidebar */}
    </div>
  )
}

export default Sidebar