import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Card, TextInput, Chip, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchTimeSlots, bookAppointment } from '../../redux/slices/appointmentSlice';
import { spacing, theme } from '../../constants/theme';

const BookAppointmentScreen = ({ route, navigation }) => {
  const { counsellor } = route.params;
  const dispatch = useDispatch();
  const { timeSlots = [], isLoading } = useSelector((state) => state.appointments || {});

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');
  const appointmentType = 'individual';

  useEffect(() => {
    if (counsellor) {
      dispatch(fetchTimeSlots(counsellor._id));
    }
  }, [counsellor, dispatch]);

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }
    if (!reason.trim()) {
      Alert.alert('Error', 'Please provide a reason for appointment');
      return;
    }

    try {
      await dispatch(bookAppointment({
        counsellorId: counsellor._id,
        date: selectedDate,
        time: selectedSlot.time,
        type: appointmentType,
        reason: reason.trim(),
      })).unwrap();

      Alert.alert('Success', 'Appointment booked successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', error || 'Failed to book appointment');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
        <Card style={styles.counsellorCard}>
          <Card.Content>
            <Text style={styles.counsellorName}>{counsellor?.name}</Text>
            <Text style={styles.specialization}>{counsellor?.specialization}</Text>
          </Card.Content>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <Text style={styles.dateText}>{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Time Slots</Text>
          {isLoading ? (
            <ActivityIndicator style={styles.loader} />
          ) : (
            <View style={styles.slotsContainer}>
              {timeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot._id}
                  disabled={!slot.available}
                  onPress={() => setSelectedSlot(slot)}
                >
                  <Chip
                    selected={selectedSlot?._id === slot._id}
                    disabled={!slot.available}
                    style={styles.slotChip}
                    textStyle={!slot.available && styles.disabledText}
                  >
                    {slot.time}
                  </Chip>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reason for Appointment</Text>
          <TextInput
            mode="outlined"
            value={reason}
            onChangeText={setReason}
            placeholder="E.g., Stress management, Career guidance"
            multiline
            numberOfLines={4}
            style={styles.reasonInput}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleBookAppointment}
          style={styles.bookButton}
          disabled={!selectedSlot || isLoading}
        >
          Book Appointment
        </Button>
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
  counsellorCard: {
    margin: spacing.md,
  },
  counsellorName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  specialization: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 4,
  },
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  typeChip: {
    marginRight: spacing.sm,
  },
  dateText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  slotChip: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  disabledText: {
    textDecorationLine: 'line-through',
  },
  reasonInput: {
    backgroundColor: theme.colors.surface,
  },
  bookButton: {
    margin: spacing.md,
    marginTop: 0,
  },
  loader: {
    marginVertical: spacing.lg,
  },
});

export default BookAppointmentScreen;
