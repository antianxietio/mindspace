import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Card, Avatar, Chip, TextInput, Portal, Modal } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { logout } from '../../redux/slices/authSlice';
import { spacing, theme } from '../../constants/theme';

const CounsellorProfileScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    experience: user?.experience || '',
    specialization: user?.specialization || '',
    designation: user?.designation || '',
    location: user?.location || '',
  });

  const getInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'C';
  };

  const handleSaveProfile = async () => {
    try {
      // Validate required fields
      if (!editForm.name.trim()) {
        Alert.alert('Error', 'Name is required');
        return;
      }

      // TODO: Add API call when backend endpoint is ready
      // const response = await apiClient.put('/counsellors/profile', editForm);
      // dispatch(updateProfile(editForm));

      Alert.alert('Success', 'Profile updated successfully');
      setEditModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.avatarContainer}>
            <Avatar.Text
              size={80}
              label={getInitials()}
              style={styles.avatar}
              color="#FFFFFF"
            />
            <View style={styles.editBadge}>
              <Icon name="camera" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{user?.name || 'Counsellor'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          {user?.designation && (
            <Chip icon="badge-account" style={styles.designationChip}>
              {user.designation}
            </Chip>
          )}
          <Button
            mode="outlined"
            onPress={() => {
              setEditForm({
                name: user?.name || '',
                experience: user?.experience || '',
                specialization: user?.specialization || '',
                designation: user?.designation || '',
                location: user?.location || '',
              });
              setEditModalVisible(true);
            }}
            style={styles.editButton}
            icon="pencil"
            contentStyle={styles.buttonContent}
          >
            Edit Profile
          </Button>
        </View>

        <Card style={styles.card}>
          <Card.Title
            title="Professional Information"
            left={(props) => <Icon name="briefcase" {...props} size={24} />}
          />
          <Card.Content>
            <View style={styles.infoRow}>
              <View style={styles.infoRowLeft}>
                <Icon name="account" size={20} color={theme.colors.placeholder} />
                <Text style={styles.label}>Name</Text>
              </View>
              <Text style={styles.value}>{user?.name || 'Not set'}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoRowLeft}>
                <Icon name="briefcase-outline" size={20} color={theme.colors.placeholder} />
                <Text style={styles.label}>Designation</Text>
              </View>
              <Text style={styles.value}>{user?.designation || 'Not set'}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoRowLeft}>
                <Icon name="star" size={20} color={theme.colors.placeholder} />
                <Text style={styles.label}>Specialization</Text>
              </View>
              <Text style={styles.value}>{user?.specialization || 'Not set'}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoRowLeft}>
                <Icon name="clock-outline" size={20} color={theme.colors.placeholder} />
                <Text style={styles.label}>Experience</Text>
              </View>
              <Text style={styles.value}>{user?.experience || 'Not set'}</Text>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoRowLeft}>
                <Icon name="map-marker" size={20} color={theme.colors.placeholder} />
                <Text style={styles.label}>Location</Text>
              </View>
              <Text style={styles.value}>{user?.location || 'Not set'}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={[styles.card, styles.privacyCard]}>
          <Card.Content>
            <View style={styles.privacyNotice}>
              <Icon name="shield-lock" size={40} color={theme.colors.success} />
              <Text style={styles.privacyTitle}>Confidentiality Assured</Text>
              <Text style={styles.privacyDescription}>
                All your sessions and student interactions are encrypted and follow strict privacy protocols.
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={() => dispatch(logout())}
          style={styles.button}
          buttonColor={theme.colors.error}
          icon="logout"
          contentStyle={styles.logoutButtonContent}
        >
          Logout
        </Button>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Portal>
        <Modal
          visible={editModalVisible}
          onDismiss={() => setEditModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <ScrollView style={styles.modalScroll}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <TextInput
              label="Name"
              value={editForm.name}
              onChangeText={(text) => setEditForm({ ...editForm, name: text })}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
            />

            <TextInput
              label="Designation"
              value={editForm.designation}
              onChangeText={(text) => setEditForm({ ...editForm, designation: text })}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., Senior Counsellor"
              left={<TextInput.Icon icon="briefcase-outline" />}
            />

            <TextInput
              label="Specialization"
              value={editForm.specialization}
              onChangeText={(text) => setEditForm({ ...editForm, specialization: text })}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., Anxiety, Depression"
              left={<TextInput.Icon icon="star" />}
            />

            <TextInput
              label="Experience (Optional)"
              value={editForm.experience}
              onChangeText={(text) => setEditForm({ ...editForm, experience: text })}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., 5 years"
              left={<TextInput.Icon icon="clock-outline" />}
            />

            <TextInput
              label="Location"
              value={editForm.location}
              onChangeText={(text) => setEditForm({ ...editForm, location: text })}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., Building A, Room 205"
              left={<TextInput.Icon icon="map-marker" />}
            />

            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => setEditModalVisible(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSaveProfile}
                style={styles.modalButton}
                contentStyle={styles.buttonContent}
              >
                Save
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
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
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: spacing.sm,
  },
  designationChip: {
    marginTop: spacing.sm,
  },
  editButton: {
    marginTop: spacing.md,
    minWidth: 150,
  },
  buttonContent: {
    paddingVertical: spacing.xs,
  },
  card: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    fontSize: 16,
    color: theme.colors.placeholder,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  privacyCard: {
    backgroundColor: theme.colors.success + '10',
    borderWidth: 2,
    borderColor: theme.colors.success + '30',
  },
  privacyNotice: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  privacyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  privacyDescription: {
    fontSize: 14,
    color: theme.colors.placeholder,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  logoutButtonContent: {
    paddingVertical: spacing.sm,
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    margin: spacing.lg,
    borderRadius: 12,
    maxHeight: '90%',
  },
  modalScroll: {
    padding: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: theme.colors.background,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  modalButton: {
    flex: 1,
  },
});

export default CounsellorProfileScreen;
