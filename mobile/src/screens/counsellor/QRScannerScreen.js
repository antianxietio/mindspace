import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, TextInput, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <Icon name="qrcode-scan" size={80} color={theme.colors.primary} />
            <Text style={styles.title}>Start Session</Text>
            <Text style={styles.subtitle}>
              Enter the student's anonymous ID shown on their QR screen
            </Text>
          </Card.Content>
        </Card>

        <TextInput
          label="Student Anonymous ID"
          value={studentCode}
          onChangeText={setStudentCode}
          mode="outlined"
          style={styles.input}
          autoCapitalize="characters"
          autoCorrect={false}
          placeholder="e.g., S-A12F9"
          left={<TextInput.Icon icon="shield-account" />}
        />

        <Button
          mode="contained"
          onPress={handleStartSession}
          loading={loading}
          disabled={loading || !studentCode.trim()}
          style={styles.button}
          icon="play"
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

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoTitle}>📱 How to use:</Text>
            <Text style={styles.infoText}>1. Ask student to show their QR code screen</Text>
            <Text style={styles.infoText}>
              2. Enter their anonymous ID (e.g., S-A12F9)
            </Text>
            <Text style={styles.infoText}>3. Click "Start Session" to begin</Text>
            <Text style={styles.infoText}>
              4. After session, you'll add notes and severity
            </Text>
          </Card.Content>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  card: {
    marginBottom: spacing.xl,
  },
  cardContent: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  input: {
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.sm,
  },
  cancelButton: {
    marginTop: spacing.sm,
  },
  infoCard: {
    marginTop: spacing.xl,
    backgroundColor: theme.colors.surface,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
});

export default QRScannerScreen;
