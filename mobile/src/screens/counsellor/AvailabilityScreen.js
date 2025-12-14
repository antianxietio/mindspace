import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Button, Chip, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { spacing, theme } from '../../constants/theme';

const AvailabilityScreen = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [slots, setSlots] = useState([
    { day: 'Monday', time: '10:00 - 11:00' },
    { day: 'Tuesday', time: '14:00 - 15:00' },
    { day: 'Wednesday', time: '10:00 - 11:00' },
  ]);

  const handleAddSlot = () => {
    const newSlot = {
      day: selectedDay,
      time: `${startTime} - ${endTime}`,
    };
    setSlots([...slots, newSlot]);
    Alert.alert('Success', 'Slot added successfully');
  };

  const handleRemoveSlot = (index) => {
    Alert.alert('Remove Slot', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => setSlots(slots.filter((_, i) => i !== index)),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Add New Slot</Text>

            <Text style={styles.label}>Select Day</Text>
            <View style={styles.daysContainer}>
              {days.map((day) => (
                <Chip
                  key={day}
                  selected={selectedDay === day}
                  onPress={() => setSelectedDay(day)}
                  style={styles.dayChip}
                >
                  {day.substring(0, 3)}
                </Chip>
              ))}
            </View>

            <View style={styles.timeRow}>
              <TextInput
                label="Start Time"
                value={startTime}
                onChangeText={setStartTime}
                mode="outlined"
                style={styles.timeInput}
                placeholder="09:00"
              />
              <TextInput
                label="End Time"
                value={endTime}
                onChangeText={setEndTime}
                mode="outlined"
                style={styles.timeInput}
                placeholder="17:00"
              />
            </View>

            <Button
              mode="contained"
              onPress={handleAddSlot}
              style={styles.addButton}
              icon="plus"
            >
              Add Slot
            </Button>
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>Current Availability</Text>
        {slots.map((slot, index) => (
          <Card key={index} style={styles.slotCard}>
            <Card.Content style={styles.slotContent}>
              <View style={styles.slotInfo}>
                <Icon name="calendar" size={20} color={theme.colors.primary} />
                <View style={styles.slotText}>
                  <Text style={styles.slotDay}>{slot.day}</Text>
                  <Text style={styles.slotTime}>{slot.time}</Text>
                </View>
              </View>
              <Button
                mode="text"
                onPress={() => handleRemoveSlot(index)}
                textColor={theme.colors.error}
              >
                Remove
              </Button>
            </Card.Content>
          </Card>
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
    padding: spacing.md,
  },
  card: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  dayChip: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  timeRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  timeInput: {
    flex: 1,
  },
  addButton: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  slotCard: {
    marginBottom: spacing.sm,
  },
  slotContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  slotText: {
    marginLeft: spacing.md,
  },
  slotDay: {
    fontSize: 16,
    fontWeight: '500',
  },
  slotTime: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginTop: 2,
  },
});

export default AvailabilityScreen;
