
import React from 'react';
import { Link } from 'react-router-dom';
import { useTypeList } from '@/hooks/use-pokemon';
import { Navbar } from '@/components/ui/navbar';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Objeto que mapea cada tipo a un color de fondo específico para mejor visualización
const typeColors = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-blue-200",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-700",
  flying: "bg-indigo-300",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-yellow-800",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

// Componente para el ícono de tipo
const TypeIcon = ({ type }: { type: string }) => {
  // Determinamos la URL de la imagen según el tipo
  return (
    <div className="flex items-center justify-center h-16 w-16 mb-2">
      <img 
        src={`/images/types/${type}.png`}
        alt={`${type} type`}
        className="h-12 w-12 object-contain"
        onError={(e) => {
          // Si la imagen no se encuentra, mostramos un ícono genérico
          e.currentTarget.src = 'https://raw.githubusercontent.com/msikma/pokesprite/master/misc/types/gen8/unknown.png';
        }}
      />
    </div>
  );
};

const TypeList = () => {
  const { toast } = useToast();
  const { data: typeList, isLoading, isError, error } = useTypeList();

  if (isLoading) {
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
            <p className="mt-4 text-lg">Loading types...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !typeList) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-xl font-bold text-red-500">Error Loading Types</h2>
            <p className="text-gray-700">Sorry, we couldn't load the Pokémon types.</p>
            <p className="text-sm text-gray-600 mt-2">
              {error instanceof Error ? error.message : 'Please try again later.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filter out types that are not used in main games (like "unknown" and "shadow")
  const mainTypes = typeList.results.filter(
    type => !["unknown", "shadow"].includes(type.name)
  );

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Pokémon Types</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mainTypes.map((type) => (
            <Link key={type.name} to={`/types/${type.name}`}>
              <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${typeColors[type.name as keyof typeof typeColors] || "bg-gray-400"}`}>
                <div className="p-4 flex flex-col items-center justify-center text-center">
                  <TypeIcon type={type.name} />
                  <h2 className="text-white font-bold text-lg capitalize">
                    {type.name}
                  </h2>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypeList;
