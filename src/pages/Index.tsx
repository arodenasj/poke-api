
import React, { useState, useEffect } from 'react';
import { usePokemonList, useTypeList } from '@/hooks/use-pokemon';
import { PokemonCard } from '@/components/ui/pokemon-card';
import { Navbar } from '@/components/ui/navbar';
import { CustomPagination } from '@/components/ui/custom-pagination';
import { PokemonService } from '@/services/pokemon-service';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Filter } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

const Index = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonDetails, setPokemonDetails] = useState<any[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [totalPokemon, setTotalPokemon] = useState(0);
  
  // Use total offset for fetching correct page of data
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  const { 
    data: pokemonList, 
    isLoading: isLoadingList,
    isError: isListError,
    error: listError
  } = usePokemonList(ITEMS_PER_PAGE, offset);

  const { data: typeList } = useTypeList();

  // Load Pokemon details
  useEffect(() => {
    const fetchPokemonByType = async () => {
      if (selectedType === 'all') {
        // For "all" types, we use the regular pagination
        if (pokemonList) {
          setIsLoadingDetails(true);
          
          try {
            const detailsPromises = pokemonList.results.map(pokemon => 
              PokemonService.getPokemonDetail(pokemon.name)
            );
            const details = await Promise.all(detailsPromises);
            setPokemonDetails(details);
            setTotalPokemon(pokemonList.count);
          } catch (error) {
            console.error('Error fetching Pokemon details:', error);
            toast({
              title: "Error",
              description: "Failed to load Pokémon details. Please try again.",
              variant: "destructive"
            });
          } finally {
            setIsLoadingDetails(false);
          }
        }
      } else {
        // For specific type, we need to get details from the type endpoint
        setIsLoadingDetails(true);
        
        try {
          const typeInfo = await PokemonService.getTypeDetail(selectedType);
          setTotalPokemon(typeInfo.pokemon.length);
          
          // Calculate which slice of Pokemon to show for the current page
          const start = (currentPage - 1) * ITEMS_PER_PAGE;
          const end = start + ITEMS_PER_PAGE;
          const pokemonSlice = typeInfo.pokemon.slice(start, end);
          
          const detailsPromises = pokemonSlice.map(item => 
            PokemonService.getPokemonDetail(item.pokemon.name)
          );
          const details = await Promise.all(detailsPromises);
          setPokemonDetails(details);
        } catch (error) {
          console.error('Error fetching type details:', error);
          toast({
            title: "Error",
            description: "Failed to load Pokémon of this type. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsLoadingDetails(false);
        }
      }
    };
    
    fetchPokemonByType();
  }, [pokemonList, currentPage, selectedType, toast]);

  // Handle pagination change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle type filter change
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setCurrentPage(1); // Reset to page 1 when changing type
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalPokemon / ITEMS_PER_PAGE);

  if (isLoadingList || isLoadingDetails) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin">
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
            <p className="text-gray-700">Sorry, we couldn't load the Pokémon data.</p>
            <p className="text-sm text-gray-600 mt-2">
              {listError instanceof Error ? listError.message : 'Please try again later.'}
            </p>
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
                  image={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
                  types={pokemon.types.map((t: any) => t.type.name)}
                />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <CustomPagination
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
