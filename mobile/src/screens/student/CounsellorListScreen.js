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
  const { counsellors = [], isLoading } = useSelector((state) => state.appointments || {});
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
              size={60}
              icon="account"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <View style={styles.counsellorInfo}>
              <Text style={styles.counsellorName}>{item.name}</Text>
              {item.designation && (
                <View style={styles.infoRow}>
                  <Icon name="briefcase-outline" size={14} color={theme.colors.placeholder} />
                  <Text style={styles.infoText}>{item.designation}</Text>
                </View>
              )}
              {item.specialization && (
                <View style={styles.infoRow}>
                  <Icon name="star" size={14} color={theme.colors.placeholder} />
                  <Text style={styles.infoText}>{item.specialization}</Text>
                </View>
              )}
              {item.experience && (
                <View style={styles.infoRow}>
                  <Icon name="clock-outline" size={14} color={theme.colors.placeholder} />
                  <Text style={styles.infoText}>{item.experience}</Text>
                </View>
              )}
            </View>
          </View>

          {item.location && (
            <View style={styles.locationRow}>
              <Icon name="map-marker" size={16} color={theme.colors.primary} />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
          )}

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
              compact
            >
              {item.isActive ? 'In Session' : 'Available'}
            </Chip>
            <Chip
              icon="calendar"
              mode="outlined"
              style={styles.chip}
              compact
            >
              {item.availableSlots || 0} slots
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
    marginBottom: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    color: theme.colors.text,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryContainer,
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  locationText: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '500',
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
