import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Chip, Divider, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchSessions } from '../../redux/slices/sessionSlice';
import { spacing, theme } from '../../constants/theme';

const SessionHistoryScreen = () => {
  const dispatch = useDispatch();
  const { sessions = [], isLoading } = useSelector((state) => state.sessions || {});
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    dispatch(fetchSessions());
  }, [dispatch]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchSessions());
    setRefreshing(false);
  }, [dispatch]);

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return '#F44336';
      case 'moderate':
        return '#FF9800';
      case 'low':
        return '#4CAF50';
      default:
        return theme.colors.disabled;
    }
  };

  const renderSession = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Icon name="account-tie" size={40} color={theme.colors.primary} />
            <View style={styles.counsellorInfo}>
              <Text style={styles.counsellorName}>{item.counsellor?.name || 'Counsellor'}</Text>
              <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
          </View>
          {item.severity && (
            <Chip
              mode="flat"
              style={{ backgroundColor: getSeverityColor(item.severity) + '20' }}
              textStyle={{ color: getSeverityColor(item.severity) }}
            >
              {item.severity}
            </Chip>
          )}
        </View>

        <Divider style={styles.divider} />

        <View style={styles.detailsRow}>
          <Icon name="clock-outline" size={16} color={theme.colors.placeholder} />
          <Text style={styles.detailText}>{item.duration} minutes</Text>
        </View>

        {item.notes && (
          <View style={styles.notesContainer}>
            <Icon name="note-text" size={16} color={theme.colors.placeholder} />
            <Text style={styles.notes} numberOfLines={3}>{item.notes}</Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  if (isLoading && (!sessions || sessions.length === 0)) {
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
          data={sessions || []}
          renderItem={renderSession}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="history" size={64} color={theme.colors.disabled} />
              <Text style={styles.emptyText}>No session history</Text>
              <Text style={styles.emptySubtext}>
                Your counselling session history will appear here
              </Text>
            </View>
          }
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
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  counsellorInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  counsellorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: theme.colors.placeholder,
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
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.sm,
    backgroundColor: theme.colors.surface,
    padding: spacing.sm,
    borderRadius: 8,
  },
  notes: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: spacing.xl * 2,
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.disabled,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});

export default SessionHistoryScreen;
