import { useEffect, useState, useCallback } from 'react';

import './App.css';
import type { PlayerProfile } from './domains/player/models/PlayerProfile';
import { ProfileManager } from './domains/player/services/ProfileManager';
import { PlayerInfo } from './ui/components/PlayerInfo';
import { TutorialHint } from './ui/components/TutorialHint';
import { PlayerProvider } from './ui/context/PlayerContext';
import tutorialSteps from './ui/tutorial/tutorialSteps';
import useTutorial from './ui/tutorial/useTutorial';

const profileManager = new ProfileManager();

function App(): JSX.Element {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const { currentStep, nextStep, isTutorialActive } = useTutorial(tutorialSteps);

  // Load profile on app start
  useEffect((): void => {
    const loadedProfile = profileManager.loadProfile();
    setProfile(loadedProfile);
  }, []);

  // Auto-save on profile changes
  useEffect((): void => {
    if (profile) {
      profileManager.saveProfile(profile);
    }
  }, [profile]);

  // Save before window close
  useEffect((): (() => void) => {
    const handleBeforeUnload = (): void => {
      if (profile) {
        profileManager.saveProfile(profile);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return (): void => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [profile]);

  // Memoized handler to prevent recreation on each render
  const handleUpdateProfile = useCallback((): void => {
    if (profile) {
      setProfile({
        ...profile,
        level: {
          ...profile.level,
          atomicWeight: profile.level.atomicWeight + 1,
        },
      });
    }
  }, [profile]);

  return (
    <PlayerProvider>
      <div className="App">
        <header className="App-header">
          <h1>Isotope</h1>
          <PlayerInfo>
            {isTutorialActive && currentStep && (
              <TutorialHint currentStep={currentStep} nextStep={nextStep} />
            )}
          </PlayerInfo>
          {profile && (
            <div>
              <button type="button" onClick={handleUpdateProfile}>
                Increase Atomic Weight
              </button>
            </div>
          )}
        </header>
      </div>
    </PlayerProvider>
  );
}

export default App;
