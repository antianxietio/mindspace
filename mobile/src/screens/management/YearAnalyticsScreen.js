import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchSessions } from '../../redux/slices/sessionSlice';
import { spacing, theme } from '../../constants/theme';

const YearAnalyticsScreen = () => {
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

  // Group sessions by year
  const yearData = (sessions || []).reduce((acc, session) => {
    const year = session.student?.year || 'Unknown';
    if (!acc[year]) {
      acc[year] = { total: 0, high: 0, moderate: 0, low: 0 };
    }
    acc[year].total++;
    if (session.severity === 'high') acc[year].high++;
    else if (session.severity === 'moderate') acc[year].moderate++;
    else if (session.severity === 'low') acc[year].low++;
    return acc;
  }, {});

  const years = Object.keys(yearData)
    .sort()
    .map((year) => ({
      name: year,
      ...yearData[year],
    }));

  const maxSessions = Math.max(...years.map((y) => y.total), 1);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Icon name="school" size={40} color={theme.colors.primary} />
            <Text style={styles.title}>Year-wise Analytics</Text>
            <Text style={styles.subtitle}>Session distribution by academic year</Text>
          </View>

          {years.length === 0 ? (
            <Card style={styles.card}>
              <Card.Content style={styles.emptyState}>
                <Icon name="chart-line" size={64} color={theme.colors.disabled} />
                <Text style={styles.emptyText}>No data available</Text>
              </Card.Content>
            </Card>
          ) : (
            years.map((year, index) => (
              <Card key={index} style={styles.card}>
                <Card.Content>
                  <View style={styles.yearHeader}>
                    <Text style={styles.yearName}>Year {year.name}</Text>
                    <Text style={styles.yearTotal}>{year.total} sessions</Text>
                  </View>

                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        { width: `${(year.total / maxSessions) * 100}%` },
                      ]}
                    />
                  </View>

                  <View style={styles.severityBreakdown}>
                    <View style={styles.severityItem}>
                      <View style={[styles.severityDot, { backgroundColor: '#F44336' }]} />
                      <Text style={styles.severityText}>High: {year.high}</Text>
                    </View>
                    <View style={styles.severityItem}>
                      <View style={[styles.severityDot, { backgroundColor: '#FF9800' }]} />
                      <Text style={styles.severityText}>Moderate: {year.moderate}</Text>
                    </View>
                    <View style={styles.severityItem}>
                      <View style={[styles.severityDot, { backgroundColor: '#4CAF50' }]} />
                      <Text style={styles.severityText}>Low: {year.low}</Text>
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
  yearHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  yearName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  yearTotal: {
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
    flexWrap: 'wrap',
  },
  severityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  severityText: {
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

export default YearAnalyticsScreen;
