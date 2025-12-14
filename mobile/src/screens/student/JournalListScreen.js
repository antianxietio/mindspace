import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, FAB, Chip, IconButton, Searchbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchJournals, deleteJournal } from '../../redux/slices/journalSlice';
import { spacing, theme } from '../../constants/theme';

const JournalListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { journals = [] } = useSelector((state) => state.journals || {});
  const [searchQuery, setSearchQuery] = React.useState('');

  useEffect(() => {
    dispatch(fetchJournals());
  }, [dispatch]);

  const filteredJournals = (journals || []).filter((j) =>
    j.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Journal',
      'Are you sure you want to delete this journal entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteJournal(id)),
        },
      ]
    );
  };

  const getMoodColor = (mood) => {
    const colors = {
      happy: '#4CAF50',
      calm: '#2196F3',
      anxious: '#FF9800',
      sad: '#9E9E9E',
      neutral: '#757575',
    };
    return colors[mood] || theme.colors.disabled;
  };

  const renderJournal = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('JournalEditor', { journal: item })}
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDelete(item._id)}
            />
          </View>
          <Text style={styles.content} numberOfLines={3}>{item.content}</Text>
          <View style={styles.footer}>
            <Text style={styles.date}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
            {item.mood && (
              <Chip
                mode="flat"
                textStyle={{ color: getMoodColor(item.mood) }}
                style={{ backgroundColor: getMoodColor(item.mood) + '20' }}
              >
                {item.mood}
              </Chip>
            )}
          </View>
          {item.tags && item.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tags.map((tag, index) => (
                <Chip key={index} mode="outlined" compact style={styles.tag}>
                  {tag}
                </Chip>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search journals"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <FlatList
          data={filteredJournals}
          renderItem={renderJournal}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="book-open-outline" size={64} color={theme.colors.disabled} />
              <Text style={styles.emptyText}>No journal entries yet</Text>
              <Text style={styles.emptySubtext}>Start writing to track your thoughts</Text>
            </View>
          }
        />
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => navigation.navigate('JournalEditor')}
        />
      </View>
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
  searchbar: {
    margin: spacing.md,
  },
  list: {
    padding: spacing.md,
    paddingTop: 0,
  },
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  content: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  date: {
    fontSize: 12,
    color: theme.colors.placeholder,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  tag: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: spacing.xl * 2,
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.disabled,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginTop: spacing.xs,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default JournalListScreen;
