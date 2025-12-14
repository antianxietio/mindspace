import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchSessions } from '../../redux/slices/sessionSlice';
import { spacing, theme } from '../../constants/theme';

const ManagementDashboard = ({ navigation }) => {
  const dispatch = useDispatch();
  const { sessions = [] } = useSelector((state) => state.sessions || {});
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchSessions());
    setRefreshing(false);
  }, [dispatch]);

  useEffect(() => {
    onRefresh();
  }, []);

  const stats = [
    {
      label: 'Total Sessions',
      value: sessions?.length || 0,
      icon: 'calendar-check',
      color: '#2196F3',
    },
    {
      label: 'High Severity',
      value: sessions?.filter((s) => s.severity === 'high').length || 0,
      icon: 'alert-circle',
      color: '#F44336',
    },
    {
      label: 'This Month',
      value:
        sessions?.filter((s) => {
          const sessionDate = new Date(s.date);
          const now = new Date();
          return (
            sessionDate.getMonth() === now.getMonth() &&
            sessionDate.getFullYear() === now.getFullYear()
          );
        }).length || 0,
      icon: 'calendar-month',
      color: '#4CAF50',
    },
  ];

  const analytics = [
    {
      title: 'Department Analytics',
      subtitle: 'View session distribution by department',
      icon: 'office-building',
      screen: 'DepartmentAnalytics',
      color: '#2196F3',
    },
    {
      title: 'Year Analytics',
      subtitle: 'Analyze data by academic year',
      icon: 'school',
      screen: 'YearAnalytics',
      color: '#4CAF50',
    },
    {
      title: 'Severity Analysis',
      subtitle: 'Track severity trends',
      icon: 'chart-line',
      screen: 'SeverityAnalytics',
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
          <Text style={styles.title}>Analytics Dashboard</Text>
          <Text style={styles.subtitle}>Privacy-first insights</Text>
        </View>

        <View style={styles.stats}>
          {stats.map((stat, index) => (
            <Card key={index} style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <Icon name={stat.icon} size={32} color={stat.color} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Analytics Reports</Text>
        {analytics.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => navigation.navigate(item.screen)}>
            <Card style={styles.analyticsCard}>
              <Card.Content style={styles.analyticsContent}>
                <View style={[styles.iconCircle, { backgroundColor: item.color + '20' }]}>
                  <Icon name={item.icon} size={28} color={item.color} />
                </View>
                <View style={styles.analyticsText}>
                  <Text style={styles.analyticsTitle}>{item.title}</Text>
                  <Text style={styles.analyticsSubtitle}>{item.subtitle}</Text>
                </View>
                <Icon name="chevron-right" size={24} color={theme.colors.disabled} />
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginTop: spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  analyticsCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  analyticsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyticsText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  analyticsSubtitle: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginTop: 2,
  },
});

export default ManagementDashboard;
