
// PokeAPI service
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    back_default: string;
    front_shiny: string;
    back_shiny: string;
    other: {
      'official-artwork': {
        front_default: string;
      },
      'dream_world': {
        front_default: string;
      },
      'home': {
        front_default: string;
      }
    }
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  species: {
    name: string;
    url: string;
  };
}

export interface TypeListResponse {
  count: number;
  results: {
    name: string;
    url: string;
  }[];
}

export interface DamageRelations {
  double_damage_from: { name: string; url: string }[];
  double_damage_to: { name: string; url: string }[];
  half_damage_from: { name: string; url: string }[];
  half_damage_to: { name: string; url: string }[];
  no_damage_from: { name: string; url: string }[];
  no_damage_to: { name: string; url: string }[];
}

export interface TypeMove {
  name: string;
  url: string;
}

export interface TypeDetail {
  id: number;
  name: string;
  damage_relations: DamageRelations;
  pokemon: {
    pokemon: {
      name: string;
      url: string;
    };
    slot: number;
  }[];
  moves: {
    name: string;
    url: string;
  }[];
}

const BASE_URL = 'https://pokeapi.co/api/v2';

export const PokemonService = {
  // Get a list of Pokemon with pagination
  getPokemonList: async (limit = 20, offset = 0): Promise<PokemonListResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
      if (!response.ok) throw new Error('Failed to fetch Pokemon list');
      return await response.json();
    } catch (error) {
      console.error('Error fetching Pokemon list:', error);
      throw error;
    }
  },

  // Get details for a specific Pokemon by name or ID
  getPokemonDetail: async (nameOrId: string | number): Promise<PokemonDetail> => {
    try {
      const response = await fetch(`${BASE_URL}/pokemon/${nameOrId.toString().toLowerCase()}`);
      if (!response.ok) throw new Error(`Failed to fetch Pokemon ${nameOrId}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching Pokemon ${nameOrId}:`, error);
      throw error;
    }
  },

  // Get a list of all Pokemon types
  getTypes: async (): Promise<TypeListResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/type`);
      if (!response.ok) throw new Error('Failed to fetch types');
      return await response.json();
    } catch (error) {
      console.error('Error fetching types:', error);
      throw error;
    }
  },

  // Get details for a specific type
  getTypeDetail: async (typeNameOrId: string | number): Promise<TypeDetail> => {
    try {
      const response = await fetch(`${BASE_URL}/type/${typeNameOrId.toString().toLowerCase()}`);
      if (!response.ok) throw new Error(`Failed to fetch type ${typeNameOrId}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching type ${typeNameOrId}:`, error);
      throw error;
    }
  },

  // Get Pokemon by type
  getPokemonByType: async (type: string, limit = 100): Promise<PokemonListResponse> => {
    try {
      const typeDetail = await PokemonService.getTypeDetail(type);
      
      // Get the first 'limit' Pokemon of this type
      const pokemonOfType = typeDetail.pokemon.slice(0, limit).map(p => ({
        name: p.pokemon.name,
        url: p.pokemon.url
      }));
      
      return {
        count: typeDetail.pokemon.length,
        next: null,
        previous: null,
        results: pokemonOfType
      };
    } catch (error) {
      console.error('Error fetching Pokemon by type:', error);
      throw error;
    }
  },

  // Search Pokemon by name (partial match)
  searchPokemon: async (query: string, limit = 20): Promise<PokemonDetail[]> => {
    try {
      // First get a large list of Pokemon
      const listResponse = await PokemonService.getPokemonList(100, 0);
      
      // Filter by name containing the query
      const filteredResults = listResponse.results
        .filter(pokemon => pokemon.name.includes(query.toLowerCase()))
        .slice(0, limit);
      
      // Fetch details for each filtered Pokemon
      const detailPromises = filteredResults.map(pokemon => 
        PokemonService.getPokemonDetail(pokemon.name)
      );
      
      return await Promise.all(detailPromises);
    } catch (error) {
      console.error('Error searching Pokemon:', error);
      throw error;
    }
  }
};
