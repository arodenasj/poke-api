
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SearchBar } from './search-bar';

export function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-pokemon-red shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                className="h-10 w-auto" 
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" 
                alt="Pokedex Logo"
              />
              <span className="ml-2 text-white font-bold text-xl">PokéLookup</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <SearchBar />
            <div className="hidden md:flex items-center space-x-1">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
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
              >
                Types
              </Link>
            </div>
          </div>
          
          <div className="flex md:hidden items-center">
            <SearchBar />
          </div>
        </div>
      </div>
      
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex justify-center">
          <Link 
            to="/" 
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive('/') 
                ? 'bg-white/20 text-white' 
                : 'text-white/90 hover:bg-white/10 hover:text-white'
            }`}
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
          >
            Types
          </Link>
        </div>
      </div>
    </nav>
  );
}
