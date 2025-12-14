import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Chip, Button, FAB, ActivityIndicator, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchMyAppointments, cancelAppointment } from '../../redux/slices/appointmentSlice';
import { spacing, theme } from '../../constants/theme';

const AppointmentsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { appointments = [], isLoading } = useSelector((state) => state.appointments || {});
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    dispatch(fetchMyAppointments());
  }, [dispatch]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchMyAppointments());
    setRefreshing(false);
  }, [dispatch]);

  const handleCancelAppointment = (appointmentId) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(cancelAppointment(appointmentId)).unwrap();
              // Refresh the appointments list immediately
              await dispatch(fetchMyAppointments()).unwrap();
              Alert.alert('Success', 'Appointment cancelled successfully');
            } catch (error) {
              Alert.alert('Error', error || 'Failed to cancel appointment');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return theme.colors.primary;
      case 'completed':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.disabled;
    }
  };

  const renderAppointment = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.counsellorName}>{item.counsellor?.name}</Text>
            <Text style={styles.specialization}>{item.counsellor?.specialization}</Text>
          </View>
          <Chip
            mode="flat"
            style={{ backgroundColor: getStatusColor(item.status) + '20' }}
            textStyle={{ color: getStatusColor(item.status) }}
          >
            {item.status}
          </Chip>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.detailsRow}>
          <Icon name="calendar" size={16} color={theme.colors.placeholder} />
          <Text style={styles.detailText}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Icon name="clock-outline" size={16} color={theme.colors.placeholder} />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Icon name="account-group" size={16} color={theme.colors.placeholder} />
          <Text style={styles.detailText}>{item.type}</Text>
        </View>
        {item.reason && (
          <View style={styles.detailsRow}>
            <Icon name="text" size={16} color={theme.colors.placeholder} />
            <Text style={styles.detailText}>{item.reason}</Text>
          </View>
        )}
      </Card.Content>
      {item.status === 'scheduled' && (
        <Card.Actions>
          <Button onPress={() => handleCancelAppointment(item._id)} textColor={theme.colors.error}>
            Cancel
          </Button>
        </Card.Actions>
      )}
    </Card>
  );

  if (isLoading && appointments.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <FlatList
          data={appointments}
          renderItem={renderAppointment}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="calendar-blank" size={64} color={theme.colors.disabled} />
              <Text style={styles.emptyText}>No appointments yet</Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Home', { screen: 'CounsellorList' })}
                style={styles.emptyButton}
              >
                Book Appointment
              </Button>
            </View>
          }
        />
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate('Home', { screen: 'CounsellorList' })}
        />
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  headerInfo: {
    flex: 1,
  },
  counsellorName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  specialization: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 2,
  },
  divider: {
    marginVertical: spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailText: {
    marginLeft: spacing.sm,
    fontSize: 14,
    color: theme.colors.text,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: spacing.xl * 2,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.disabled,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  emptyButton: {
    marginTop: spacing.sm,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default AppointmentsScreen;
