import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { spacing, theme } from '../../constants/theme';

const QRCodeScreen = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Session QR Code</Text>
        <Text style={styles.subtitle}>
          Show this QR code to your counsellor at the start and end of each session
        </Text>

        <View style={styles.qrContainer}>
          {user?.anonymousUsername && (
            <QRCode
              value={JSON.stringify({
                studentId: user._id,
                username: user.anonymousUsername,
                secret: user.qrSecret || 'MOCK-SECRET',
                timestamp: Date.now(),
              })}
              size={250}
            />
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.usernameCard}>
            <Icon name="shield-account" size={24} color={theme.colors.primary} />
            <Text style={styles.username}>{user?.anonymousUsername || 'Loading...'}</Text>
          </View>
          <Text style={styles.infoText}>
            🔒 This QR code contains your anonymous ID only.
          </Text>
          <Text style={styles.infoText}>
            Your counsellor will see only this username - your real identity remains private.
          </Text>
          <View style={styles.instructionsBox}>
            <Text style={styles.instructionsTitle}>How to use:</Text>
            <Text style={styles.instructionItem}>• Counsellor scans at session start</Text>
            <Text style={styles.instructionItem}>• System marks you present</Text>
            <Text style={styles.instructionItem}>• Counsellor scans again at session end</Text>
          </View>
        </View>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.placeholder,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  qrContainer: {
    backgroundColor: theme.colors.surface,
    padding: spacing.xl,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  infoContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  usernameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
    elevation: 2,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginLeft: spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  instructionsBox: {
    backgroundColor: theme.colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.md,
    width: '100%',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  instructionItem: {
    fontSize: 14,
    marginVertical: spacing.xs,
    color: theme.colors.text,
  },
});

export default QRCodeScreen;
