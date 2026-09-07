import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  Booking,
  ReminderSetting,
  UserPhoto,
  VoteChoice,
  VotingOption,
  VotingState,
} from '../types';
import {readValue, storageKeys, writeValue} from '../storage/storage';
import {createId} from '../utils/hash';

const emptyVoting: VotingState = {
  phase: 'setup',
  optionA: {title: '', detail: ''},
  optionB: {title: '', detail: ''},
  participants: 0,
  votesA: 0,
  votesB: 0,
  history: [],
  winner: null,
  decidedRandomly: false,
};

interface AppStateValue {
  hydrated: boolean;
  onboardingDone: boolean;
  completeOnboarding: () => void;
  reminders: Record<string, ReminderSetting>;
  toggleReminder: (id: string, enabled: boolean) => void;
  setReminderMinutes: (id: string, minutes: number) => void;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  removeBooking: (id: string) => void;
  isSeatBooked: (eventId: string, dateKey: string, seatId: string) => boolean;
  voting: VotingState;
  startVoting: (
    optionA: VotingOption,
    optionB: VotingOption,
    participants: number,
  ) => void;
  castVote: (option: VoteChoice) => void;
  undoLastVote: () => void;
  finishVoting: () => void;
  resetVoting: () => void;
  photos: UserPhoto[];
  addPhoto: (photo: Omit<UserPhoto, 'id' | 'createdAt'>) => void;
  updatePhoto: (
    id: string,
    patch: Partial<Pick<UserPhoto, 'title' | 'note' | 'eventId' | 'uri'>>,
  ) => void;
  removePhoto: (id: string) => void;
}

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

