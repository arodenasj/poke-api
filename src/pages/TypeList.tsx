
import React from 'react';
import { Link } from 'react-router-dom';
import { useTypeList } from '@/hooks/use-pokemon';
import { Navbar } from '@/components/ui/navbar';
import { Card, CardContent } from '@/components/ui/card';

const TypeList = () => {
  const { data: typeList, isLoading, isError } = useTypeList();

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
            <p>Sorry, we couldn't load the Pokémon types.</p>
            <p className="text-sm text-gray-600">Please try again later.</p>
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
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`p-6 type-${type.name} h-full flex items-center justify-center`}>
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
