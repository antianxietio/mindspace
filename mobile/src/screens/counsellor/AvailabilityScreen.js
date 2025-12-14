import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Animated, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Button, Chip, Switch } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { spacing, theme } from '../../constants/theme';

const AvailabilityScreen = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Fixed time slots: 9 AM - 4 PM, 1-hour each, excluding 12-1 PM lunch
  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    // 12:00 - 13:00 is lunch break
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
  ];

  // State to track enabled slots per day
  const [availability, setAvailability] = useState({
    Monday: {},
    Tuesday: {},
    Wednesday: {},
    Thursday: {},
    Friday: {},
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleSlot = (day, slot) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: !prev[day][slot]
      }
    }));
  };

  const getEnabledSlotsForDay = (day) => {
    return Object.keys(availability[day] || {}).filter(slot => availability[day][slot]);
  };

  const handleSaveAvailability = () => {
    // Count total enabled slots
    let totalSlots = 0;
    Object.keys(availability).forEach(day => {
      totalSlots += getEnabledSlotsForDay(day).length;
    });

    Alert.alert(
      'Success',
      `Your availability has been saved!\n${totalSlots} slots enabled across the week.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView style={styles.container}>
          <Card style={styles.infoCard}>
            <Card.Content>
              <View style={styles.infoHeader}>
                <Icon name="information" size={24} color={theme.colors.primary} />
                <Text style={styles.infoTitle}>Slot Timings</Text>
              </View>
              <Text style={styles.infoText}>• 1-hour slots from 9 AM to 4 PM</Text>
              <Text style={styles.infoText}>• Lunch break: 12 PM - 1 PM</Text>
              <Text style={styles.infoText}>• Toggle slots on/off for each day</Text>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>Select Day</Text>
              <View style={styles.daysContainer}>
                {days.map((day) => (
                  <Chip
                    key={day}
                    selected={selectedDay === day}
                    onPress={() => setSelectedDay(day)}
                    style={styles.dayChip}
                    mode={selectedDay === day ? 'flat' : 'outlined'}
                  >
                    {day}
                  </Chip>
                ))}
              </View>

              <Text style={styles.label}>Available Time Slots</Text>
              {timeSlots.map((slot) => (
                <Card key={slot} style={styles.slotCard}>
                  <Card.Content style={styles.slotContent}>
                    <View style={styles.slotInfo}>
                      <Icon
                        name="clock-outline"
                        size={20}
                        color={availability[selectedDay]?.[slot] ? theme.colors.primary : theme.colors.disabled}
                      />
                      <Text style={[
                        styles.slotTime,
                        availability[selectedDay]?.[slot] && styles.slotTimeActive
                      ]}>
                        {slot}
                      </Text>
                    </View>
                    <Switch
                      value={availability[selectedDay]?.[slot] || false}
                      onValueChange={() => toggleSlot(selectedDay, slot)}
                      color={theme.colors.primary}
                    />
                  </Card.Content>
                </Card>
              ))}

              <Card style={styles.lunchCard}>
                <Card.Content style={styles.lunchContent}>
                  <Icon name="food" size={24} color="#FF9800" />
                  <View style={styles.lunchText}>
                    <Text style={styles.lunchTitle}>Lunch Break</Text>
                    <Text style={styles.lunchTime}>12:00 - 13:00</Text>
                  </View>
                </Card.Content>
              </Card>
            </Card.Content>
          </Card>

          <Button
            mode="contained"
            onPress={handleSaveAvailability}
            style={styles.saveButton}
            icon="check"
            contentStyle={styles.buttonContent}
          >
            Save Availability
          </Button>

          <Text style={styles.sectionTitle}>Weekly Summary</Text>
          {days.map(day => {
            const enabledSlots = getEnabledSlotsForDay(day);
            return (
              <Card key={day} style={styles.summaryCard}>
                <Card.Content style={styles.summaryContent}>
                  <View style={styles.summaryHeader}>
                    <Text style={styles.summaryDay}>{day}</Text>
                    <Chip mode="outlined" compact>
                      {enabledSlots.length} slots
                    </Chip>
                  </View>
                  {enabledSlots.length > 0 && (
                    <View style={styles.summarySlots}>
                      {enabledSlots.map(slot => (
                        <Chip key={slot} style={styles.summaryChip} compact>
                          {slot}
                        </Chip>
                      ))}
                    </View>
                  )}
                </Card.Content>
              </Card>
            );
          })}
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
    padding: spacing.md,
  },
  infoCard: {
    marginBottom: spacing.md,
    backgroundColor: theme.colors.primaryContainer,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.text,
    marginVertical: 2,
  },
  card: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
    justifyContent: 'center',
  },
  dayChip: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  slotCard: {
    marginBottom: spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  slotContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  slotInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  slotTime: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: spacing.md,
    fontFamily: 'monospace',
  },
  slotTimeActive: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  lunchCard: {
    marginTop: spacing.md,
    backgroundColor: '#FFF3E0',
  },
  lunchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  lunchText: {
    marginLeft: spacing.md,
  },
  lunchTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  lunchTime: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  saveButton: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  buttonContent: {
    paddingVertical: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    marginLeft: spacing.md,
  },
  summaryCard: {
    marginBottom: spacing.sm,
  },
  summaryContent: {
    paddingVertical: spacing.sm,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  summaryDay: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summarySlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  summaryChip: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
});

export default AvailabilityScreen;
