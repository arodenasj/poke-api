import React from 'react';
import { Link } from 'react-router-dom';
import { useTypeList } from '@/hooks/use-pokemon'; // Asegúrate de que la ruta sea correcta
import { Navbar } from '@/components/ui/navbar'; // Asegúrate de que la ruta sea correcta
import { Card, CardContent } from '@/components/ui/card'; // Asegúrate de que la ruta sea correcta
import { useToast } from '@/hooks/use-toast'; // Asegúrate de que la ruta sea correcta

export interface Type {
    name: string;
    url: string;
    id: number; // Added the id property to the interface
}

export interface TypeListResponse {
    count: number;
    results: Type[]; // Use the Type interface for the results array
}

// Componente para el ícono de tipo, ahora usando el ID
const TypeIcon = ({ typeId }: { typeId: number }) => {
    const typeImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/types/generation-ix/scarlet-violet/${typeId}.png`;

    const handleImageError = (e) => {
        // Si la imagen no se encuentra, muestra un ícono genérico
        e.currentTarget.src =
            'https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/items/poke-ball.png';
    };

    return (
        <div className="flex items-center justify-center h-30 w-30 mb-2">
            <img
                src={typeImageUrl}
                alt={`Type ID ${typeId}`}
                className="h-100 w-100 object-contain"
                onError={handleImageError}
            />
        </div>
    );
};

const TypeList = () => {
    const { toast } = useToast();
    const { data: typeList, isLoading, isError, error } = useTypeList();

    // Function to extract the type ID from the URL
    const getTypeIdFromUrl = (url: string): number | null => {
        const parts = url.split('/');
        const id = parseInt(parts[parts.length - 2], 10); // Extract and parse the ID
        return isNaN(id) ? null : id; // Return null if parsing fails
    };

    // Process the typeList data to add the 'id' to each type
    const mainTypes = typeList?.results
        .filter((type) => !['unknown', 'shadow'].includes(type.name))
        .map((type) => ({
            ...type,
            id: getTypeIdFromUrl(type.url) || 0, // Add the id to the type object
        })) || [];

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
                        <h2 className="text-xl font-bold text-red-500">
                            Error Loading Types
                        </h2>
                        <p className="text-gray-700">
                            Sorry, we couldn't load the Pokémon types.
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            {error instanceof Error ? error.message : 'Please try again later.'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Objeto que mapea cada tipo a un color de fondo específico para mejor visualización
    const typeColors = {
        normal: 'bg-gray-400',
        fire: 'bg-red-500',
        water: 'bg-blue-500',
        electric: 'bg-yellow-400',
        grass: 'bg-green-500',
        ice: 'bg-blue-200',
        fighting: 'bg-red-700',
        poison: 'bg-purple-500',
        ground: 'bg-yellow-700',
        flying: 'bg-indigo-300',
        psychic: 'bg-pink-500',
        bug: 'bg-lime-500',
        rock: 'bg-yellow-800',
        ghost: 'bg-purple-700',
        dragon: 'bg-indigo-700',
        dark: 'bg-gray-800',
        steel: 'bg-gray-500',
        fairy: 'bg-pink-300',
    };

    return (
        <div>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div
                    className="mb-8 p-6 rounded-lg"
                    style={{
                        backgroundColor: '#ff6347', // Un rojo más vivo y divertido
                        color: '#fff',
                        borderRadius: '1.5rem', // Más redondeado
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Un poco de sombra
                    }}
                >
                    <h1
                        className="text-3xl font-bold text-center"
                        style={{
                            fontSize: '2.5rem', // Un poco más grande
                            marginBottom: '0.5rem', // Menos espacio abajo
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)', // Sombra en el texto
                        }}
                    >
                        Tipos Pokémon
                    </h1>
                    <p
                        className="text-center mt-2"
                        style={{
                            fontSize: '1.2rem', // Texto un poco más grande
                            lineHeight: '1.6', // Más espacio entre líneas
                        }}
                    >
                        Elige un tipo para ver a quiénes les gana, qué Pokémon son de ese tipo y qué movimientos tienen
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {mainTypes.map((type) => (
                        <Link key={type.name} to={`/types/${type.name}`}>
                            <Card
                                className={`overflow-hidden hover:shadow-lg transition-shadow ${
                                    typeColors[type.name as keyof typeof typeColors] ||
                                    'bg-gray-400'
                                }`}
                            >
                                <div className="p-4 flex flex-col items-center justify-center text-center">
                                    <TypeIcon typeId={type.id} />
                                    <h2 className="text-white font-bold text-lg capitalize">
                                    </h2>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 p-4 bg-gray-100 rounded-lg" style={{ backgroundColor: '#f0f0f0', borderRadius: '1rem' }}>
                    <h2 className="text-xl font-bold mb-2" style={{ fontSize: '1.5rem', color: '#33a4ff' }}>¡Aprende sobre los Tipos Pokémon!</h2>
                    <p style={{ fontSize: '1.1rem', color: '#666' }}>
                        Los tipos Pokémon son como superpoderes. Cada Pokémon tiene un tipo, ¡y eso le dice qué tan fuerte es contra otros! Algunos tipos son como el agua, el fuego o la planta. ¡Es como piedra, papel o tijera, pero con más magia!
                    </p>
                    <p className="mt-2" style={{ fontSize: '1.1rem', color: '#666' }}>
                        ¡Haz clic en cualquier tipo de arriba para descubrir qué tan bien le pega a otros tipos, qué Pokémon son de ese tipo y qué movimientos geniales pueden hacer!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TypeList;
