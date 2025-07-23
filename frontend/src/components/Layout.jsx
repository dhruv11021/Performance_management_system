import { NavLink } from "react-router-dom";

function Layout({ children }) {
  return (
    <div className="performance-system">
      <header className="main-header">
        <h1 className="system-title">Performance Management System</h1>
        <nav className="main-navigation">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-button active" : "nav-button"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/employees"
            className={({ isActive }) =>
              isActive ? "nav-button active" : "nav-button"
            }
          >
            Employees
          </NavLink>
          <NavLink
            to="/goals"
            className={({ isActive }) =>
              isActive ? "nav-button active" : "nav-button"
            }
          >
            Goals
          </NavLink>
          <NavLink
            to="/reviews"
            className={({ isActive }) =>
              isActive ? "nav-button active" : "nav-button"
            }
          >
            Reviews
          </NavLink>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              isActive ? "nav-button active" : "nav-button"
            }
          >
            Reports
          </NavLink>
        </nav>
      </header>

      <main className="main-content">{children}</main>
    </div>
  );
}

export default Layout;
