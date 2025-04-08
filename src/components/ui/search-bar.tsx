
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { usePokemonSearch } from '@/hooks/use-pokemon';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  
  const { data: searchResults, isLoading } = usePokemonSearch(query);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/pokemon/${query.toLowerCase().trim()}`);
      setQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSelect = (name: string) => {
    navigate(`/pokemon/${name}`);
    setQuery('');
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className={`relative transition-all duration-300 ${isExpanded ? 'w-48 sm:w-60' : 'w-32 sm:w-40'}`}>
          <Input
            type="text"
            placeholder="Search Pokémon..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(e.target.value.length > 1);
            }}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => {
              setIsExpanded(false);
              // Small delay to allow clicking on suggestions
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            className="rounded-l-md border-r-0 bg-white/80 pr-10 focus:bg-white text-sm h-9"
          />
        </div>
        <Button 
          type="submit" 
          variant="default" 
          className="rounded-l-none bg-pokemon-yellow border-l-0 hover:bg-yellow-500 h-9 px-2"
          size="icon"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {showSuggestions && searchResults && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {searchResults.map((pokemon) => (
              <li 
                key={pokemon.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => handleSelect(pokemon.name)}
              >
                <img 
                  src={pokemon.sprites.front_default} 
                  alt={pokemon.name} 
                  className="w-8 h-8 mr-2"
                />
                <span>
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showSuggestions && isLoading && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg p-4 text-center">
          Loading...
        </div>
      )}
    </div>
  );
}
