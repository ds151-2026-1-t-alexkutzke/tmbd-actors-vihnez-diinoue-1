import { Link, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, FlatList, Pressable } from 'react-native';
import { api } from '../../src/api/tmdb';

interface MovieDetails {
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  runtime: number;
}

interface crewMemberDetails {
  id:number;
  name: string;
  profile_path: string;
}

export default function MovieDetailsScreen() {
  // Captura o parâmetro '[id]' do nome do arquivo
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [crewMembers, setCrewMembers] = useState<crewMemberDetails[]>([]); 
  
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await api.get(`/movie/${id}`);
        const responseActor = await api.get(`/movie/${id}/credits`)
        console.log(responseActor.data.cast);
        setCrewMembers(responseActor.data.cast);
        setMovie(response.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]); // O hook é re-executado caso o ID mude

  const renderActor = ({ item }: { item: crewMemberDetails }) => (
      // Link do Expo Router passando o ID do filme como parâmetro dinâmico
      <Link href={`/actor/${item.id}`} asChild>
        <Pressable>
          {item.profile_path ? (
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.profile_path}` }}
              style={styles.poster}
            />
          ) : (
            <View>
              <Text>Sem Imagem</Text>
            </View>
          )}
          <View>
            <Text>{item.name}</Text>
          </View>
        </Pressable>
      </Link>
    );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Filme não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {movie.poster_path && (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
          style={styles.poster}
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>

        <View style={styles.statsContainer}>
          <Text style={styles.statText}>⭐ {movie.vote_average.toFixed(1)}/10</Text>
          <Text style={styles.statText}>⏱️ {movie.runtime} min</Text>
        </View>

        <Text style={styles.sectionTitle}>Sinopse</Text>
        <Text style={styles.overview}>
          {movie.overview || 'Sinopse não disponível para este filme.'}
        </Text>
      </View>
      <FlatList
        data={crewMembers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderActor}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  poster: { width: '100%', height: 400 },
  content: { padding: 20 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  statsContainer: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  statText: { color: '#E50914', fontSize: 16, fontWeight: '600' },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  overview: { color: '#D1D5DB', fontSize: 16, lineHeight: 24 },
  errorText: { color: '#FFFFFF', fontSize: 18 },
});
