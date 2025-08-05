import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from '../../assets/img/logo-1.png';

const Home = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 100 }]}>
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


}); 