
import { useQuery } from '@tanstack/react-query';
import { PokemonService, PokemonDetail, PokemonListResponse, TypeDetail } from '../services/pokemon-service';

export function usePokemonList(limit = 20, offset = 0) {
  return useQuery<PokemonListResponse>({
    queryKey: ['pokemonList', limit, offset],
    queryFn: () => PokemonService.getPokemonList(limit, offset),
  });
}

export function usePokemonDetail(nameOrId: string | number) {
  return useQuery<PokemonDetail>({
    queryKey: ['pokemon', nameOrId],
    queryFn: () => PokemonService.getPokemonDetail(nameOrId),
    enabled: !!nameOrId,
  });
}

export function useTypeList() {
  return useQuery({
    queryKey: ['typeList'],
    queryFn: () => PokemonService.getTypes(),
  });
}

export function useTypeDetail(typeNameOrId: string | number) {
  return useQuery<TypeDetail>({
    queryKey: ['type', typeNameOrId],
    queryFn: () => PokemonService.getTypeDetail(typeNameOrId),
    enabled: !!typeNameOrId,
  });
}

export function usePokemonSearch(query: string) {
  return useQuery({
    queryKey: ['pokemonSearch', query],
    queryFn: () => PokemonService.searchPokemon(query),
    enabled: query.length > 1,
  });
}

// New hook to get filtered Pokemon list by type
export function useFilteredPokemonList(type: string, limit = 20) {
  return useQuery({
    queryKey: ['filteredPokemonList', type, limit],
    queryFn: async () => {
      if (type === 'all') {
        return PokemonService.getPokemonList(limit, 0);
      } else {
        return PokemonService.getPokemonByType(type, limit);
      }
    },
    enabled: !!type,
  });
}
