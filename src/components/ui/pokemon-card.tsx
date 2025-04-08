
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface PokemonCardProps {
  id: number;
  name: string;
  image: string;
  types: string[];
}

export function PokemonCard({ id, name, image, types }: PokemonCardProps) {
  // Format the Pokemon name (capitalize first letter)
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

  // Format the ID to have leading zeros (e.g., #001)
  const formattedId = `#${id.toString().padStart(3, '0')}`;

  // Fallback image if the main image is not available
  const fallbackImage = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";

  // Handle image loading error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackImage;
  };

  return (
    <Link to={`/pokemon/${name}`} className="block">
      <Card className="poke-card h-full overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
        <div className="relative pt-6 px-6">
          <div className="text-xs text-gray-500 font-bold mb-1">{formattedId}</div>
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[160px]">
            <img 
              src={image || fallbackImage} 
              alt={name} 
              className="w-32 h-32 object-contain transform transition-transform duration-300 hover:scale-105"
              loading="lazy"
              onError={handleImageError}
            />
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-2">{formattedName}</h3>
          <div>
            {types.map(type => (
              <span 
                key={type} 
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-white mr-2 mb-2 type-${type.toLowerCase()}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
