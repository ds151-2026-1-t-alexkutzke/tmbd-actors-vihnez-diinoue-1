import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, Image} from 'react-native';
import { api } from '../../src/api/tmdb';

// Foto, nome e biografia

interface ActorDetails {
  id: number,
  profile_path: string,
  name: string,
  biography: string
}

export default function id () {
    const { id } = useLocalSearchParams();
    const [actor, setActor] = useState<ActorDetails | null>();


    useEffect(() => {
    const fetchActorDetails = async () => {
      try {
        const response = await api.get(`/person/${id}`);
        console.log(response.data);        
        setActor(response.data);
        setTimeout(() => { console.log(actor); }, 2000);
            

      } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
      } finally {
        //setIsLoading(false);

      }
    };

    fetchActorDetails();
  }, [id]); // O hook é re-executado caso o ID mude

  return (
    <ScrollView>   

      <View style={styles.content}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${actor?.profile_path}` }}
          style={styles.profile}
        />

    <View style={styles.actorContent}>
        <Text style={styles.nameText}>
          {actor?.name}
        </Text>

        <Text style={styles.bioText}>
          {actor?.biography}
        </Text>

    </View>
      
    </View>
    </ScrollView>
    
    
    
  )
}

const styles = StyleSheet.create({
    content: {flex: 1, backgroundColor: '#121212'},
    profile: {width: '100%', height: 400, borderRadius: 500},
    actorContent: {marginTop: 20, marginStart: 20},
    nameText: {color: '#ffffff', fontSize: 50, fontWeight: 'bold'},
    bioText: {marginTop: 30, marginHorizontal: 8, color: '#ffffff', fontSize: 24}

});