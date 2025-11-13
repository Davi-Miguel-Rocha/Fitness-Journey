import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Alert
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MenuScreen({ navigation }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [daysInApp, setDaysInApp] = useState(0);

  useEffect(() => {
    if (user?.id) {
      // Aguardar um pouco antes de carregar para garantir que o perfil foi salvo
      const timer = setTimeout(() => {
        loadProfile();
        loadProfileImage();
        loadDaysInApp();
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  // Recarregar perfil quando a tela for focada
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (user?.id) {
        // Aguardar um pouco antes de recarregar para garantir que o perfil foi salvo
        setTimeout(() => {
          loadProfile();
          loadDaysInApp();
        }, 500);
      }
    });

    return unsubscribe;
  }, [navigation, user?.id]);

  const loadProfile = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, age')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        // Se houver erro, manter null mas não bloquear a tela
        setProfile(null);
      } else if (data) {
        // Se houver dados, definir o perfil
        setProfile(data);
      } else {
        // Se não houver dados, o perfil ainda não foi criado
        setProfile(null);
      }
    } catch (error) {
      // Em caso de erro, manter null
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem(`profileImage_${user?.id}`);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (error) {
      // Erro ao carregar foto - ignorar
    }
  };

  const loadDaysInApp = async () => {
    try {
      if (!user?.id) {
        setDaysInApp(0);
        return;
      }

      const firstLoginDate = await AsyncStorage.getItem(`firstLoginDate_${user.id}`);
      
      if (firstLoginDate) {
        // Calcular diferença em dias
        const firstDate = new Date(firstLoginDate);
        const today = new Date();
        
        // Zerar horas para calcular apenas dias
        firstDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        
        const diffTime = today - firstDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // Garantir que seja pelo menos 0 (primeiro dia)
        setDaysInApp(Math.max(0, diffDays));
      } else {
        // Se não houver data salva, salvar a data atual como primeiro login
        const today = new Date().toISOString();
        await AsyncStorage.setItem(`firstLoginDate_${user.id}`, today);
        setDaysInApp(0); // Primeiro dia
      }
    } catch (error) {
      // Erro ao carregar dias - ignorar
      setDaysInApp(0);
    }
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Selecionar Foto',
      'Escolha uma opção',
      [
        {
          text: 'Galeria',
          onPress: () => pickImageFromGallery(),
        },
        {
          text: 'Câmera',
          onPress: () => takePhoto(),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const pickImageFromGallery = async () => {
    try {
      // Solicitar permissão para acessar a galeria
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão Negada', 'Precisamos de permissão para acessar suas fotos.');
        return;
      }

      // Abrir seletor de imagem
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);
        // Salvar no AsyncStorage
        await AsyncStorage.setItem(`profileImage_${user?.id}`, imageUri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const takePhoto = async () => {
    try {
      // Solicitar permissão para usar a câmera
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão Negada', 'Precisamos de permissão para usar a câmera.');
        return;
      }

      // Abrir câmera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setProfileImage(imageUri);
        // Salvar no AsyncStorage
        await AsyncStorage.setItem(`profileImage_${user?.id}`, imageUri);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  // Verificar se o perfil foi carregado mas está vazio
  const hasProfileData = profile && (profile.first_name || profile.last_name || profile.age);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <Image 
          source={require('../assets/logo.png')} 
          style={styles.logo}
          contentFit="contain"
          cachePolicy="memory-disk"
          priority="high"
          transition={200}
        />
        
        {/* Foto do Perfil */}
        <View style={styles.profileImageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImageText}>
                {profile?.first_name?.[0]?.toUpperCase() || '?'}
              </Text>
            </View>
          )}
          <TouchableOpacity 
            style={styles.addPhotoButton}
            onPress={handleImagePicker}
          >
            <Text style={styles.addPhotoText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Informações do Usuário */}
        <View style={styles.infoSection}>
          {/* Nome - exibir se houver perfil com nome */}
          {profile && profile.first_name && (
            <View style={styles.infoCard}>
              <Text style={styles.label}>Nome</Text>
              <Text style={styles.value}>
                {profile.first_name} {profile.last_name || ''}
              </Text>
            </View>
          )}

          {/* Idade - exibir se houver perfil com idade */}
          {profile && profile.age && (
            <View style={styles.infoCard}>
              <Text style={styles.label}>Idade</Text>
              <Text style={styles.value}>{profile.age} anos</Text>
            </View>
          )}

          {/* Dias no App - sempre exibir */}
          <View style={styles.infoCard}>
            <Text style={styles.label}>Dias no App</Text>
            <Text style={styles.value}>
              {daysInApp} {daysInApp === 1 ? 'dia' : 'dias'}
            </Text>
          </View>
        </View>

        {/* Botão Começar Jornada */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('SetGoal')}
        >
          <Text style={styles.startButtonText}>Começar Jornada!</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 550,
    height: 330,
    marginTop: 10,
    marginBottom: 20,
  },
  profileImageContainer: {
    marginTop: 20,
    marginBottom: 30,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  profileImageText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  addPhotoText: {
    fontSize: 24,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  infoSection: {
    width: '100%',
    marginBottom: 30,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  value: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  startButton: {
    width: '100%',
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

