import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, Text } from 'react-native';
import React from 'react';
const { useState, useEffect } = React;
import { useGameStore } from './src/store/gameStore';
import { ERAS, getEraForStreak, getNextEraInfo } from './src/styles/themeEngine';
import { DROID_CHASSIS, getUnlockedDroids } from './src/data/droidData';
import * as Font from 'expo-font';
import { PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { Silkscreen_400Regular } from '@expo-google-fonts/silkscreen';
import { VT323_400Regular } from '@expo-google-fonts/vt323';
import { Orbitron_400Regular, Orbitron_700Bold } from '@expo-google-fonts/orbitron';
import CRTEffect from './src/components/CRTEffect';
import { RetroAlert } from './src/components/RetroAlert';
import { ACHIEVEMENT_DEFINITIONS } from './src/logic/achievementSystem';
import { generateLoot } from './src/logic/lootSystem';

// Screens
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { TrophyScreen } from './src/screens/TrophyScreen';
import { TimeAttackScreen } from './src/screens/TimeAttackScreen';
import { ZenModeScreen } from './src/screens/ZenModeScreen';
import { LevelMapScreen } from './src/screens/LevelMapScreen';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';

export default function App() {
  console.log("APP RESTORED & FIXED: " + Date.now());
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          PressStart2P_400Regular,
          Silkscreen_400Regular,
          VT323_400Regular,
          Orbitron_400Regular,
          Orbitron_700Bold,
        });
        setFontsLoaded(true);
      } catch (e) {
        console.warn(e);
      }
    }
    loadFonts();
  }, []);

  // Global State
  const {
    streak, lives, credits, currentDay, lastAnswer,
    loseLife, addCredit, incrementStreak,
    unlockedAchievements, latestUnlock, addItem, clearLatestUnlock, inventory, consumeItems, useConsumable,
    isPro, unlockPro
  } = useGameStore();

  // MOCK STATE REMOVED


  // Navigation State
  const [currentScreen, setCurrentScreen] = useState('HOME');
  const [selectedDroid, setSelectedDroid] = useState('box-orb');

  // Alert State (Global)
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'info', onConfirm: () => { } });

  // Theme Logic
  const currentEra = getEraForStreak(streak);
  const theme = ERAS[currentEra];
  // const theme = { background: '#000', textPrimary: '#fff', accent: '#0f0' }; // Mock theme

  // Global Achievement Watcher
  useEffect(() => {
    if (latestUnlock) {
      setAlertConfig({
        visible: true,
        title: "ACHIEVEMENT!",
        message: latestUnlock,
        type: 'achievement',
        onConfirm: () => {
          setAlertConfig(prev => ({ ...prev, visible: false }));
          clearLatestUnlock();
        }
      });
    }
  }, [latestUnlock, clearLatestUnlock]);

  const handleLevelComplete = (solution) => {
    // 1. Core Logic
    console.log(`[APP] handleLevelComplete called with solution: ${solution}`);
    incrementStreak(solution);
    addCredit(1); // Standard reward

    // 2. Scavenge Loot (Chance)
    if (Math.random() > 0.3) {
      const loot = generateLoot('COMPONENT');
      addItem(loot.id);
      setAlertConfig({
        visible: true,
        title: "SCAVENGED!",
        message: `Found: ${loot.name}`,
        type: 'success',
        onConfirm: () => {
          setAlertConfig(prev => ({ ...prev, visible: false }));
          setCurrentScreen('MAP');
        }
      });
    } else {
      setCurrentScreen('MAP');
    }
  };

  // Dev Tracker State
  const [customTracker, setCustomTracker] = useState(null);

  // Reset custom tracker when changing screens
  useEffect(() => {
    setCustomTracker(null);
  }, [currentScreen]);

  if (!fontsLoaded) {
    return null;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      // ... (HOME, MAP, GAME unchanged)
      case 'HOME':
        return (
          <HomeScreen
            theme={theme}
            era={currentEra}
            streak={streak}
            lives={lives}
            credits={credits}
            isPro={isPro}
            selectedDroid={selectedDroid}
            onSelectDroid={(droidId) => {
              setSelectedDroid(droidId);
              setCurrentScreen('MAP');
            }}
            onShowTrophies={() => setCurrentScreen('TROPHIES')}
            onShowLeaderboard={() => setCurrentScreen('LEADERBOARD')}
            onTimeAttack={() => setCurrentScreen('TIME_ATTACK')}
            onZenMode={() => setCurrentScreen('ZEN_MODE')}
          />
        );
      case 'MAP':
        return (
          <LevelMapScreen
            theme={theme}
            era={currentEra}
            mode="STORY"
            streak={streak}
            selectedDroid={selectedDroid}
            nextEra={getNextEraInfo(streak)}
            onLevelSelect={() => setCurrentScreen('GAME')}
            onBack={() => setCurrentScreen('HOME')}
          />
        );
      case 'GAME':
        return (
          <GameScreen
            theme={theme}
            era={currentEra}
            streak={streak}
            lives={lives}
            credits={credits}
            currentDay={currentDay}
            lastAnswer={lastAnswer}
            loseLife={loseLife}
            incrementStreak={handleLevelComplete}
            setAlertConfig={setAlertConfig}
            latestUnlock={latestUnlock}
            inventory={inventory}
            useConsumable={useConsumable}
            addItem={addItem}
            selectedDroid={selectedDroid}
            nextEra={getNextEraInfo(streak)}
            onBack={() => setCurrentScreen('HOME')}
          />
        );
      case 'TROPHIES':
        const unlockedItems = ACHIEVEMENT_DEFINITIONS.filter(item =>
          unlockedAchievements.includes(item.id)
        ).map(item => ({
          ...item,
          year: item.data?.year || null
        }));

        return (
          <TrophyScreen
            theme={theme}
            unlockedItems={unlockedItems}
            inventory={inventory}
            addItem={addItem}
            consumeItems={consumeItems}
            useConsumable={useConsumable}
            onBack={() => setCurrentScreen('HOME')}
          />
        );
      case 'TIME_ATTACK':
        return (
          <TimeAttackScreen
            theme={theme}
            onBack={() => setCurrentScreen('HOME')}
          />
        );
      case 'ZEN_MODE':
        return (
          <ZenModeScreen
            theme={theme}
            onBack={() => setCurrentScreen('HOME')}
            onUpdateTracker={setCustomTracker}
          />
        );
      case 'LEADERBOARD':
        return (
          <LeaderboardScreen
            theme={theme}
            onBack={() => setCurrentScreen('HOME')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {renderScreen()}

      {/* Global Retro Alert */}
      <RetroAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm}
        theme={theme}
        type={alertConfig.type}
      />

      <StatusBar style={currentEra === 'gameboy' ? "dark" : "light"} />
      <CRTEffect {...theme.crtConfig} />

      {/* Development Tracker */}
      <View style={{ position: 'absolute', top: 50, right: 20, padding: 8, backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: 5, borderWidth: 1, borderColor: '#00FF00', zIndex: 999 }}>
        <Text style={{ color: '#00FF00', fontFamily: 'monospace', fontSize: 10 }}>
          TRAK: {customTracker !== null ? customTracker : (lastAnswer || '?')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
