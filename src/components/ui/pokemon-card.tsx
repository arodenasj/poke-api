
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

  return (
    <Link to={`/pokemon/${name}`} className="block">
      <Card className="poke-card h-full overflow-hidden">
        <div className="relative pt-6 px-6">
          <div className="text-xs text-gray-500 font-bold mb-1">{formattedId}</div>
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
            <img 
              src={image} 
              alt={name} 
              className="w-32 h-32 object-contain poke-card-hover"
              loading="lazy"
            />
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-2">{formattedName}</h3>
          <div>
            {types.map(type => (
              <span key={type} className={`type-badge type-${type.toLowerCase()}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
