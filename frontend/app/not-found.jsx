import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

export default function NotFoundScreen() {
  return (
    <>
      {/* This sets the header title if you have a header visible */}
      <Stack.Screen options={{ title: 'Oops!', headerShown: false }} />
      
      <View style={styles.container}>
        <Ionicons name="alert-circle-outline" size={80} color="#635BFF" />
        
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>This page doesn't exist or has been moved.</Text>

        <Link href="/" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Go to Home Screen</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: "#0C1013", // Your Dashboard Navy
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#fff',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#C8CACD', // Your Dashboard Gray
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 40,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#635BFF', // Your Dashboard Purple
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 16,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});