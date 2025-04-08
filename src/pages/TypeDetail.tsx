
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTypeDetail } from '@/hooks/use-pokemon';
import { PokemonService } from '@/services/pokemon-service';
import { Navbar } from '@/components/ui/navbar';
import { PokemonCard } from '@/components/ui/pokemon-card';
import { CustomPagination } from '@/components/ui/custom-pagination';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const TypeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: typeDetail, isLoading, isError } = useTypeDetail(id || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonPerPage] = useState(12);
  const [pokemonDetails, setPokemonDetails] = useState<any[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Load Pokemon details when type data is available
  React.useEffect(() => {
    if (typeDetail) {
      const loadPokemonDetails = async () => {
        setIsLoadingDetails(true);
        
        const start = (currentPage - 1) * pokemonPerPage;
        const end = start + pokemonPerPage;
        const pokemonSlice = typeDetail.pokemon.slice(start, end);
        
        try {
          const detailsPromises = pokemonSlice.map(item => 
            PokemonService.getPokemonDetail(item.pokemon.name)
          );
          const details = await Promise.all(detailsPromises);
          setPokemonDetails(details);
        } catch (error) {
          console.error('Error fetching Pokemon details:', error);
        } finally {
          setIsLoadingDetails(false);
        }
      };
      
      loadPokemonDetails();
    }
  }, [typeDetail, currentPage, pokemonPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading || isLoadingDetails) {
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

  if (isError || !typeDetail) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-xl font-bold text-red-500">Error Loading Type</h2>
            <p>Sorry, we couldn't load this Pokémon type.</p>
            <p className="text-sm text-gray-600">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(typeDetail.pokemon.length / pokemonPerPage);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/types" className="inline-flex items-center text-blue-600 hover:underline">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Types
          </Link>
        </div>
        
        <div className={`p-6 rounded-lg mb-8 type-${typeDetail.name}`}>
          <h1 className="text-3xl font-bold text-white text-center capitalize">
            {typeDetail.name} Type Pokémon
          </h1>
          <p className="text-white text-center mt-2">
            {typeDetail.pokemon.length} Pokémon found
          </p>
        </div>
        
        {pokemonDetails.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {pokemonDetails.map((pokemon) => (
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
                <CustomPagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500">No Pokémon found for this type.</p>
        )}
      </div>
    </div>
  );
};

export default TypeDetail;
