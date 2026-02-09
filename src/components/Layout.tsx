import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LineChart, Activity, Calculator, User, Menu, X, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
    onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
        { name: 'Glucose', path: '/glucose', icon: <LineChart size={20} /> },
        { name: 'Symptoms', path: '/symptoms', icon: <Activity size={20} /> },
        { name: 'Calculator', path: '/calculator', icon: <Calculator size={20} /> },
        { name: 'Wellness', path: '/wellness', icon: <User size={20} /> },
    ];

    return (
        <div className="app-container">
            {/* Sidebar for Desktop */}
            <aside className="sidebar glass hidden md:flex">
                <div className="sidebar-logo">
                    <Activity className="text-blue-primary" size={32} />
                    <span>DiabetesCare</span>
                </div>
                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    ))}
                    <button onClick={onLogout} className="nav-item logout-btn mt-auto">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="header glass md:hidden">
                    <div className="header-inner">
                        <Activity className="text-blue-primary" size={24} />
                        <span className="logo-text">DiabetesCare</span>
                        <div className="flex gap-2">
                            <button className="menu-toggle" onClick={onLogout}>
                                <User size={24} />
                            </button>
                            <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </header>

                <section className="content-area">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </section>
            </main>

            {/* Bottom Navigation for Mobile */}
            <nav className="bottom-nav glass md:hidden">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        {item.icon}
                        <span className="text-[10px]">{item.name}</span>
                    </Link>
                ))}
            </nav>

            <style>{`
        .app-container {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg-app);
        }

        /* Sidebar Styles */
        .sidebar {
          width: 260px;
          height: 100vh;
          position: sticky;
          top: 0;
          display: flex;
          flex-direction: column;
          padding: 24px;
          border-right: 1px solid var(--border-color);
          z-index: 100;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 40px;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          text-decoration: none;
          color: var(--text-muted);
          font-weight: 500;
          transition: var(--transition-normal);
        }

        .nav-item:hover {
          background: var(--blue-soft);
          color: var(--blue-primary);
        }

        .nav-item.active {
          background: var(--blue-primary);
          color: white;
          box-shadow: 0 4px 12px hsla(200, 85%, 60%, 0.3);
        }

        .logout-btn { background: none; border: none; width: 100%; cursor: pointer; }
        .logout-btn:hover { color: var(--red-primary) !important; background: var(--red-soft) !important; }

        .mt-auto { margin-top: auto; }
        .flex { display: flex; }
        .gap-2 { gap: 8px; }

        /* Content Styles */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .header {
          position: sticky;
          top: 0;
          z-index: 90;
          padding: 12px 20px;
          border-bottom: 1px solid var(--border-color);
        }

        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-text {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .menu-toggle {
          background: none;
          border: none;
          color: var(--text-main);
          cursor: pointer;
        }

        .content-area {
          padding: 32px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        /* Bottom Nav Styles */
        .bottom-nav {
          position: fixed;
          bottom: 16px;
          left: 16px;
          right: 16px;
          height: 64px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-radius: var(--radius-lg);
          padding: 0 12px;
          z-index: 100;
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          text-decoration: none;
          color: var(--text-muted);
          transition: var(--transition-normal);
          padding: 8px;
          border-radius: var(--radius-md);
        }

        .bottom-nav-item.active {
          color: var(--blue-primary);
          background: var(--blue-soft);
        }

        .text-blue-primary { color: var(--blue-primary); }

        @media (max-width: 768px) {
          .content-area {
            padding: 20px;
            padding-bottom: 100px; /* Space for bottom nav */
          }
          .hidden.md\\:flex { display: none; }
        }

        @media (min-width: 769px) {
          .md\\:hidden { display: none; }
        }
      `}</style>
        </div>
    );
};

export default Layout;
