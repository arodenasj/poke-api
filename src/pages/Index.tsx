
import React, { useState, useEffect } from 'react';
import { usePokemonList } from '@/hooks/use-pokemon';
import { PokemonCard } from '@/components/ui/pokemon-card';
import { Navbar } from '@/components/ui/navbar';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { PokemonService } from '@/services/pokemon-service';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTypeList } from '@/hooks/use-pokemon';
import { Search, Filter } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonDetails, setPokemonDetails] = useState<any[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  
  // Calculate the offset based on the current page
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  // Fetch the Pokemon list
  const { 
    data: pokemonList, 
    isLoading: isLoadingList,
    isError: isListError
  } = usePokemonList(151, 0); // Get the first 151 Pokémon (first generation)

  // Fetch the type list for filtering
  const { data: typeList } = useTypeList();

  // Fetch detailed information for displayed Pokemon
  useEffect(() => {
    const fetchPokemonDetails = async () => {
      if (pokemonList) {
        setIsLoadingDetails(true);
        
        let filteredPokemon = [...pokemonList.results];
        
        // Apply type filter if selected
        if (selectedType !== 'all' && typeList) {
          try {
            const typeInfo = await PokemonService.getTypeDetail(selectedType);
            const pokemonOfType = typeInfo.pokemon.map(p => p.pokemon);
            
            // Filter the Pokemon list to only include Pokemon of the selected type
            filteredPokemon = filteredPokemon.filter(p => 
              pokemonOfType.some(tp => tp.name === p.name)
            );
          } catch (error) {
            console.error('Error fetching type details:', error);
          }
        }
        
        // Paginate the filtered results
        const paginatedPokemon = filteredPokemon.slice(offset, offset + ITEMS_PER_PAGE);
        
        try {
          const detailsPromises = paginatedPokemon.map(pokemon => 
            PokemonService.getPokemonDetail(pokemon.name)
          );
          const details = await Promise.all(detailsPromises);
          setPokemonDetails(details);
        } catch (error) {
          console.error('Error fetching Pokemon details:', error);
        } finally {
          setIsLoadingDetails(false);
        }
      }
    };
    
    fetchPokemonDetails();
  }, [pokemonList, offset, selectedType, typeList]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setCurrentPage(1); // Reset to first page when changing type
  };

  // Calculate the total number of pages
  const totalPokemon = pokemonList ? (selectedType === 'all' ? pokemonList.results.length : pokemonDetails.length * (151 / ITEMS_PER_PAGE)) : 0;
  const totalPages = Math.ceil(totalPokemon / ITEMS_PER_PAGE);

  if (isLoadingList || isLoadingDetails) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-rotate-slow">
              <img 
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                alt="Loading"
                className="w-16 h-16"
              />
            </div>
            <p className="mt-4 text-lg">Loading Pokémon...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isListError) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-xl font-bold text-red-500">Error Loading Pokémon</h2>
            <p>Sorry, we couldn't load the Pokémon data.</p>
            <p className="text-sm text-gray-600">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-pokemon-red via-pokemon-yellow to-pokemon-blue rounded-lg p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">PokéLookup</h1>
          <p className="text-white text-lg mb-4">Discover and explore information about your favorite Pokémon!</p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold">Pokémon Database</h2>
          
          {typeList && (
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              <Select value={selectedType} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {typeList.results
                    .filter(type => !["unknown", "shadow"].includes(type.name))
                    .map(type => (
                      <SelectItem key={type.name} value={type.name} className="capitalize">
                        {type.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {pokemonDetails.length === 0 ? (
          <div className="text-center py-8">
            <p>No Pokémon found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {pokemonDetails.map(pokemon => (
                <PokemonCard
                  key={pokemon.id}
                  id={pokemon.id}
                  name={pokemon.name}
                  image={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                  types={pokemon.types.map((t: any) => t.type.name)}
                />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination 
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
