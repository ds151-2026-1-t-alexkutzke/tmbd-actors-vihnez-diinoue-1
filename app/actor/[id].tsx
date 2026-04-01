import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { api } from '../../src/api/tmdb';

// Foto, nome e biografia

export default function id () {
    const { id } = useLocalSearchParams();
    //const [actor, setActor] = useState<MovieDetails | null>(null);


    useEffect(() => {
    const fetchActorDetails = async () => {
      try {
        const response = await api.get(`/person/{id}`);
        console.log(`response.data: ${response.data}`);
        
        //setMovie(response.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
      } finally {
        //setIsLoading(false);
      }
    };

    fetchActorDetails();
  }, [id]); // O hook é re-executado caso o ID mude

    
}