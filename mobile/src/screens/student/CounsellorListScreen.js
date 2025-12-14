import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Chip, Avatar, ActivityIndicator, Searchbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchCounsellors } from '../../redux/slices/appointmentSlice';
import { spacing, theme } from '../../constants/theme';

const CounsellorListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { counsellors, isLoading } = useSelector((state) => state.appointments);
  const [searchQuery, setSearchQuery] = React.useState('');

  useEffect(() => {
    dispatch(fetchCounsellors());
  }, [dispatch]);

  const filteredCounsellors = counsellors.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCounsellor = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('BookAppointment', { counsellor: item })}
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Avatar.Icon
              size={50}
              icon="account"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <View style={styles.counsellorInfo}>
              <Text style={styles.counsellorName}>{item.name}</Text>
              <Text style={styles.specialization}>{item.specialization}</Text>
              <Text style={styles.department}>{item.department}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#FFB300" />
              <Text style={styles.rating}>{item.rating}</Text>
            </View>
          </View>
          <View style={styles.footer}>
            <Chip
              icon="circle"
              mode="flat"
              textStyle={{
                color: item.isActive ? '#FF9800' : '#4CAF50',
                fontSize: 12
              }}
              style={{
                backgroundColor: item.isActive ? '#FF980020' : '#4CAF5020',
                marginRight: spacing.sm
              }}
            >
              {item.isActive ? 'In Session' : 'Available'}
            </Chip>
            <Chip
              icon="calendar"
              mode="outlined"
              style={styles.chip}
            >
              {item.availableSlots} slots
            </Chip>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search counsellors"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <FlatList
          data={filteredCounsellors}
          renderItem={renderCounsellor}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="account-search" size={64} color={theme.colors.disabled} />
              <Text style={styles.emptyText}>No counsellors found</Text>
            </View>
          }
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  counsellorInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  counsellorName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  specialization: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 2,
  },
  department: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    backgroundColor: theme.colors.surface,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: spacing.xl * 2,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.disabled,
    marginTop: spacing.md,
  },
});

export default CounsellorListScreen;
