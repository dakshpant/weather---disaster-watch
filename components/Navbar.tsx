import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import clsx from "clsx";

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-fortis-bg/80 backdrop-blur-md border-b border-fortis-surface h-16 flex items-center px-6 justify-between">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-6 h-6 text-fortis-primary" />
        <Link to="/" className="text-xl font-bold tracking-wider text-fortis-text">
          FORTIS
        </Link>
      </div>

      <div className="flex items-center gap-8">
        <Link
          to="/"
          className={clsx(
            "text-sm font-medium transition-colors hover:text-fortis-primary",
            isActive("/") ? "text-fortis-primary" : "text-fortis-muted"
          )}
        >
          HOME
        </Link>

        <Link
          to="/analysis/Tamil Nadu"
          className={clsx(
            "text-sm font-medium transition-colors hover:text-fortis-primary",
            location.pathname.startsWith("/analysis")
              ? "text-fortis-primary"
              : "text-fortis-muted"
          )}
        >
          ANALYSIS
        </Link>

        {/* <Link
          to="/about"
          className="text-sm font-medium text-fortis-muted hover:text-fortis-primary transition-colors"
        >
          ABOUT
        </Link> */}
      </div>
    </nav>
  );
};
