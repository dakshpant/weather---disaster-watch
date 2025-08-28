import React from 'react';

interface NavLinkProps {
    href: string;
    current: boolean;
    children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, current, children }) => {
    const activeClasses = 'border-cyan-400 text-cyan-400 bg-cyan-900/20';
    const inactiveClasses = 'border-transparent text-slate-400 hover:text-white hover:border-slate-600';
    return (
        <a href={href} className={`py-2 px-3 border-b-2 text-sm font-medium transition-colors duration-200 ${current ? activeClasses : inactiveClasses}`}>
            {children}
        </a>
    )
};

interface NavbarProps {
    route: string;
}

export const Navbar: React.FC<NavbarProps> = ({ route }) => {
    return (
        <nav className="bg-slate-900/70 backdrop-blur-sm border-b border-t border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center h-12">
                    <div className="flex items-baseline space-x-2 sm:space-x-4">
                        <NavLink href="#/" current={route === '#/' || route === ''}>Home</NavLink>
                        <NavLink href="#/flood" current={route === '#/flood'}>Flood</NavLink>
                        <NavLink href="#/earthquake" current={route === '#/earthquake'}>Earthquake</NavLink>
                        <NavLink href="#/avalanche" current={route === '#/avalanche'}>Avalanche</NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
};