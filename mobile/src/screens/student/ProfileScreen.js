import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Avatar, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { logout } from '../../redux/slices/authSlice';
import { spacing, theme } from '../../constants/theme';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  const getInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.[0].toUpperCase() || '?';
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <ScrollView style={styles.container}>
          <Animated.View style={[styles.header, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.avatarContainer}>
              <Avatar.Text
                size={100}
                label={getInitials()}
                style={styles.avatar}
                color="#FFFFFF"
              />
              <View style={styles.privacyBadge}>
                <Icon name="shield-check" size={16} color="#FFFFFF" />
              </View>
            </View>
            <Text style={styles.title}>{user?.name || 'Student'}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </Animated.View>

          {/* Anonymous ID Card */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Card style={styles.anonymousCard}>
              <Card.Content style={styles.anonymousContent}>
                <Icon name="incognito" size={40} color={theme.colors.primary} />
                <View style={styles.anonymousInfo}>
                  <Text style={styles.anonymousLabel}>Your Anonymous ID</Text>
                  <Text style={styles.anonymousId}>{user?.anonymousUsername || 'Loading...'}</Text>
                  <Text style={styles.anonymousSubtext}>
                    Only counsellors see this ID
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Info Cards */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Card style={styles.infoCard}>
              <Card.Title
                title="Personal Information"
                left={(props) => <Icon name="account-circle" {...props} size={24} />}
              />
              <Card.Content>
                <View style={styles.infoRow}>
                  <View style={styles.infoRowLeft}>
                    <Icon name="account" size={20} color={theme.colors.placeholder} />
                    <Text style={styles.label}>Name</Text>
                  </View>
                  <Text style={styles.value}>{user?.name || user?.email?.split('@')[0]}</Text>
                </View>
                {user?.year && (
                  <View style={styles.infoRow}>
                    <View style={styles.infoRowLeft}>
                      <Icon name="school" size={20} color={theme.colors.placeholder} />
                      <Text style={styles.label}>Year</Text>
                    </View>
                    <Text style={styles.value}>{user.year}</Text>
                  </View>
                )}
                {user?.department && (
                  <View style={styles.infoRow}>
                    <View style={styles.infoRowLeft}>
                      <Icon name="office-building" size={20} color={theme.colors.placeholder} />
                      <Text style={styles.label}>Department</Text>
                    </View>
                    <Text style={styles.value}>{user.department}</Text>
                  </View>
                )}
                <View style={styles.infoRow}>
                  <View style={styles.infoRowLeft}>
                    <Icon name="badge-account" size={20} color={theme.colors.placeholder} />
                    <Text style={styles.label}>Role</Text>
                  </View>
                  <Text style={[styles.value, { textTransform: 'capitalize' }]}>{user?.role}</Text>
                </View>
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Privacy Notice */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Card style={[styles.infoCard, styles.privacyCard]}>
              <Card.Content>
                <View style={styles.privacyNotice}>
                  <Icon name="shield-lock" size={48} color={theme.colors.success} />
                  <Text style={styles.privacyTitle}>Your Data is Safe</Text>
                  <Text style={styles.privacyDescription}>
                    All your activities, journals, and sessions are encrypted and anonymous.
                    We never share your personal information.
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </Animated.View>

          <Button
            mode="contained"
            onPress={handleLogout}
            style={styles.button}
            buttonColor={theme.colors.error}
            icon="logout"
            contentStyle={styles.logoutButtonContent}
          >
            Logout
          </Button>
        </ScrollView>
      </Animated.View>
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
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  privacyBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.success,
    borderRadius: 12,
    padding: 4,
    borderWidth: 3,
    borderColor: theme.colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
    color: theme.colors.text,
  },
  email: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  anonymousCard: {
    marginBottom: spacing.md,
    backgroundColor: theme.colors.primary + '10',
    borderWidth: 2,
    borderColor: theme.colors.primary + '30',
  },
  anonymousContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  anonymousInfo: {
    flex: 1,
  },
  anonymousLabel: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginBottom: 4,
  },
  anonymousId: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.primary,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  anonymousSubtext: {
    fontSize: 12,
    color: theme.colors.placeholder,
    fontStyle: 'italic',
  },
  infoCard: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
  privacyCard: {
    backgroundColor: theme.colors.success + '10',
    borderWidth: 2,
    borderColor: theme.colors.success + '30',
  },
  privacyNotice: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  privacyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  privacyDescription: {
    fontSize: 14,
    color: theme.colors.placeholder,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  logoutButtonContent: {
    paddingVertical: spacing.sm,
  },
});

export default ProfileScreen;
