import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
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
  const { appointments } = useSelector((state) => state.appointments);
  const { moods } = useSelector((state) => state.moods);
  const [refreshing, setRefreshing] = React.useState(false);

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'scheduled' && new Date(apt.appointmentDate) > new Date()
  ).slice(0, 2);

  const todayMood = moods.find(
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
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
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

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('CounsellorList')}
          >
            <Icon name="calendar-plus" size={32} color={theme.colors.primary} />
            <Text style={styles.actionText}>Book Session</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Journal', { screen: 'JournalEditor' })}
          >
            <Icon name="book-edit" size={32} color={theme.colors.secondary} />
            <Text style={styles.actionText}>Write Journal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Mood')}
          >
            <Icon name="emoticon-happy" size={32} color={theme.colors.success} />
            <Text style={styles.actionText}>Log Mood</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('QRCode')}
          >
            <Icon name="qrcode" size={32} color={theme.colors.info} />
            <Text style={styles.actionText}>My QR Code</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Mood */}
        <Card style={styles.card}>
          <Card.Title
            title="Today's Mood"
            left={(props) => <Icon name="emoticon" {...props} size={24} />}
          />
          <Card.Content>
            {todayMood ? (
              <View style={styles.moodDisplay}>
                <Text style={styles.moodEmoji}>{MOOD_EMOJIS[todayMood.moodLevel]}</Text>
                <Text style={styles.moodText}>Logged today</Text>
              </View>
            ) : (
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Mood')}
                icon="plus"
              >
                Log Your Mood
              </Button>
            )}
          </Card.Content>
        </Card>

        {/* Upcoming Appointments */}
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

        {/* Wellness Tip */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.tipHeader}>
              <Icon name="lightbulb" size={20} color={theme.colors.warning} />
              <Text style={styles.tipTitle}>Wellness Tip</Text>
            </View>
            <Text style={styles.tipText}>
              Taking care of your mental health is just as important as your physical health.
              Remember to take breaks and practice self-care.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
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
  actionCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionText: {
    marginTop: spacing.sm,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  card: {
    margin: spacing.md,
    marginTop: 0,
  },
  moodDisplay: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  moodEmoji: {
    fontSize: 48,
  },
  moodText: {
    fontSize: 16,
    color: theme.colors.placeholder,
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
