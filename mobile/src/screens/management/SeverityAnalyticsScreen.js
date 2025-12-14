import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, ProgressBar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchSessions } from '../../redux/slices/sessionSlice';
import { spacing, theme } from '../../constants/theme';

const SeverityAnalyticsScreen = () => {
  const dispatch = useDispatch();
  const { sessions = [] } = useSelector((state) => state.sessions || {});
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    dispatch(fetchSessions());
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [dispatch]);

  const totalSessions = sessions?.length || 0;
  const highSeverity = sessions?.filter((s) => s.severity === 'high').length || 0;
  const moderateSeverity = sessions?.filter((s) => s.severity === 'moderate').length || 0;
  const lowSeverity = sessions?.filter((s) => s.severity === 'low').length || 0;

  const highPercentage = totalSessions > 0 ? (highSeverity / totalSessions) * 100 : 0;
  const moderatePercentage = totalSessions > 0 ? (moderateSeverity / totalSessions) * 100 : 0;
  const lowPercentage = totalSessions > 0 ? (lowSeverity / totalSessions) * 100 : 0;

  const severityData = [
    {
      label: 'High Severity',
      count: highSeverity,
      percentage: highPercentage,
      color: '#F44336',
      icon: 'alert-circle',
      description: 'Requires immediate attention',
    },
    {
      label: 'Moderate Severity',
      count: moderateSeverity,
      percentage: moderatePercentage,
      color: '#FF9800',
      icon: 'alert',
      description: 'Regular monitoring needed',
    },
    {
      label: 'Low Severity',
      count: lowSeverity,
      percentage: lowPercentage,
      color: '#4CAF50',
      icon: 'check-circle',
      description: 'General wellness support',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Icon name="chart-line" size={40} color={theme.colors.primary} />
            <Text style={styles.title}>Severity Analysis</Text>
            <Text style={styles.subtitle}>Distribution of session severity levels</Text>
          </View>

          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text style={styles.summaryTitle}>Total Sessions</Text>
              <Text style={styles.summaryValue}>{totalSessions}</Text>
            </Card.Content>
          </Card>

          {totalSessions === 0 ? (
            <Card style={styles.card}>
              <Card.Content style={styles.emptyState}>
                <Icon name="chart-arc" size={64} color={theme.colors.disabled} />
                <Text style={styles.emptyText}>No session data available</Text>
              </Card.Content>
            </Card>
          ) : (
            severityData.map((item, index) => (
              <Card key={index} style={styles.card}>
                <Card.Content>
                  <View style={styles.severityHeader}>
                    <View style={styles.severityTitleRow}>
                      <Icon name={item.icon} size={28} color={item.color} />
                      <View style={styles.severityTitleText}>
                        <Text style={styles.severityLabel}>{item.label}</Text>
                        <Text style={styles.severityDescription}>{item.description}</Text>
                      </View>
                    </View>
                    <View style={styles.severityStats}>
                      <Text style={[styles.severityCount, { color: item.color }]}>
                        {item.count}
                      </Text>
                      <Text style={styles.severityPercentage}>
                        {item.percentage.toFixed(1)}%
                      </Text>
                    </View>
                  </View>

                  <ProgressBar
                    progress={item.percentage / 100}
                    color={item.color}
                    style={styles.progressBar}
                  />
                </Card.Content>
              </Card>
            ))
          )}

          {totalSessions > 0 && (
            <Card style={styles.insightCard}>
              <Card.Content>
                <View style={styles.insightHeader}>
                  <Icon name="lightbulb-on" size={24} color="#FF9800" />
                  <Text style={styles.insightTitle}>Insight</Text>
                </View>
                <Text style={styles.insightText}>
                  {highPercentage > 30
                    ? '⚠️ High severity cases exceed 30%. Consider increasing counselor availability and resources.'
                    : highPercentage > 20
                      ? '⚡ Moderate to high severity cases detected. Ensure regular follow-ups.'
                      : '✅ Severity distribution is healthy. Continue current support practices.'}
                </Text>
              </Card.Content>
            </Card>
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
    textAlign: 'center',
  },
  summaryCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: theme.colors.primary,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  summaryValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: spacing.xs,
  },
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  severityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  severityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  severityTitleText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  severityLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  severityDescription: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginTop: 2,
  },
  severityStats: {
    alignItems: 'flex-end',
  },
  severityCount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  severityPercentage: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  insightCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
    backgroundColor: '#FFF8E1',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
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

export default SeverityAnalyticsScreen;
