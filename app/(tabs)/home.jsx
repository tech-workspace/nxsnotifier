import { Image, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Logo from '../../assets/img/logo-1.png';

const Home = () => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.img} />

      <Text style={styles.title}>The Number 1</Text>

      <Text style={{ marginTop: 10, marginBottom: 30, color: '#fff' }}>
        Reading List App
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardText}>Hello, this is a Card</Text>
        <Text style={styles.welcomeText}>
          Welcome back, {user?.name || user?.email || 'User'}!
        </Text>
        {user?.email && (
          <Text style={{ fontSize: 12, color: '#fff', marginTop: 5 }}>
            Logged in as: {user.email}
          </Text>
        )}
      </View>
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
    marginVertical: 20,
    width: 100,
    height: 100,
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
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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