import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchSessions } from '../../redux/slices/sessionSlice';
import { spacing, theme } from '../../constants/theme';

const DepartmentAnalyticsScreen = () => {
  const dispatch = useDispatch();
  const { sessions = [] } = useSelector((state) => state.sessions || {});
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(fetchSessions());
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [dispatch]);

  // Group sessions by department
  const departmentData = (sessions || []).reduce((acc, session) => {
    const dept = session.student?.department || 'Unknown';
    if (!acc[dept]) {
      acc[dept] = { total: 0, high: 0, moderate: 0, low: 0 };
    }
    acc[dept].total++;
    if (session.severity === 'high') acc[dept].high++;
    else if (session.severity === 'moderate') acc[dept].moderate++;
    else if (session.severity === 'low') acc[dept].low++;
    return acc;
  }, {});

  const departments = Object.keys(departmentData).map((dept) => ({
    name: dept,
    ...departmentData[dept],
  }));

  const maxSessions = Math.max(...departments.map((d) => d.total), 1);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Icon name="office-building" size={40} color={theme.colors.primary} />
            <Text style={styles.title}>Department Analytics</Text>
            <Text style={styles.subtitle}>Session distribution by department</Text>
          </View>

          {departments.length === 0 ? (
            <Card style={styles.card}>
              <Card.Content style={styles.emptyState}>
                <Icon name="chart-bar" size={64} color={theme.colors.disabled} />
                <Text style={styles.emptyText}>No data available</Text>
              </Card.Content>
            </Card>
          ) : (
            departments.map((dept, index) => (
              <Card key={index} style={styles.card}>
                <Card.Content>
                  <View style={styles.deptHeader}>
                    <Text style={styles.deptName}>{dept.name}</Text>
                    <Text style={styles.deptTotal}>{dept.total} sessions</Text>
                  </View>

                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        { width: `${(dept.total / maxSessions) * 100}%` },
                      ]}
                    />
                  </View>

                  <View style={styles.severityBreakdown}>
                    <View style={styles.severityItem}>
                      <Icon name="circle" size={12} color="#F44336" />
                      <Text style={styles.severityText}>{dept.high} High</Text>
                    </View>
                    <View style={styles.severityItem}>
                      <Icon name="circle" size={12} color="#FF9800" />
                      <Text style={styles.severityText}>{dept.moderate} Moderate</Text>
                    </View>
                    <View style={styles.severityItem}>
                      <Icon name="circle" size={12} color="#4CAF50" />
                      <Text style={styles.severityText}>{dept.low} Low</Text>
                    </View>
                  </View>
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
    padding: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginTop: spacing.xs,
  },
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  deptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  deptName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deptTotal: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  barContainer: {
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    marginBottom: spacing.md,
  },
  bar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  severityBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  severityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityText: {
    marginLeft: spacing.xs,
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    marginTop: spacing.md,
    color: theme.colors.placeholder,
  },
});

export default DepartmentAnalyticsScreen;
