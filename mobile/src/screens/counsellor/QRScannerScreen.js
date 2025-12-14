import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import { spacing, theme } from '../../constants/theme';
import sessionService from '../../services/sessionService';

const QRScannerScreen = ({ navigation }) => {
  const [studentCode, setStudentCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStartSession = async () => {
    if (!studentCode.trim()) {
      Alert.alert('Error', 'Please enter student code');
      return;
    }

    setLoading(true);
    try {
      const response = await sessionService.startSession({ qrData: studentCode });

      Alert.alert(
        'Session Started',
        `Session started with ${response.data.student.username}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('SessionDetails', {
              sessionId: response.data.session._id
            })
          }
        ]
      );
      setStudentCode('');
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to start session'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start Session</Text>
      <Text style={styles.subtitle}>
        Enter the student code shown on their QR screen
      </Text>

      <TextInput
        label="Student Code"
        value={studentCode}
        onChangeText={setStudentCode}
        mode="outlined"
        style={styles.input}
        autoCapitalize="characters"
        autoCorrect={false}
        placeholder="Enter student code"
      />

      <Button
        mode="contained"
        onPress={handleStartSession}
        loading={loading}
        disabled={loading || !studentCode.trim()}
        style={styles.button}
      >
        Start Session
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        style={styles.cancelButton}
      >
        Cancel
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: spacing.xl,
  },
  input: {
    marginBottom: spacing.lg,
  },
  button: {
    marginTop: spacing.md,
  },
  cancelButton: {
    marginTop: spacing.sm,
  },
});

export default QRScannerScreen;
