import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Button, TextInput, Chip } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { logMood, fetchMoods, fetchMonthMoods } from '../../redux/slices/moodSlice';
import { spacing, theme } from '../../constants/theme';
import { MOOD_EMOJIS } from '../../constants';

const MoodTrackerScreen = () => {
  const dispatch = useDispatch();
  const { moods = [], currentMonthMoods = [] } = useSelector((state) => state.moods || {});
  const [selectedMood, setSelectedMood] = useState(null);
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const moodOptions = [
    { key: 'happy', label: 'Happy', emoji: '😊', color: '#4CAF50' },
    { key: 'calm', label: 'Calm', emoji: '😌', color: '#2196F3' },
    { key: 'neutral', label: 'Neutral', emoji: '😐', color: '#757575' },
    { key: 'anxious', label: 'Anxious', emoji: '😰', color: '#FF9800' },
    { key: 'sad', label: 'Sad', emoji: '😢', color: '#9E9E9E' },
  ];

  const activities = ['Exercise', 'Study', 'Social', 'Work', 'Relaxation', 'Hobbies', 'Sleep'];

  useEffect(() => {
    dispatch(fetchMoods());
    const now = new Date();
    dispatch(fetchMonthMoods({ year: now.getFullYear(), month: now.getMonth() + 1 }));

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
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

  const handleLogMood = async () => {
    if (!selectedMood) return;

    const moodData = {
      mood: selectedMood,
      intensity,
      note,
      activities: selectedActivities,
    };

    await dispatch(logMood(moodData)).unwrap();
    setSelectedMood(null);
    setIntensity(3);
    setNote('');
    setSelectedActivities([]);
  };

  const toggleActivity = (activity) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(selectedActivities.filter(a => a !== activity));
    } else {
      setSelectedActivities([...selectedActivities, activity]);
    }
  };

  const getMoodColor = (mood) => {
    const moodOption = moodOptions.find(m => m.key === mood);
    return moodOption?.color || theme.colors.disabled;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>How are you feeling today?</Text>
              <View style={styles.moodOptions}>
                {moodOptions.map((mood) => (
                  <TouchableOpacity
                    key={mood.key}
                    activeOpacity={1}
                    style={[
                      styles.moodButton,
                      selectedMood === mood.key && {
                        backgroundColor: mood.color + '30',
                        borderColor: mood.color,
                      },
                    ]}
                    onPress={() =>
                      setSelectedMood((prev) => (prev === mood.key ? null : mood.key))
                    }
                  >
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text style={styles.moodLabel}>{mood.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card.Content>
          </Card>

          {selectedMood && (
            <>
              <Card style={styles.card}>
                <Card.Content>
                  <Text style={styles.sectionTitle}>Intensity</Text>
                  <View style={styles.intensityContainer}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.intensityButton,
                          intensity === level && styles.intensityButtonActive,
                        ]}
                        onPress={() => setIntensity(level)}
                      >
                        <Text
                          style={[
                            styles.intensityText,
                            intensity === level && styles.intensityTextActive,
                          ]}
                        >
                          {level}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </Card.Content>
              </Card>

              <Card style={styles.card}>
                <Card.Content>
                  <Text style={styles.sectionTitle}>Activities</Text>
                  <View style={styles.activitiesContainer}>
                    {activities.map((activity) => (
                      <Chip
                        key={activity}
                        selected={selectedActivities.includes(activity)}
                        onPress={() => toggleActivity(activity)}
                        style={styles.activityChip}
                      >
                        {activity}
                      </Chip>
                    ))}
                  </View>
                </Card.Content>
              </Card>

              <Card style={styles.card}>
                <Card.Content>
                  <Text style={styles.sectionTitle}>Note (Optional)</Text>
                  <TextInput
                    value={note}
                    onChangeText={setNote}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    placeholder="Add any additional thoughts..."
                    style={styles.noteInput}
                  />
                </Card.Content>
              </Card>

              <Button
                mode="contained"
                onPress={handleLogMood}
                style={styles.logButton}
              >
                Log Mood
              </Button>
            </>
          )}

          <Card style={styles.card}>
            <Card.Title title="Recent Moods" />
            <Card.Content>
              {(moods || []).slice(0, 7).map((mood) => (
                <View key={mood._id} style={styles.moodEntry}>
                  <View style={styles.moodEntryLeft}>
                    <Text style={styles.moodEntryEmoji}>
                      {moodOptions.find(m => m.key === mood.mood)?.emoji || '😐'}
                    </Text>
                    <View style={styles.moodEntryInfo}>
                      <Text style={styles.moodEntryMood}>
                        {moodOptions.find(m => m.key === mood.mood)?.label || mood.mood}
                      </Text>
                      <Text style={styles.moodEntryDate}>
                        {new Date(mood.date).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
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
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  card: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  moodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
  moodButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 60,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 4,
    textAlign: 'center',
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  intensityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  intensityButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.disabled,
  },
  intensityButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  intensityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  intensityTextActive: {
    color: '#FFFFFF',
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  activityChip: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  noteInput: {
    backgroundColor: theme.colors.surface,
  },
  logButton: {
    margin: spacing.md,
    marginTop: 0,
  },
  moodEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  moodEntryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodEntryEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  moodEntryInfo: {
    flex: 1,
  },
  moodEntryMood: {
    fontSize: 16,
    fontWeight: '600',
  },
  moodEntryDate: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginTop: 2,
  },
  moodEntryIntensity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  intensityDot: {
    marginHorizontal: 2,
  },
});

export default MoodTrackerScreen;
