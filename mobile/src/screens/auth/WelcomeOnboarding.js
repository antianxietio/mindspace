import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { spacing, theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

const slides = [
    {
        icon: 'shield-account',
        title: 'Your Privacy Matters',
        description: 'All your data is anonymized. You\'ll be assigned a unique anonymous ID that protects your identity while you access mental health support.',
        color: theme.colors.primary,
    },
    {
        icon: 'incognito',
        title: 'Complete Confidentiality',
        description: 'Your counsellors will only see your anonymous username. Your real identity remains private and secure at all times.',
        color: theme.colors.secondary,
    },
    {
        icon: 'emoticon-happy-outline',
        title: 'Track Your Wellness',
        description: 'Log your daily moods, write private journals, and track your mental health journey in a safe, judgment-free space.',
        color: theme.colors.success,
    },
    {
        icon: 'hand-heart',
        title: 'Professional Support',
        description: 'Book confidential sessions with trained counsellors. All sessions are private and recorded anonymously for your protection.',
        color: theme.colors.info,
    },
];

const WelcomeOnboarding = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: -50,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setCurrentIndex(currentIndex + 1);
                slideAnim.setValue(50);
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        tension: 50,
                        friction: 7,
                        useNativeDriver: true,
                    }),
                ]).start();
            });
        } else {
            navigation.replace('Onboarding');
        }
    };

    const handleSkip = () => {
        navigation.replace('Onboarding');
    };

    const currentSlide = slides[currentIndex];

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <View style={styles.container}>
                {currentIndex < slides.length - 1 && (
                    <Button
                        mode="text"
                        onPress={handleSkip}
                        style={styles.skipButton}
                        textColor={theme.colors.placeholder}
                    >
                        Skip
                    </Button>
                )}

                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateX: slideAnim }],
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.iconContainer,
                            { backgroundColor: currentSlide.color + '20' },
                        ]}
                    >
                        <Icon name={currentSlide.icon} size={80} color={currentSlide.color} />
                    </View>

                    <Text style={styles.title}>{currentSlide.title}</Text>
                    <Text style={styles.description}>{currentSlide.description}</Text>
                </Animated.View>

                <View style={styles.paginationContainer}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentIndex && styles.activeDot,
                                index === currentIndex && { backgroundColor: currentSlide.color },
                            ]}
                        />
                    ))}
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={handleNext}
                        style={styles.nextButton}
                        buttonColor={currentSlide.color}
                        contentStyle={styles.nextButtonContent}
                    >
                        {currentIndex === slides.length - 1 ? "Continue" : "Next"}
                    </Button>
                </View>

                <View style={styles.privacyBadge}>
                    <Icon name="lock" size={16} color={theme.colors.success} />
                    <Text style={styles.privacyText}>
                        🔒 End-to-end encrypted · 100% Anonymous
                    </Text>
                </View>
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
        paddingHorizontal: spacing.xl,
    },
    skipButton: {
        alignSelf: 'flex-end',
        marginTop: spacing.sm,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: spacing.md,
        color: theme.colors.text,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        color: theme.colors.placeholder,
        paddingHorizontal: spacing.md,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#CCCCCC',
        marginHorizontal: 4,
    },
    activeDot: {
        width: 30,
        height: 10,
        borderRadius: 5,
    },
    buttonContainer: {
        marginBottom: spacing.lg,
    },
    nextButton: {
        borderRadius: 12,
    },
    nextButtonContent: {
        paddingVertical: spacing.sm,
    },
    privacyBadge: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        backgroundColor: theme.colors.success + '10',
        borderRadius: 20,
        marginBottom: spacing.md,
    },
    privacyText: {
        fontSize: 13,
        fontWeight: '600',
        color: theme.colors.text,
        marginLeft: spacing.xs,
    },
});

export default WelcomeOnboarding;
