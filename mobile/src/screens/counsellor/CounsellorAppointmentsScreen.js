import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Chip, Divider, ActivityIndicator, FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchMyAppointments } from '../../redux/slices/appointmentSlice';
import { spacing, theme } from '../../constants/theme';

const CounsellorAppointmentsScreen = ({ navigation }) => {
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
            <Text style={styles.studentName}>
              {item.student?.anonymousUsername || 'Anonymous Student'}
            </Text>
            <Text style={styles.type}>{item.type} session</Text>
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
          <Icon name="text" size={16} color={theme.colors.placeholder} />
          <Text style={styles.detailText} numberOfLines={2}>
            {item.reason}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <FlatList
          data={appointments || []}
          renderItem={renderAppointment}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="calendar-blank" size={64} color={theme.colors.disabled} />
              <Text style={styles.emptyText}>No appointments</Text>
            </View>
          }
        />
        <FAB
          style={styles.fab}
          icon="qrcode-scan"
          label="Scan QR"
          onPress={() => navigation.navigate('QRScanner')}
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
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  type: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 2,
    textTransform: 'capitalize',
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
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: spacing.xl * 2,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.disabled,
    marginTop: spacing.md,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default CounsellorAppointmentsScreen;
