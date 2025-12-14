import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Chip, Button, Avatar } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchMyAppointments } from '../../redux/slices/appointmentSlice';
import { fetchSessions } from '../../redux/slices/sessionSlice';
import { spacing, theme } from '../../constants/theme';

const CounsellorDashboard = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { appointments } = useSelector((state) => state.appointments);
  const { sessions } = useSelector((state) => state.sessions);
  const [refreshing, setRefreshing] = React.useState(false);

  const todayAppointments = appointments.filter(
    (apt) =>
      apt.status === 'scheduled' &&
      new Date(apt.appointmentDate).toDateString() === new Date().toDateString()
  );

  const weekSessions = sessions.filter((session) => {
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
  }, []);

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
      value: appointments.filter((a) => a.status === 'scheduled').length,
      icon: 'clock-outline',
      color: '#FF9800',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.name}>{user?.name || 'Counsellor'}</Text>
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
            onPress={() => navigation.navigate('QRScanner')}
          >
            <Icon name="qrcode-scan" size={40} color={theme.colors.primary} />
            <Text style={styles.actionText}>Scan QR</Text>
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
  },
  actionText: {
    marginTop: spacing.sm,
    fontSize: 14,
    fontWeight: '500',
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
