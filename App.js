import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert, Modal, ScrollView, ImageBackground, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useGameStore } from './src/store/gameStore';
import { generateDailyChallenge } from './src/logic/equationGenerator';
import { getLeaderboardData } from './src/logic/leaderboardSystem';
import { ERAS, getEraForStreak } from './src/styles/themeEngine';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { Silkscreen_400Regular } from '@expo-google-fonts/silkscreen';
import CRTEffect from './src/components/CRTEffect';
import PixelIcon from './src/components/PixelIcon';
import { SecurityTerminal } from './src/components/SecurityTerminal';
import { RetroAlert } from './src/components/RetroAlert';

export default function App() {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
    Silkscreen_400Regular,
  });

  const { streak, lives, credits, currentDay, lastAnswer, loseLife, incrementStreak, totalFailures, latestUnlock, clearLatestUnlock } = useGameStore();
  const [inputValue, setInputValue] = useState('');
  const [challenge, setChallenge] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  // Custom Alert State
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'info', onConfirm: () => { } });

  // Placeholder Animation - MUST be before any conditional returns
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.2, // Fade out
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1, // Fade in
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Theme Logic
  const currentEra = getEraForStreak(streak);
  const theme = ERAS[currentEra];

  useEffect(() => {
    // Generate the challenge for the current day
    // In a real app, this would be generated once per day and stored
    // For prototype, we generate it on load based on state
    // We need to know "Yesterday's Answer" which is `lastAnswer`

    // GLITCH MECHANIC: Every 4th day is a DEBUG day
    const isGlitchDay = currentDay % 4 === 0;

    let daily;
    if (isGlitchDay && currentDay > 1) { // Don't glitch day 1
      const { generateGlitchChallenge } = require('./src/logic/equationGenerator'); // Lazy load to avoid cycle if any (cleaner import later)
      daily = generateGlitchChallenge(currentDay, lastAnswer || 1);
    } else {
      daily = generateDailyChallenge(currentDay, lastAnswer || 1);
    }

    setChallenge(daily);
  }, [currentDay, lastAnswer, streak, lives]); // Added dependencies to force refresh on reset

  useEffect(() => {
    if (showLeaderboard) {
      setLeaderboardData(getLeaderboardData(streak, totalFailures));
    }
  }, [showLeaderboard, streak, totalFailures]);

  const handleSubmit = () => {
    if (!challenge) return;

    const numInput = parseInt(inputValue);
    if (isNaN(numInput)) {
      Alert.alert("Invalid Input", "Please enter a number");
      return;
    }

    if (numInput === challenge.solution) {
      incrementStreak(challenge.solution); // The answer becomes tomorrow's "Yesterday"
      setInputValue('');
      // Delay alert slightly to allow state to update and useEffect to catch achievement?
      // Actually, since incrementStreak updates synchronous logic in store, we can check store right after?
      // Or rely on a separate useEffect for `latestUnlock`.
    } else {
      loseLife();
      Alert.alert("Wrong!", "You lost a life.");
      setInputValue('');
    }
  };

  // Watch for achievements
  const { latestUnlock: globalUnlock, clearLatestUnlock: clearGlobal } = useGameStore();
  useEffect(() => {
    if (globalUnlock) {
      setAlertConfig({
        visible: true,
        title: "ACHIEVEMENT!",
        message: globalUnlock,
        type: 'achievement',
        onConfirm: () => {
          setAlertConfig(prev => ({ ...prev, visible: false }));
          clearGlobal();
        }
      });
    }
  }, [globalUnlock, clearGlobal]);

  if (!fontsLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, theme.headerStyle, { backgroundColor: theme.background }]}>
        <View style={styles.statContainer}>
          <PixelIcon name="heart" size={20 * theme.fontSizeScale} />
          <Text style={[styles.stat, {
            color: theme.textPrimary,
            fontFamily: theme.fontFamily,
            fontSize: 20 * theme.fontSizeScale,
            marginLeft: 8
          }]}>{lives}</Text>
        </View>

        <View style={styles.statContainer}>
          <PixelIcon name="streak" size={20 * theme.fontSizeScale} />
          <Text style={[styles.stat, {
            color: theme.textPrimary,
            fontFamily: theme.fontFamily,
            fontSize: 20 * theme.fontSizeScale,
            marginLeft: 8
          }]}>{streak}</Text>
        </View>

        <View style={styles.statContainer}>
          <PixelIcon name="currency" size={20 * theme.fontSizeScale} />
          <Text style={[styles.stat, {
            color: theme.textPrimary,
            fontFamily: theme.fontFamily,
            fontSize: 20 * theme.fontSizeScale,
            marginLeft: 8
          }]}>{credits}</Text>
        </View>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.titleContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10 }}>
            {/* Speech Bubble */}
            {challenge?.clue && (
              <View style={[styles.speechBubble, { borderColor: theme.textPrimary, backgroundColor: theme.cardStyle.backgroundColor }]}>
                <Text style={[styles.speechText, { color: theme.textPrimary, fontFamily: theme.fontFamily, fontSize: 12 * theme.fontSizeScale }]}>
                  {challenge.clue.replace("Bit: ", "")}
                </Text>
                <View style={[styles.bubbleArrow, { borderTopColor: theme.textPrimary, borderLeftColor: theme.textPrimary, backgroundColor: theme.cardStyle.backgroundColor }]} />
              </View>
            )}

            <PixelIcon name="bit" size={48 * theme.fontSizeScale} />
          </View>

          <Text style={[styles.title, {
            color: theme.textPrimary,
            fontFamily: theme.fontFamily,
            fontSize: 32 * theme.fontSizeScale,
            marginBottom: 0
          }]}>MathStreak</Text>
        </View>
        <Text style={[styles.subtitle, {
          color: theme.textSecondary,
          fontFamily: theme.fontFamily,
          fontSize: 20 * theme.fontSizeScale
        }]}>Day {currentDay}</Text>

        {/* Dynamic Card Style */}
        <View style={[styles.card, theme.cardStyle, challenge?.isGlitch && styles.glitchCard]}>
          <Text style={[styles.equationLabel, {
            color: challenge?.isGlitch ? '#FF0000' : theme.textSecondary,
            fontFamily: theme.fontFamily,
            fontSize: 14 * theme.fontSizeScale
          }]}>
            {challenge?.isGlitch ? "SYSTEM FAILURE" : "TODAY'S CLUE:"}
          </Text>
          <Text style={[styles.equation, {
            color: challenge?.isGlitch ? '#FF0000' : theme.textPrimary,
            fontFamily: theme.fontFamily,
            fontSize: challenge?.isGlitch ? 24 * theme.fontSizeScale : 36 * theme.fontSizeScale, // Smaller for long broken eq
            lineHeight: 40 * theme.fontSizeScale * 1.5
          }]}>
            {challenge?.isGlitch ? challenge.brokenEquation : (challenge?.equationText || "Loading...")}
          </Text>
        </View>

        <SecurityTerminal
          key={challenge?.id} // Force remount on new day/challenge
          theme={theme}
          correctSolution={challenge?.solution}
          onUnlock={(loot) => {
            const solution = challenge?.solution;
            if (solution) {
              incrementStreak(solution);
              // Show Bit's success message
              if (challenge.successMessage) {
                Alert.alert("Memory Update", challenge.successMessage.replace("Bit: ", ""), [
                  { text: "Got it", onPress: () => { } }
                ]);
              }
            }
          }}
          disabled={!challenge}
        />

        <TouchableOpacity style={[styles.button, theme.buttonStyle, { marginTop: 10, opacity: 0.8 }]} onPress={() => setShowLeaderboard(true)}>
          <Text style={[styles.secondaryButtonText, { color: theme.textPrimary, fontFamily: theme.fontFamily }]}>🏆 LEADERBOARD</Text>
        </TouchableOpacity>
      </View>



      {/* DEV HELPER: Show Solution */}
      <View style={{ position: 'absolute', top: 50, left: 10, backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: 5, borderRadius: 5, zIndex: 100 }}>
        <Text style={{ color: '#000', fontSize: 10, fontWeight: 'bold' }}>
          DEBUG: Sol={challenge?.solution} | Prev={lastAnswer}
        </Text>
      </View>

      <Modal animationType="slide" transparent={true} visible={showLeaderboard} onRequestClose={() => setShowLeaderboard(false)}>
        <View style={[styles.modalView, { backgroundColor: theme.background, borderColor: theme.accent, borderWidth: 2 }]}>
          <Text style={[styles.modalTitle, { color: theme.textPrimary, fontFamily: theme.fontFamily }]}>TOP STREAKERS</Text>
          <ScrollView style={{ width: '100%' }}>
            {leaderboardData.map((item, index) => (
              <View key={item.id} style={[styles.rankRow, { borderBottomColor: theme.textSecondary }]}>
                <Text style={[styles.rankNum, { color: theme.textSecondary, fontFamily: theme.fontFamily }]}>#{index + 1}</Text>
                <View style={styles.rankInfo}>
                  <Text style={[styles.rankName, { color: theme.textPrimary, fontFamily: theme.fontFamily }]}>
                    {item.name}
                    {item.failures === 0 ? " ⭐" : ""}
                    {item.failures > 0 ? ` 💔×${item.failures}` : ""}
                  </Text>
                </View>
                <Text style={[styles.rankScore, { color: theme.accent, fontFamily: theme.fontFamily }]}>{item.streak} Days</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={[styles.closeButton, theme.buttonStyle]} onPress={() => setShowLeaderboard(false)}>
            <Text style={[styles.closeButtonText, { color: theme.textPrimary, fontFamily: theme.fontFamily }]}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Global Retro Alert */}
      <RetroAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm}
        theme={theme}
        type={alertConfig.type}
      />

      <StatusBar style={currentEra === '32-bit' ? "light" : "auto"} />

      {/* CRT Effect Overlay for 8-bit Era */}
      {currentEra === '8-bit' && <CRTEffect />}
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderBottomWidth: 1,
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'column', // Stack vertically
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    // marginBottom: 5, // Handled by container
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 30,
  },
  card: {
    padding: 30,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  glitchCard: {
    borderColor: '#FF0000',
    borderWidth: 2,
    backgroundColor: '#110000', // Subtle red tint
  },
  equationLabel: {
    fontSize: 14,
    marginBottom: 10,
    letterSpacing: 1,
  },
  equation: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // },  <-- removed
  speechBubble: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    maxWidth: 200,
    marginRight: 10,
    marginBottom: 20, // Lift it up a bit
  },
  speechText: {
    fontSize: 12,
    lineHeight: 16,
  },
  bubbleArrow: {
    position: 'absolute',
    bottom: -10,
    right: 10, // Position towards Bit
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    // We will override borderTopColor inline
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    position: 'absolute',
    fontSize: 18, // Adjust to fit input size, maybe slightly smaller than input text
    textAlign: 'center',
    pointerEvents: 'none', // Allow clicks to pass through to input
    zIndex: 1,
  },
  input: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    fontSize: 24,
    textAlign: 'center',
    // marginBottom: 20, // Moved to container
    borderWidth: 1,
  },
  button: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalView: {
    margin: 20,
    marginTop: 100,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  rankRow: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    alignItems: 'center',
    width: '100%',
  },
  rankNum: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 40,
  },
  rankInfo: {
    flex: 1,
  },
  rankName: {
    fontSize: 18,
    fontWeight: '500',
  },
  rankScore: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    borderRadius: 10,
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    fontWeight: "bold",
    textAlign: "center"
  }
});
