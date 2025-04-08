
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTypeDetail } from '@/hooks/use-pokemon';
import { PokemonService } from '@/services/pokemon-service';
import { Navbar } from '@/components/ui/navbar';
import { PokemonCard } from '@/components/ui/pokemon-card';
import { CustomPagination } from '@/components/ui/custom-pagination';
import { ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TypeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { data: typeDetail, isLoading, isError, error } = useTypeDetail(id || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [movesPage, setMovesPage] = useState(1);
  const [pokemonPerPage] = useState(12);
  const [movesPerPage] = useState(20);
  const [pokemonDetails, setPokemonDetails] = useState<any[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Load Pokemon details when type data is available
  useEffect(() => {
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
          toast({
            title: "Error",
            description: "Failed to load Pokémon details. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsLoadingDetails(false);
        }
      };
      
      loadPokemonDetails();
    }
  }, [typeDetail, currentPage, pokemonPerPage, toast]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMovesPageChange = (page: number) => {
    setMovesPage(page);
  };

  if (isLoading || isLoadingDetails) {
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

  if (isError || !typeDetail) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-xl font-bold text-red-500">Error Loading Type</h2>
            <p className="text-gray-700">Sorry, we couldn't load this Pokémon type.</p>
            <p className="text-sm text-gray-600 mt-2">
              {error instanceof Error ? error.message : 'Please try again later.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(typeDetail.pokemon.length / pokemonPerPage);
  const totalMovesPages = Math.ceil((typeDetail.moves?.length || 0) / movesPerPage);

  // Create a reusable component for type badges
  const TypeBadge = ({ name }: { name: string }) => (
    <Badge 
      key={name} 
      className={`mr-1 mb-1 capitalize type-${name.toLowerCase()}`}
    >
      {name}
    </Badge>
  );

  // Get the moves for the current page
  const currentMoves = typeDetail.moves 
    ? typeDetail.moves.slice((movesPage - 1) * movesPerPage, movesPage * movesPerPage) 
    : [];

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
        
        <div className={`p-6 rounded-lg mb-8 bg-${typeDetail.name}`}>
          <h1 className="text-3xl font-bold text-white text-center capitalize">
            {typeDetail.name} Type
          </h1>
        </div>

        <Tabs defaultValue="damage" className="w-full mb-8">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="damage">Damage Relations</TabsTrigger>
            <TabsTrigger value="pokemon">Pokémon ({typeDetail.pokemon.length})</TabsTrigger>
            <TabsTrigger value="moves">Moves ({typeDetail.moves?.length || 0})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="damage" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Offensive relationships */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-500">Super Effective Against</CardTitle>
                </CardHeader>
                <CardContent>
                  {typeDetail.damage_relations.double_damage_to.length > 0 ? (
                    <div className="flex flex-wrap">
                      {typeDetail.damage_relations.double_damage_to.map(type => (
                        <TypeBadge key={type.name} name={type.name} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No types</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-500">Not Very Effective Against</CardTitle>
                </CardHeader>
                <CardContent>
                  {typeDetail.damage_relations.half_damage_to.length > 0 ? (
                    <div className="flex flex-wrap">
                      {typeDetail.damage_relations.half_damage_to.map(type => (
                        <TypeBadge key={type.name} name={type.name} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No types</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-500">No Effect Against</CardTitle>
                </CardHeader>
                <CardContent>
                  {typeDetail.damage_relations.no_damage_to.length > 0 ? (
                    <div className="flex flex-wrap">
                      {typeDetail.damage_relations.no_damage_to.map(type => (
                        <TypeBadge key={type.name} name={type.name} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No types</p>
                  )}
                </CardContent>
              </Card>

              {/* Defensive relationships */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-500">Weak To</CardTitle>
                </CardHeader>
                <CardContent>
                  {typeDetail.damage_relations.double_damage_from.length > 0 ? (
                    <div className="flex flex-wrap">
                      {typeDetail.damage_relations.double_damage_from.map(type => (
                        <TypeBadge key={type.name} name={type.name} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No types</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-500">Resistant To</CardTitle>
                </CardHeader>
                <CardContent>
                  {typeDetail.damage_relations.half_damage_from.length > 0 ? (
                    <div className="flex flex-wrap">
                      {typeDetail.damage_relations.half_damage_from.map(type => (
                        <TypeBadge key={type.name} name={type.name} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No types</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-500">Immune To</CardTitle>
                </CardHeader>
                <CardContent>
                  {typeDetail.damage_relations.no_damage_from.length > 0 ? (
                    <div className="flex flex-wrap">
                      {typeDetail.damage_relations.no_damage_from.map(type => (
                        <TypeBadge key={type.name} name={type.name} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No types</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="pokemon" className="mt-6">
            {pokemonDetails.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {pokemonDetails.map((pokemon) => (
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
            ) : (
              <p className="text-center text-gray-500">No Pokémon found for this type.</p>
            )}
          </TabsContent>
          
          <TabsContent value="moves" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Moves</CardTitle>
              </CardHeader>
              <CardContent>
                {typeDetail.moves && typeDetail.moves.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {currentMoves.map((move) => (
                        <div key={move.name} className="p-2 border rounded capitalize bg-gray-50">
                          {move.name.replace('-', ' ')}
                        </div>
                      ))}
                    </div>
                    
                    {totalMovesPages > 1 && (
                      <div className="mt-4 flex justify-center">
                        <CustomPagination
                          totalPages={totalMovesPages}
                          currentPage={movesPage}
                          onPageChange={handleMovesPageChange}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-center text-gray-500">No moves found for this type.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TypeDetail;
