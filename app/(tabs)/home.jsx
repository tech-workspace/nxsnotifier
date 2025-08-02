import { Image, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Logo from '../../assets/img/logo-1.png';

const Home = () => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.img} />

      <Text style={styles.title}>Nexus Plater</Text>

      <Text style={{ marginTop: 10, marginBottom: 30, color: '#fff' }}>

      </Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    marginVertical: 0,
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FFD700',
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 5,
    boxShadow: '0px 2px 3.84px rgba(255, 215, 0, 0.25)',
    elevation: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  cardText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#fff',
  },
  welcomeText: {
    fontSize: 14,
    color: '#FFD700',
  },
}); 