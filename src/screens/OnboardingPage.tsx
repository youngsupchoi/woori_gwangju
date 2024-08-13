import React from 'react';
import {View, Image, TouchableOpacity, Text, StyleSheet} from 'react-native';

const OnboardingPage = () => {
  return (
    <View style={styles.container}>
      {/* 제목 */}
      <Text style={styles.title}>어떤 도움이 필요하신가요?</Text>
      <Text style={styles.subtitle}>맞춤형 도움을 제공해드릴게요.</Text>

      {/* 이미지 */}
      <Image
        source={require('../assets/gif/disabled_people.gif')}
        style={styles.image}
        resizeMode="contain"
      />

      {/* 버튼들 */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>🦽 휠체어로 이동해야 해요.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>👨‍🦯 시각 장애가 있어요.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>🦻 청각 장애가 있어요.</Text>
      </TouchableOpacity>

      {/* 아래 버튼 */}
      <TouchableOpacity style={styles.bottomButton}>
        <Text style={styles.bottomButtonText}>일단 먼저 둘러볼게요</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6B7280', // gray-500
    textAlign: 'center',
    marginBottom: 32,
  },
  image: {
    width: '100%',
    // backgroundColor: 'blue',
    height: 240, // approximately equivalent to 48 in tailwind
    marginBottom: 32,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 9999, // rounded-full equivalent
    borderColor: '#D1D5DB', // gray-300
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center', // Corrected type
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'left',
    flex: 1,
  },
  bottomButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 16,
    backgroundColor: '#F3F4F6', // gray-100
    borderRadius: 9999, // rounded-full equivalent
  },
  bottomButtonText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4B5563', // gray-700
  },
});

export default OnboardingPage;
