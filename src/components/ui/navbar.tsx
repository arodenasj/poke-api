
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SearchBar } from './search-bar';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-pokemon-red shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                className="h-10 w-auto mr-2"
                src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi.svg" 
                alt="PokeAPI Logo"
              />
              <img 
                className="h-10 w-auto ml-2 hidden sm:block"
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" 
                alt="Pokedex Logo"
              />
              <span className="ml-2 text-white font-bold text-xl">Antonio Ródenas</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <SearchBar />
            <div className="flex items-center space-x-1">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                Inicio
              </Link>
              <Link 
                to="/types" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/types') 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                Tipos
              </Link>
            </div>
          </div>
          
          <div className="flex md:hidden items-center">
            <SearchBar />
            <button 
              onClick={toggleMobileMenu}
              className="ml-2 p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
          <Link 
            to="/" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive('/') 
                ? 'bg-white/20 text-white' 
                : 'text-white/90 hover:bg-white/10 hover:text-white'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/types" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive('/types') 
                ? 'bg-white/20 text-white' 
                : 'text-white/90 hover:bg-white/10 hover:text-white'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Types
          </Link>
        </div>
      </div>
    </nav>
  );
}
