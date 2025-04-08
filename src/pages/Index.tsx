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
              title: "¡Error!",
              description: "No se pudieron cargar los detalles de los Pokémon. Por favor, inténtalo de nuevo.",
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
            title: "¡Error!",
            description: "No se pudieron cargar los Pokémon de este tipo. Por favor, inténtalo de nuevo.",
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
                    alt="Cargando"
                    className="w-16 h-16"
                />
              </div>
              <p className="mt-4 text-lg">Cargando Pokémon...</p>
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
              <h2 className="text-xl font-bold text-red-500">¡Error al cargar los Pokémon!</h2>
              <p className="text-gray-700">¡Ups! No pudimos traer la información de los Pokémon.</p>
              <p className="text-sm text-gray-600 mt-2">
                {listError instanceof Error ? listError.message : 'Por favor, inténtalo de nuevo más tarde.'}
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
          {/* Improved Header Styling */}
          <div
              className="rounded-lg p-8 mb-8 text-center"
              style={{
                background: 'linear-gradient(to right, #ff6347, #ffc107, #29abe2)',
                color: '#fff',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                borderRadius: '2rem',
              }}
          >
            <h1
                className="font-bold mb-2"
                style={{
                  fontSize: '2rem',
                  textShadow: '3px 3px 6px rgba(0, 0, 0, 0.5)',
                }}
            >
              ¡Bienvenidos a la PokeApi!
            </h1>
            <p
                className="text-lg mb-4"
                style={{
                  fontSize: '1rem',
                  lineHeight: '1.7',
                }}
            >
              ¡Aquí encontrarás toda la info sobre tus Pokémon favoritos! ¡Prepárate para una aventura épica!
            </p>
          </div>

          {/* Improved Sub-Header Styling */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2
                className="font-bold"
                style={{
                  fontSize: '2.2rem',
                  color: '#33a4ff',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                }}
            >
              ¡La Base de Datos Pokémon Más Completa del Mundo!
            </h2>

            {typeList && (
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <Select value={selectedType} onValueChange={handleTypeChange}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los tipos</SelectItem>
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
                <p>No se encontraron Pokémon que coincidan con tus criterios.</p>
              </div>
          ) : (
              <>
                {/* Improved Pokemon Grid Styling */}
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem',
                      justifyContent: 'center',
                      alignItems: 'start',
                      marginTop: '1rem',
                    }}
                >
                  {pokemonDetails.map(pokemon => (
                      <PokemonCard
                          key={pokemon.id}
                          id={pokemon.id}
                          name={pokemon.name}
                          image={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
                          types={pokemon.types.map((t: any) => t.type.name)}
                          style={{ // Pass style prop
                            backgroundColor: '#f8f8f8',
                            borderRadius: '1rem',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden',
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'scale(1.05)',
                            },
                          }}
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
