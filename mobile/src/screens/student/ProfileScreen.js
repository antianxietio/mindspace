import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { spacing, theme } from '../../constants/theme';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <View style={styles.infoCard}>
          {user?.anonymousUsername && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Anonymous ID:</Text>
              <Text style={[styles.value, styles.anonymousId]}>{user.anonymousUsername}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{user?.name || user?.email?.split('@')[0]}</Text>
          </View>
          {user?.year && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Year:</Text>
              <Text style={styles.value}>{user.year}</Text>
            </View>
          )}
          {user?.department && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Department:</Text>
              <Text style={styles.value}>{user.department}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.label}>Role:</Text>
            <Text style={styles.value} style={{ textTransform: 'capitalize' }}>{user?.role}</Text>
          </View>
        </View>
        <Button mode="contained" onPress={handleLogout} style={styles.button} buttonColor={theme.colors.error}>
          Logout
        </Button>
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
    padding: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  label: {
    fontSize: 16,
    color: theme.colors.placeholder,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  anonymousId: {
    color: theme.colors.primary,
    fontFamily: 'monospace',
    fontSize: 18,
  },
  button: {
    marginTop: spacing.xl,
  },
});

export default ProfileScreen;
