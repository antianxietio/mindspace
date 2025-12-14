import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Dimensions, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, Chip, Text, SegmentedButtons } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import Svg, { Path, Circle } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createJournal, updateJournal } from '../../redux/slices/journalSlice';
import { spacing, theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

const JournalEditorScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const journal = route.params?.journal;

  const [title, setTitle] = useState(journal?.title || '');
  const [content, setContent] = useState(journal?.content || '');
  const [mood, setMood] = useState(journal?.mood || '');
  const [tags, setTags] = useState(journal?.tags || []);
  const [isSaving, setIsSaving] = useState(false);
  const [mode, setMode] = useState('text'); // 'text' or 'draw'
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [currentColor, setCurrentColor] = useState(theme.colors.primary);
  const [canvasHeight, setCanvasHeight] = useState(320);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const currentPathRef = useRef('');
  const currentColorRef = useRef(currentColor);
  const resizeStartHeight = useRef(canvasHeight);

  const moods = ['happy', 'calm', 'anxious', 'sad', 'neutral'];
  const commonTags = ['academic', 'social', 'achievement', 'stress', 'personal'];
  const drawColors = [theme.colors.primary, theme.colors.secondary, '#000000', '#FF5252', '#4CAF50'];

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

  useEffect(() => {
    currentColorRef.current = currentColor;
  }, [currentColor]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setScrollEnabled(false);
        const { locationX, locationY } = evt.nativeEvent;
        const startPath = `M${locationX},${locationY}`;
        currentPathRef.current = startPath;
        setCurrentPath(startPath);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPathRef.current = `${currentPathRef.current} L${locationX},${locationY}`;
        setCurrentPath(currentPathRef.current);
      },
      onPanResponderRelease: () => {
        setScrollEnabled(true);
        if (currentPathRef.current) {
          setPaths((prev) => [...prev, { path: currentPathRef.current, color: currentColorRef.current }]);
          currentPathRef.current = '';
          setCurrentPath('');
        }
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const clearDrawing = () => {
    setPaths([]);
    setCurrentPath('');
    currentPathRef.current = '';
  };

  const resizeResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        resizeStartHeight.current = canvasHeight;
        setScrollEnabled(false);
      },
      onPanResponderMove: (_, gestureState) => {
        const next = Math.min(520, Math.max(220, resizeStartHeight.current + gestureState.dy));
        setCanvasHeight(next);
      },
      onPanResponderRelease: () => {
        setScrollEnabled(true);
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        scrollEnabled={scrollEnabled}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
            placeholder="Give your journal a title"
          />

          {/* Mode Switcher */}
          <SegmentedButtons
            value={mode}
            onValueChange={setMode}
            buttons={[
              {
                value: 'text',
                label: 'Text',
                icon: 'text',
              },
              {
                value: 'draw',
                label: 'Draw',
                icon: 'pencil',
              },
            ]}
            style={styles.modeSwitch}
          />

          {mode === 'text' ? (
            <TextInput
              label="What's on your mind?"
              value={content}
              onChangeText={setContent}
              mode="outlined"
              multiline
              scrollEnabled
              numberOfLines={12}
              style={[styles.input, styles.contentInput]}
              placeholder="Write your thoughts here..."
              textAlignVertical="top"
            />
          ) : (
            <View style={styles.drawingContainer}>
              <View style={styles.drawingToolbar}>
                <Text style={styles.toolbarLabel}>Colors:</Text>
                <View style={styles.colorPicker}>
                  {drawColors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      onPress={() => setCurrentColor(color)}
                      style={[
                        styles.colorButton,
                        { backgroundColor: color },
                        currentColor === color && styles.selectedColor,
                      ]}
                    />
                  ))}
                </View>
                <Button
                  mode="outlined"
                  icon="eraser"
                  onPress={clearDrawing}
                  compact
                  style={styles.clearButton}
                >
                  Clear
                </Button>
              </View>
              <View style={[styles.canvas, { height: canvasHeight }]}>
                <View
                  style={{ width: '100%', height: '100%' }}
                  {...panResponder.panHandlers}
                >
                  <Svg height={canvasHeight} width={width - 48}>
                    {paths.map((item, index) => (
                      <Path
                        key={index}
                        d={item.path}
                        stroke={item.color}
                        strokeWidth={3}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}
                    {currentPath && (
                      <Path
                        d={currentPath}
                        stroke={currentColor}
                        strokeWidth={3}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </Svg>
                </View>
                {paths.length === 0 && !currentPath && (
                  <View style={styles.canvasPlaceholder}>
                    <Icon name="gesture" size={48} color={theme.colors.placeholder} />
                    <Text style={styles.canvasPlaceholderText}>Draw with your finger</Text>
                  </View>
                )}
                <View
                  style={styles.resizeHandle}
                  {...resizeResponder.panHandlers}
                >
                  <Icon name="resize-bottom-right" size={20} color={theme.colors.placeholder} />
                </View>
              </View>
            </View>
          )}

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
  modeSwitch: {
    marginBottom: spacing.md,
  },
  drawingContainer: {
    marginBottom: spacing.md,
  },
  drawingToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  toolbarLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: spacing.xs,
  },
  colorPicker: {
    flexDirection: 'row',
    flex: 1,
    gap: spacing.xs,
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#000000',
    borderWidth: 3,
  },
  clearButton: {
    marginLeft: spacing.sm,
  },
  canvas: {
    height: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.primary + '30',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  resizeHandle: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFFCC',
  },
  canvasPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasPlaceholderText: {
    marginTop: spacing.sm,
    color: theme.colors.placeholder,
    fontSize: 16,
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
