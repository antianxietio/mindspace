import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Chip } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { createJournal, updateJournal } from '../../redux/slices/journalSlice';
import { spacing, theme } from '../../constants/theme';

const JournalEditorScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const journal = route.params?.journal;

  const [title, setTitle] = useState(journal?.title || '');
  const [content, setContent] = useState(journal?.content || '');
  const [mood, setMood] = useState(journal?.mood || '');
  const [tags, setTags] = useState(journal?.tags || []);
  const [isSaving, setIsSaving] = useState(false);

  const moods = ['happy', 'calm', 'anxious', 'sad', 'neutral'];
  const commonTags = ['academic', 'social', 'achievement', 'stress', 'personal'];

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    setIsSaving(true);
    try {
      const journalData = {
        title: title.trim(),
        content: content.trim(),
        mood,
        tags,
      };

      if (journal) {
        await dispatch(updateJournal({ id: journal._id, data: journalData })).unwrap();
        Alert.alert('Success', 'Journal updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await dispatch(createJournal(journalData)).unwrap();
        Alert.alert('Success', 'Journal saved successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error || 'Failed to save journal');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={styles.input}
          placeholder="Give your journal a title"
        />

        <TextInput
          label="What's on your mind?"
          value={content}
          onChangeText={setContent}
          mode="outlined"
          multiline
          numberOfLines={15}
          style={[styles.input, styles.contentInput]}
          placeholder="Write your thoughts here..."
        />

        <View style={styles.section}>
          <TextInput
            label="How are you feeling?"
            value=""
            editable={false}
            mode="outlined"
            style={styles.label}
          />
          <View style={styles.moodContainer}>
            {moods.map((m) => (
              <Chip
                key={m}
                selected={mood === m}
                onPress={() => setMood(m)}
                style={styles.chip}
              >
                {m}
              </Chip>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <TextInput
            label="Tags"
            value=""
            editable={false}
            mode="outlined"
            style={styles.label}
          />
          <View style={styles.tagsContainer}>
            {commonTags.map((tag) => (
              <Chip
                key={tag}
                selected={tags.includes(tag)}
                onPress={() => toggleTag(tag)}
                style={styles.chip}
              >
                {tag}
              </Chip>
            ))}
          </View>
        </View>

        <Button
          mode="contained"
          onPress={handleSave}
          loading={isSaving}
          disabled={isSaving}
          style={styles.saveButton}
        >
          {journal ? 'Update Journal' : 'Save Journal'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: spacing.md,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: theme.colors.surface,
  },
  contentInput: {
    minHeight: 200,
    textAlignVertical: 'top',
  },
  section: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  saveButton: {
    marginTop: spacing.md,
  },
});

export default JournalEditorScreen;
