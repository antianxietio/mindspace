import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Animated, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Chip, Button, Avatar } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchMyAppointments } from '../../redux/slices/appointmentSlice';
import { fetchSessions } from '../../redux/slices/sessionSlice';
import { spacing, theme } from '../../constants/theme';

const CounsellorDashboard = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { appointments = [] } = useSelector((state) => state.appointments || {});
  const { sessions = [] } = useSelector((state) => state.sessions || {});
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const safeSessions = Array.isArray(sessions) ? sessions : [];
  const [refreshing, setRefreshing] = React.useState(false);
  const [checkedIn, setCheckedIn] = React.useState(false);
  const [checkInTime, setCheckInTime] = React.useState(null);
  const [dailyQuote, setDailyQuote] = React.useState('Your dedication makes a difference. Keep inspiring hope.');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const todayAppointments = safeAppointments.filter(
    (apt) =>
      apt.status === 'scheduled' &&
      new Date(apt.appointmentDate).toDateString() === new Date().toDateString()
  );

  const weekSessions = safeSessions.filter((session) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(session.date) >= weekAgo;
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([dispatch(fetchMyAppointments()), dispatch(fetchSessions())]);
    setRefreshing(false);
  }, [dispatch]);

  useEffect(() => {
    onRefresh();
    // Animate on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Fetch daily quote
    const fetchDailyQuote = async () => {
      try {
        const response = await fetch('https://zenquotes.io/api/today');
        const data = await response.json();
        if (data && data[0]) {
          setDailyQuote(data[0].q + ' - ' + data[0].a);
        }
      } catch (error) {
        // Use fallback quotes
        const fallbackQuotes = [
          'Your compassion changes lives. Keep making a difference. 💙',
          'Every conversation you have plants seeds of hope. 🌱',
          'You are a beacon of light in someone\'s darkest moment. ✨',
          'Your patience and understanding create safe spaces for healing. 🤗',
          'Thank you for being a guide through life\'s challenges. 🌟',
        ];
        const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        setDailyQuote(randomQuote);
      }
    };
    fetchDailyQuote();

    // Check if already checked in today
    const checkStoredCheckIn = async () => {
      try {
        const savedCheckIn = await AsyncStorage.getItem('checkInDate');
        const savedTime = await AsyncStorage.getItem('checkInTime');
        const today = new Date().toDateString();
        if (savedCheckIn === today && savedTime) {
          setCheckedIn(true);
          setCheckInTime(savedTime);
        }
      } catch (error) {
        console.log('Error loading check-in state:', error);
      }
    };
    checkStoredCheckIn();
  }, []);

  const handleCheckIn = async () => {
    const now = new Date();
    const today = now.toDateString();
    const time = now.toLocaleTimeString();

    try {
      await AsyncStorage.setItem('checkInDate', today);
      await AsyncStorage.setItem('checkInTime', time);

      setCheckedIn(true);
      setCheckInTime(time);

      Alert.alert('✅ Checked In', `You are now marked as available from ${time}`, [
        { text: 'OK' }
      ]);
    } catch (error) {
      console.log('Error saving check-in:', error);
      Alert.alert('Error', 'Failed to save check-in state');
    }
  };

  const stats = [
    { label: 'Today', value: todayAppointments.length, icon: 'calendar-today', color: '#2196F3' },
    {
      label: 'This Week',
      value: weekSessions.length,
      icon: 'calendar-week',
      color: '#4CAF50',
    },
    {
      label: 'Pending',
      value: safeAppointments.filter((a) => a.status === 'scheduled').length,
      icon: 'clock-outline',
      color: '#FF9800',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <ScrollView
          style={styles.container}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {/* Welcome Card */}
          <Card style={styles.welcomeCard}>
            <Card.Content>
              <View style={styles.welcomeHeader}>
                <View style={styles.welcomeTextContainer}>
                  <Text style={styles.welcomeEmoji}>😊</Text>
                  <View>
                    <Text style={styles.welcomeGreeting}>Welcome back,</Text>
                    <Text style={styles.welcomeName}>{user?.name || 'Counsellor'}!</Text>
                  </View>
                </View>
                <Chip
                  icon={user?.isActive ? 'circle' : 'circle-outline'}
                  mode="flat"
                  style={{
                    backgroundColor: user?.isActive ? '#FF980020' : '#4CAF5020',
                  }}
                  textStyle={{
                    color: user?.isActive ? '#FF9800' : '#4CAF50',
                  }}
                >
                  {user?.isActive ? 'In Session' : 'Available'}
                </Chip>
              </View>
              <Text style={styles.dailyQuote}>{dailyQuote}</Text>
            </Card.Content>
          </Card>

          {/* Check-In Card */}
          {!checkedIn ? (
            <Card style={[styles.card, styles.checkInCard]}>
              <Card.Content style={styles.checkInContent}>
                <Icon name="clock-check-outline" size={48} color={theme.colors.primary} />
                <Text style={styles.checkInTitle}>Daily Check-In Required</Text>
                <Text style={styles.checkInSubtitle}>
                  Mark yourself available for today's sessions
                </Text>
                <Button
                  mode="contained"
                  onPress={handleCheckIn}
                  icon="login"
                  style={styles.checkInButton}
                  contentStyle={styles.buttonContent}
                >
                  Check In Now
                </Button>
              </Card.Content>
            </Card>
          ) : (
            <Card style={[styles.card, styles.checkedInCard]}>
              <Card.Content style={styles.checkedInContent}>
                <Icon name="check-circle" size={32} color="#4CAF50" />
                <View style={styles.checkedInText}>
                  <Text style={styles.checkedInTitle}>✓ Checked In</Text>
                  <Text style={styles.checkedInTime}>Since {checkInTime}</Text>
                </View>
                <Button
                  mode="outlined"
                  onPress={async () => {
                    try {
                      await AsyncStorage.removeItem('checkInDate');
                      await AsyncStorage.removeItem('checkInTime');
                      setCheckedIn(false);
                      setCheckInTime('');
                      Alert.alert('✓ Checked Out', 'You have been marked as unavailable');
                    } catch (error) {
                      Alert.alert('Error', 'Failed to check out');
                    }
                  }}
                  icon="logout"
                  style={styles.checkOutButton}
                >
                  Check Out
                </Button>
              </Card.Content>
            </Card>
          )}

          {/* Stats */}
          <View style={styles.stats}>
            {stats.map((stat, index) => (
              <Card key={index} style={styles.statCard}>
                <Card.Content style={styles.statContent}>
                  <Icon name={stat.icon} size={24} color={stat.color} />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </Card.Content>
              </Card>
            ))}
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => {
                if (user?.isActive) {
                  // End Session - scan student QR to verify
                  navigation.navigate('QRScanner', { mode: 'checkout', sessionId: user?.currentSessionId });
                } else {
                  // Start Session - scan student QR
                  if (!checkedIn) {
                    Alert.alert('Daily Check-In Required', 'Please check in for the day before starting a session');
                    return;
                  }
                  navigation.navigate('QRScanner', { mode: 'checkin' });
                }
              }}
              disabled={!checkedIn && !user?.isActive}
            >
              <Icon
                name={user?.isActive ? "qrcode-remove" : "qrcode-scan"}
                size={40}
                color={user?.isActive ? '#FF5722' : (checkedIn ? theme.colors.primary : theme.colors.disabled)}
              />
              <Text style={[styles.actionText, (!checkedIn && !user?.isActive) && styles.actionTextDisabled]}>
                {user?.isActive ? 'End Session' : 'Start Session'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Appointments')}
            >
              <Icon name="calendar-clock" size={40} color={theme.colors.secondary} />
              <Text style={styles.actionText}>Appointments</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Availability')}
            >
              <Icon name="calendar-plus" size={40} color={theme.colors.success} />
              <Text style={styles.actionText}>Manage Slots</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('StudentHistory')}
            >
              <Icon name="history" size={40} color={theme.colors.info} />
              <Text style={styles.actionText}>History</Text>
            </TouchableOpacity>
          </View>

          {/* Today's Appointments */}
          <Text style={styles.sectionTitle}>Today's Appointments</Text>
          {todayAppointments.length === 0 ? (
            <Card style={styles.card}>
              <Card.Content style={styles.emptyCard}>
                <Icon name="calendar-blank" size={48} color={theme.colors.disabled} />
                <Text style={styles.emptyText}>No appointments scheduled for today</Text>
              </Card.Content>
            </Card>
          ) : (
            todayAppointments.map((apt) => (
              <Card key={apt._id} style={styles.card}>
                <Card.Content>
                  <View style={styles.aptHeader}>
                    <View style={styles.aptInfo}>
                      <Text style={styles.aptStudent}>
                        {apt.student?.anonymousUsername || 'Student'}
                      </Text>
                      <Text style={styles.aptTime}>{apt.time}</Text>
                    </View>
                    <Chip mode="outlined">{apt.type}</Chip>
                  </View>
                  <Text style={styles.aptReason} numberOfLines={2}>
                    {apt.reason}
                  </Text>
                </Card.Content>
              </Card>
            ))
          )}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  greeting: {
    fontSize: 16,
    color: theme.colors.placeholder,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    padding: spacing.md,
    paddingTop: 0,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  welcomeCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  welcomeTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  welcomeEmoji: {
    fontSize: 32,
  },
  welcomeGreeting: {
    fontSize: 14,
    color: theme.colors.placeholder,
    fontWeight: '500',
  },
  welcomeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 2,
  },
  dailyQuote: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#555',
    lineHeight: 22,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  actionCard: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    padding: spacing.md,
  },
  actionText: {
    marginTop: spacing.sm,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  actionTextDisabled: {
    color: theme.colors.disabled,
  },
  checkInCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: theme.colors.primaryContainer,
  },
  checkInContent: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  checkInTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  checkInSubtitle: {
    fontSize: 14,
    color: theme.colors.placeholder,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  checkInButton: {
    minWidth: 200,
  },
  checkOutButton: {
    marginLeft: 'auto',
  },
  buttonContent: {
    paddingVertical: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedInCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: '#4CAF5010',
  },
  checkedInContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  checkedInText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  checkedInTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  checkedInTime: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginTop: 2,
  },
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  emptyCard: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  emptyText: {
    marginTop: spacing.md,
    color: theme.colors.placeholder,
  },
  aptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  aptInfo: {
    flex: 1,
  },
  aptStudent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  aptTime: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 2,
  },
  aptReason: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginTop: spacing.xs,
  },
});

export default CounsellorDashboard;