export const AppStateProvider = ({children}: {children: React.ReactNode}) => {
  const [hydrated, setHydrated] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [reminders, setReminders] = useState<Record<string, ReminderSetting>>(
    {},
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [voting, setVoting] = useState<VotingState>(emptyVoting);
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const skipPersist = useRef(true);

  useEffect(() => {
    let active = true;
    const hydrate = async () => {
      const [
        storedOnboarding,
        storedReminders,
        storedBookings,
        storedVoting,
        storedPhotos,
      ] = await Promise.all([
        readValue<boolean>(storageKeys.onboarding, false),
        readValue<Record<string, ReminderSetting>>(storageKeys.reminders, {}),
        readValue<Booking[]>(storageKeys.bookings, []),
        readValue<VotingState>(storageKeys.voting, emptyVoting),
        readValue<UserPhoto[]>(storageKeys.photos, []),
      ]);
      if (!active) {
        return;
      }
      setOnboardingDone(storedOnboarding);
      setReminders(storedReminders ?? {});
      setBookings(Array.isArray(storedBookings) ? storedBookings : []);
      const mergedVoting = {...emptyVoting, ...(storedVoting ?? {})};
      setVoting({
        ...mergedVoting,
        history: Array.isArray(mergedVoting.history) ? mergedVoting.history : [],
      });
      setPhotos(Array.isArray(storedPhotos) ? storedPhotos : []);
      skipPersist.current = false;
      setHydrated(true);
    };
    hydrate();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (skipPersist.current) {
      return;
    }
    writeValue(storageKeys.onboarding, onboardingDone);
  }, [onboardingDone]);

  useEffect(() => {
    if (skipPersist.current) {
      return;
    }
    writeValue(storageKeys.reminders, reminders);
  }, [reminders]);

  useEffect(() => {
    if (skipPersist.current) {
      return;
    }
    writeValue(storageKeys.bookings, bookings);
  }, [bookings]);

  useEffect(() => {
    if (skipPersist.current) {
      return;
    }
    writeValue(storageKeys.voting, voting);
  }, [voting]);

  useEffect(() => {
    if (skipPersist.current) {
      return;
    }
    writeValue(storageKeys.photos, photos);
  }, [photos]);

  const completeOnboarding = useCallback(() => setOnboardingDone(true), []);

  const toggleReminder = useCallback((id: string, enabled: boolean) => {
    setReminders(current => ({
      ...current,
      [id]: {
        minutesBefore: current[id]?.minutesBefore ?? 15,
        enabled,
      },
    }));
  }, []);

  const setReminderMinutes = useCallback((id: string, minutes: number) => {
    setReminders(current => ({
      ...current,
      [id]: {
        enabled: current[id]?.enabled ?? true,
        minutesBefore: minutes,
      },
    }));
  }, []);

  const addBooking = useCallback(
    (booking: Omit<Booking, 'id' | 'createdAt'>) => {
      setBookings(current => {
        const exists = current.some(
          item =>
            item.eventId === booking.eventId &&
            item.dateKey === booking.dateKey &&
            item.seatId === booking.seatId,
        );
        if (exists) {
          return current;
        }
        return [
          ...current,
          {...booking, id: createId('booking'), createdAt: Date.now()},
        ];
      });
    },
    [],
  );

  const removeBooking = useCallback((id: string) => {
    setBookings(current => current.filter(item => item.id !== id));
  }, []);

  const isSeatBooked = useCallback(
    (eventId: string, dateKeyValue: string, seatId: string) =>
      bookings.some(
        item =>
          item.eventId === eventId &&
          item.dateKey === dateKeyValue &&
          item.seatId === seatId,
      ),
    [bookings],
  );

  const startVoting = useCallback(
    (optionA: VotingOption, optionB: VotingOption, participants: number) => {
      setVoting({
        phase: 'voting',
        optionA,
        optionB,
        participants,
        votesA: 0,
        votesB: 0,
        history: [],
        winner: null,
        decidedRandomly: false,
      });
    },
    [],
  );

  const resolveWinner = useCallback((votesA: number, votesB: number) => {
    if (votesA === votesB) {
      return {
        winner: (Math.random() < 0.5 ? 'A' : 'B') as VoteChoice,
        decidedRandomly: true,
      };
    }
    return {
      winner: (votesA > votesB ? 'A' : 'B') as VoteChoice,
      decidedRandomly: false,
    };
  }, []);

  const castVote = useCallback(
    (option: VoteChoice) => {
      setVoting(current => {
        if (current.phase !== 'voting') {
          return current;
        }
        const cast = current.votesA + current.votesB;
        if (cast >= current.participants) {
          return current;
        }
        const votesA = option === 'A' ? current.votesA + 1 : current.votesA;
        const votesB = option === 'B' ? current.votesB + 1 : current.votesB;
        const history = [...current.history, option];
        const complete = votesA + votesB >= current.participants;
        if (!complete) {
          return {...current, votesA, votesB, history};
        }
        const outcome = resolveWinner(votesA, votesB);
        return {
          ...current,
          votesA,
          votesB,
          history,
          phase: 'result',
          winner: outcome.winner,
          decidedRandomly: outcome.decidedRandomly,
        };
      });
    },
    [resolveWinner],
  );

  const undoLastVote = useCallback(() => {
    setVoting(current => {
      if (current.history.length === 0) {
        return current;
      }
      const history = current.history.slice(0, -1);
      const last = current.history[current.history.length - 1];
      return {
        ...current,
        history,
        votesA: last === 'A' ? Math.max(0, current.votesA - 1) : current.votesA,
        votesB: last === 'B' ? Math.max(0, current.votesB - 1) : current.votesB,
        phase: 'voting',
        winner: null,
        decidedRandomly: false,
      };
    });
  }, []);

  const finishVoting = useCallback(() => {
    setVoting(current => {
      if (current.votesA + current.votesB === 0) {
        return current;
      }
      const outcome = resolveWinner(current.votesA, current.votesB);
      return {
        ...current,
        phase: 'result',
        winner: outcome.winner,
        decidedRandomly: outcome.decidedRandomly,
      };
    });
  }, [resolveWinner]);

  const resetVoting = useCallback(() => setVoting(emptyVoting), []);

  const addPhoto = useCallback((photo: Omit<UserPhoto, 'id' | 'createdAt'>) => {
    setPhotos(current => [
      {...photo, id: createId('photo'), createdAt: Date.now()},
      ...current,
    ]);
  }, []);

  const updatePhoto = useCallback(
    (
      id: string,
      patch: Partial<Pick<UserPhoto, 'title' | 'note' | 'eventId' | 'uri'>>,
    ) => {
      setPhotos(current =>
        current.map(item => (item.id === id ? {...item, ...patch} : item)),
      );
    },
    [],
  );

  const removePhoto = useCallback((id: string) => {
    setPhotos(current => current.filter(item => item.id !== id));
  }, []);

  const value = useMemo<AppStateValue>(
    () => ({
      hydrated,
      onboardingDone,
      completeOnboarding,
      reminders,
      toggleReminder,
      setReminderMinutes,
      bookings,
      addBooking,
      removeBooking,
      isSeatBooked,
      voting,
      startVoting,
      castVote,
      undoLastVote,
      finishVoting,
      resetVoting,
      photos,
      addPhoto,
      updatePhoto,
      removePhoto,
    }),
    [
      hydrated,
      onboardingDone,
      completeOnboarding,
      reminders,
      toggleReminder,
      setReminderMinutes,
      bookings,
      addBooking,
      removeBooking,
      isSeatBooked,
      voting,
      startVoting,
      castVote,
      undoLastVote,
      finishVoting,
      resetVoting,
      photos,
      addPhoto,
      updatePhoto,
      removePhoto,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }
  return context;
};
