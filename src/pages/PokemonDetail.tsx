
import React from 'react';
import { useParams } from 'react-router-dom';
import { usePokemonDetail } from '@/hooks/use-pokemon';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/ui/navbar';
import { cn } from '@/lib/utils';

const PokemonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: pokemon, isLoading, isError, error } = usePokemonDetail(id || '');

  if (isLoading) {
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
            <p className="mt-4 text-lg">Loading Pokémon data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-xl font-bold text-red-500">Error Loading Pokémon</h2>
            <p>Sorry, we couldn't find that Pokémon.</p>
            <p className="text-sm text-gray-600">Make sure the name or ID is correct and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return null;
  }

  // Format the Pokemon ID to have leading zeros (e.g., #001)
  const formattedId = `#${pokemon.id.toString().padStart(3, '0')}`;
  
  // Format the Pokemon name (capitalize first letter)
  const formattedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  
  // Format height and weight (convert to meters and kg)
  const heightInMeters = pokemon.height / 10;
  const weightInKg = pokemon.weight / 10;

  // Get official artwork if available, otherwise use front sprite
  const mainImage = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

  // Function to render a sprite with a label if it exists
  const renderSprite = (sprite: string | null | undefined, label: string) => {
    if (!sprite) return null;
    return (
      <div className="flex flex-col items-center">
        <div className="bg-gray-100 rounded-lg p-4">
          <img 
            src={sprite} 
            alt={`${formattedName} ${label}`} 
            className="w-24 h-24 mx-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <p className="mt-2 text-sm text-center">{label}</p>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-full md:w-1/3">
              <Card className="overflow-hidden">
                <div className={`p-8 bg-pokemon-${pokemon.types[0].type.name}`}>
                  <img 
                    src={mainImage}
                    alt={pokemon.name}
                    className="w-full h-auto object-contain animate-float mx-auto"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="text-sm text-gray-500 font-bold mb-1">{formattedId}</div>
                  <h1 className="text-3xl font-bold mb-4">{formattedName}</h1>
                  
                  <div className="mb-4">
                    {pokemon.types.map((typeInfo) => (
                      <span 
                        key={typeInfo.type.name} 
                        className={`type-badge type-${typeInfo.type.name}`}
                      >
                        {typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1)}
                      </span>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="border rounded-md p-3">
                      <p className="text-sm text-gray-500">Height</p>
                      <p className="font-bold">{heightInMeters.toFixed(1)} m</p>
                    </div>
                    <div className="border rounded-md p-3">
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-bold">{weightInKg.toFixed(1)} kg</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="w-full md:w-2/3">
              <Tabs defaultValue="stats" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                  <TabsTrigger value="abilities">Abilities</TabsTrigger>
                  <TabsTrigger value="sprites">Sprites</TabsTrigger>
                </TabsList>
                
                <TabsContent value="stats" className="pt-4">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-4">Base Stats</h2>
                      <div className="space-y-4">
                        {pokemon.stats.map((stat) => {
                          // Get a more readable stat name
                          let statName = stat.stat.name;
                          switch (statName) {
                            case 'hp': statName = 'HP'; break;
                            case 'attack': statName = 'Attack'; break;
                            case 'defense': statName = 'Defense'; break;
                            case 'special-attack': statName = 'Sp. Atk'; break;
                            case 'special-defense': statName = 'Sp. Def'; break;
                            case 'speed': statName = 'Speed'; break;
                            default: statName = statName.charAt(0).toUpperCase() + statName.slice(1);
                          }
                          
                          // Calculate color based on stat value
                          let statColor;
                          if (stat.base_stat < 50) statColor = 'bg-red-500';
                          else if (stat.base_stat < 70) statColor = 'bg-yellow-500';
                          else if (stat.base_stat < 90) statColor = 'bg-green-500';
                          else statColor = 'bg-blue-500';
                          
                          return (
                            <div key={stat.stat.name} className="grid grid-cols-12 gap-2 items-center">
                              <div className="col-span-2 font-medium text-sm">{statName}</div>
                              <div className="col-span-2 text-right pr-2">{stat.base_stat}</div>
                              <div className="col-span-8">
                                <Progress 
                                  value={(stat.base_stat / 255) * 100} 
                                  className={cn("h-2", statColor)}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="abilities" className="pt-4">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-4">Abilities</h2>
                      <ul className="space-y-4">
                        {pokemon.abilities.map((ability) => (
                          <li key={ability.ability.name} className="border-b pb-2 last:border-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium capitalize">
                                {ability.ability.name.replace('-', ' ')}
                              </span>
                              {ability.is_hidden && (
                                <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                  Hidden
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="sprites" className="pt-4">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-bold mb-4">Official Artwork</h2>
                      <div className="flex justify-center mb-6">
                        <div className="bg-gray-100 rounded-lg p-4 max-w-xs">
                          <img 
                            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                            alt={`${formattedName} Official Artwork`}
                            className="w-full h-auto object-contain"
                            onError={(e) => {
                              e.currentTarget.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
                            }}
                          />
                        </div>
                      </div>

                      <h2 className="text-xl font-bold mb-4">Showdown GIF (Animated)</h2>
                      <div className="flex justify-center mb-6">
                        <div className="bg-gray-100 rounded-lg p-4">
                          <img 
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemon.id}.gif`}
                            alt={`${formattedName} Animated`}
                            className="h-24 mx-auto object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', 
                                '<p class="text-sm text-gray-500">Animation not available</p>');
                            }}
                          />
                        </div>
                      </div>

                      <h2 className="text-xl font-bold mb-4 mt-8">Dream World (SVG)</h2>
                      <div className="flex justify-center mb-6">
                        <div className="bg-gray-100 rounded-lg p-4">
                          <img 
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}
                            alt={`${formattedName} Dream World`}
                            className="h-24 mx-auto object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', 
                                '<p class="text-sm text-gray-500">SVG not available</p>');
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                        <div>
                          <h3 className="font-bold mb-2 text-center">Gold (Transparent PNG)</h3>
                          <div className="bg-gray-100 rounded-lg p-4 flex justify-center">
                            <img 
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/transparent/${pokemon.id}.png`}
                              alt={`${formattedName} Gold Version`}
                              className="h-16 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', 
                                  '<p class="text-sm text-gray-500">Sprite not available</p>');
                              }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-bold mb-2 text-center">Generation VI XY</h3>
                          <div className="bg-gray-100 rounded-lg p-4 flex justify-center">
                            <img 
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/x-y/${pokemon.id}.png`}
                              alt={`${formattedName} XY Version`}
                              className="h-16 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', 
                                  '<p class="text-sm text-gray-500">Sprite not available</p>');
                              }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-bold mb-2 text-center">Gen I Yellow</h3>
                          <div className="bg-gray-100 rounded-lg p-4 flex justify-center">
                            <img 
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/transparent/${pokemon.id}.png`}
                              alt={`${formattedName} Yellow Version`}
                              className="h-16 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.insertAdjacentHTML('beforeend', 
                                  '<p class="text-sm text-gray-500">Sprite not available</p>');
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <h2 className="text-xl font-bold mb-4 mt-8">Default Sprites</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        {renderSprite(pokemon.sprites.front_default, "Front Default")}
                        {renderSprite(pokemon.sprites.back_default, "Back Default")}
                        {renderSprite(pokemon.sprites.front_shiny, "Front Shiny")}
                        {renderSprite(pokemon.sprites.back_shiny, "Back Shiny")}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
