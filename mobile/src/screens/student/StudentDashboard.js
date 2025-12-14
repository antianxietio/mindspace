import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Button, Avatar, Chip } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchMyAppointments } from '../../redux/slices/appointmentSlice';
import { fetchMoods } from '../../redux/slices/moodSlice';
import { spacing, theme } from '../../constants/theme';
import { MOOD_EMOJIS } from '../../constants';

const StudentDashboard = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { appointments = [] } = useSelector((state) => state.appointments || {});
  const { moods = [] } = useSelector((state) => state.moods || {});
  const [refreshing, setRefreshing] = React.useState(false);
  const [wellnessTip, setWellnessTip] = React.useState('Taking care of your mental health is just as important as your physical health.');

  // Game-like animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const action1Scale = useRef(new Animated.Value(0)).current;
  const action2Scale = useRef(new Animated.Value(0)).current;
  const action3Scale = useRef(new Animated.Value(0)).current;
  const action4Scale = useRef(new Animated.Value(0)).current;
  const cardBounce = useRef(new Animated.Value(0)).current;

  const upcomingAppointments = (appointments || []).filter(
    (apt) => apt.status === 'scheduled' && new Date(apt.appointmentDate) > new Date()
  ).slice(0, 2);

  const todayMood = (moods || []).find(
    (m) => new Date(m.date).toDateString() === new Date().toDateString()
  );

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchMyAppointments()),
      dispatch(fetchMoods()),
    ]);
    setRefreshing(false);
  }, [dispatch]);

  useEffect(() => {
    onRefresh();

    // Fetch wellness tip
    const fetchWellnessTip = async () => {
      try {
        const response = await fetch('https://type.fit/api/quotes');
        const quotes = await response.json();
        const mentalHealthQuotes = [
          'Your mental health is a priority. Your happiness is essential. Your self-care is a necessity. 💚',
          'It\'s okay to not be okay. Reaching out for help is a sign of strength. 💪',
          'Small steps every day lead to big changes. Be patient with yourself. 🌱',
          'You are not alone. Many students face similar challenges. 🤝',
          'Take a deep breath. This moment will pass. You are stronger than you think. 🧘',
          'Remember to celebrate small victories. Progress, not perfection. ⭐',
          'Your feelings are valid. It\'s okay to take time for yourself. 💙',
          'Stress is temporary, but your wellbeing is forever. Take care of yourself. 🌸',
        ];
        const randomTip = mentalHealthQuotes[Math.floor(Math.random() * mentalHealthQuotes.length)];
        setWellnessTip(randomTip);
      } catch (error) {
        // Fallback tip already set in state
      }
    };
    fetchWellnessTip();

    // Sequential game-like animations
    Animated.sequence([
      // Header fade and slide
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Quick action cards bounce in one by one
      Animated.stagger(100, [
        Animated.spring(action1Scale, {
          toValue: 1,
          tension: 80,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(action2Scale, {
          toValue: 1,
          tension: 80,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(action3Scale, {
          toValue: 1,
          tension: 80,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(action4Scale, {
          toValue: 1,
          tension: 80,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
      // Cards bounce
      Animated.spring(cardBounce, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.header}>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.username}>{user?.anonymousUsername || user?.name || 'Student'}</Text>
            <View style={styles.privacyBadge}>
              <Icon name="shield-check" size={14} color="#FFFFFF" />
              <Text style={styles.privacyText}>Anonymous Mode</Text>
            </View>
            <Text style={styles.subtitle}>How are you feeling today?</Text>
          </View>

          {/* Quick Actions with game-like animations */}
          <View style={styles.quickActions}>
            <Animated.View style={[styles.actionCardWrapper, { transform: [{ scale: action1Scale }] }]}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: theme.colors.primary + '15' }]}
                onPress={() => navigation.navigate('CounsellorList')}
              >
                <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary }]}>
                  <Icon name="calendar-plus" size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.actionText}>Book Session</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.actionCardWrapper, { transform: [{ scale: action2Scale }] }]}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: theme.colors.secondary + '15' }]}
                onPress={() => navigation.navigate('Journal', { screen: 'JournalEditor' })}
              >
                <View style={[styles.iconCircle, { backgroundColor: theme.colors.secondary }]}>
                  <Icon name="book-edit" size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.actionText}>Write Journal</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.actionCardWrapper, { transform: [{ scale: action3Scale }] }]}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: theme.colors.success + '15' }]}
                onPress={() => navigation.navigate('Mood')}
              >
                <View style={[styles.iconCircle, { backgroundColor: theme.colors.success }]}>
                  <Icon name="emoticon-happy" size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.actionText}>Log Mood</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.actionCardWrapper, { transform: [{ scale: action4Scale }] }]}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: theme.colors.info + '15' }]}
                onPress={() => navigation.navigate('QRCode')}
              >
                <View style={[styles.iconCircle, { backgroundColor: theme.colors.info }]}>
                  <Icon name="qrcode" size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.actionText}>My QR Code</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Today's Mood */}
          <Card style={[styles.card, styles.todayMoodCard]}>
            <Card.Title
              title="Today's Mood"
              titleStyle={styles.todayMoodTitle}
              left={(props) => <Icon name="emoticon" {...props} size={28} color={theme.colors.primary} />}
            />
            <Card.Content>
              {todayMood ? (
                <View style={styles.moodDisplay}>
                  <View style={styles.moodEmojiCircle}>
                    <Text style={styles.moodEmoji}>{MOOD_EMOJIS[todayMood.mood] || '😐'}</Text>
                  </View>
                  <View style={styles.moodInfo}>
                    <Text style={styles.moodText}>Logged today at {new Date(todayMood.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    <Text style={styles.moodNote}>{todayMood.note ? `"${todayMood.note}"` : 'No note added'}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.noMoodContainer}>
                  <Text style={styles.noMoodText}>You haven't logged your mood today</Text>
                  <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Mood')}
                    icon="plus"
                    style={styles.logMoodButton}
                  >
                    Log Your Mood Now
                  </Button>
                </View>
              )}
            </Card.Content>
          </Card>

          {/* Upcoming Appointments */}
          <Animated.View style={{ transform: [{ scale: cardBounce }] }}>
            <Card style={styles.card}>
              <Card.Title
                title="Upcoming Appointments"
                left={(props) => <Icon name="calendar-clock" {...props} size={24} />}
                right={(props) => (
                  <Button onPress={() => navigation.navigate('Appointments')}>
                    View All
                  </Button>
                )}
              />
              <Card.Content>
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <View key={appointment._id} style={styles.appointmentItem}>
                      <View style={styles.appointmentInfo}>
                        <Text style={styles.appointmentDate}>
                          {new Date(appointment.appointmentDate).toLocaleDateString()}
                        </Text>
                        <Text style={styles.appointmentTime}>
                          {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </View>
                      <Chip mode="outlined">
                        {appointment.counsellor?.name || 'Counsellor'}
                      </Chip>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No upcoming appointments</Text>
                    <Button
                      mode="contained"
                      onPress={() => navigation.navigate('CounsellorList')}
                      style={styles.emptyButton}
                    >
                      Book Now
                    </Button>
                  </View>
                )}
              </Card.Content>
            </Card>
          </Animated.View>

          {/* Wellness Tip */}
          <Animated.View style={{ transform: [{ scale: cardBounce }] }}>
            <Card style={styles.card}>
              <Card.Content>
                <View style={styles.tipHeader}>
                  <Icon name="lightbulb" size={20} color={theme.colors.warning} />
                  <Text style={styles.tipTitle}>Daily Wellness Tip</Text>
                </View>
                <Text style={styles.tipText}>
                  {wellnessTip}
                </Text>
              </Card.Content>
            </Card>
          </Animated.View>
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
    padding: spacing.lg,
    backgroundColor: theme.colors.primary,
    paddingTop: spacing.xl,
  },
  greeting: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  privacyText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  actionCardWrapper: {
    width: '48%',
    marginBottom: spacing.md,
  },
  actionCard: {
    width: '100%',
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionText: {
    marginTop: spacing.sm,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    color: theme.colors.text,
    flexWrap: 'nowrap',
  },
  card: {
    margin: spacing.md,
    marginTop: 0,
  },
  todayMoodCard: {
    backgroundColor: theme.colors.primary + '10',
    borderWidth: 2,
    borderColor: theme.colors.primary + '30',
  },
  todayMoodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  moodDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  moodEmojiCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  moodEmoji: {
    fontSize: 48,
  },
  moodInfo: {
    flex: 1,
  },
  moodText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  moodNote: {
    fontSize: 14,
    color: theme.colors.placeholder,
    fontStyle: 'italic',
  },
  noMoodContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  noMoodText: {
    fontSize: 16,
    color: theme.colors.placeholder,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  logMoodButton: {
    marginTop: spacing.sm,
  },
  appointmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: '600',
  },
  appointmentTime: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.placeholder,
    marginBottom: spacing.md,
  },
  emptyButton: {
    marginTop: spacing.sm,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text,
  },
});

export default StudentDashboard;
