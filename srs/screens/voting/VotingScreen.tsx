import React, {useMemo, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  GlassCard,
  GradientButton,
  GradientText,
  Icon,
  ScreenContainer,
  ScreenHeader,
  SectionTitle,
  Stepper,
  TagPill,
  TextField,
} from '../../components';
import {colors, layout, s, typography, vs} from '../../theme';
import {useAppState} from '../../store/AppStateContext';
import type {RootStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Voting'>;

export const VotingScreen = ({navigation}: Props) => {
  const {voting, startVoting, castVote, undoLastVote, finishVoting, resetVoting} =
    useAppState();

  const [titleA, setTitleA] = useState('');
  const [detailA, setDetailA] = useState('');
  const [titleB, setTitleB] = useState('');
  const [detailB, setDetailB] = useState('');
  const [participants, setParticipants] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const votesCast = voting.votesA + voting.votesB;
  const remaining = Math.max(0, voting.participants - votesCast);

  const leader = useMemo(() => {
    if (voting.votesA === voting.votesB) {
      return null;
    }
    return voting.votesA > voting.votesB ? 'A' : 'B';
  }, [voting.votesA, voting.votesB]);

  const percent = (value: number) =>
    votesCast === 0 ? 0 : Math.round((value / votesCast) * 100);

  const submitSetup = () => {
    const nextErrors: Record<string, string> = {};
    if (!titleA.trim()) {
      nextErrors.titleA = 'Add a name for the first option';
    }
    if (!titleB.trim()) {
      nextErrors.titleB = 'Add a name for the second option';
    }
    if (participants < 2) {
      nextErrors.participants = 'At least two participants are needed';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    startVoting(
      {title: titleA.trim(), detail: detailA.trim()},
      {title: titleB.trim(), detail: detailB.trim()},
      participants,
    );
  };

  const restart = () => {
    resetVoting();
    setTitleA('');
    setDetailA('');
    setTitleB('');
    setDetailB('');
    setParticipants(0);
    setErrors({});
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Event voting"
        subtitle={
          voting.phase === 'setup'
            ? 'Set up the two options'
            : voting.phase === 'voting'
            ? `${votesCast} of ${voting.participants} votes`
            : 'Result'
        }
        onBack={navigation.goBack}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {voting.phase === 'setup' ? (
          <>
            <GlassCard tone="emerald" style={styles.intro}>
              <Icon name="vote" size={s(22)} color={colors.emerald} />
              <Text style={styles.introTitle}>Decide the evening together</Text>
              <Text style={styles.introText}>
                Add two options, set how many people vote, then let everyone
                choose. If both options finish level, the app picks the winner
                at random.
              </Text>
            </GlassCard>

            <View style={styles.section}>
              <SectionTitle title="Option 1" />
              <GlassCard style={styles.form}>
                <TextField
                  label="Name"
                  value={titleA}
                  onChangeText={text => {
                    setTitleA(text);
                    setErrors(current => ({...current, titleA: ''}));
                  }}
                  placeholder="Enter the first option"
                  maxLength={48}
                  error={errors.titleA || undefined}
                />
                <TextField
                  label="Details"
                  value={detailA}
                  onChangeText={setDetailA}
                  placeholder="Add venue, time or any note"
                  multiline
                  maxLength={160}
                />
              </GlassCard>
            </View>

            <View style={styles.section}>
              <SectionTitle title="Option 2" />
              <GlassCard style={styles.form}>
                <TextField
                  label="Name"
                  value={titleB}
                  onChangeText={text => {
                    setTitleB(text);
                    setErrors(current => ({...current, titleB: ''}));
                  }}
                  placeholder="Enter the second option"
                  maxLength={48}
                  error={errors.titleB || undefined}
                />
                <TextField
                  label="Details"
                  value={detailB}
                  onChangeText={setDetailB}
                  placeholder="Add venue, time or any note"
                  multiline
                  maxLength={160}
                />
              </GlassCard>
            </View>

            <View style={styles.section}>
              <SectionTitle title="Participants" />
              <GlassCard style={styles.form}>
                <Stepper
                  label="How many people vote"
                  value={participants}
                  onChange={next => {
                    setParticipants(next);
                    setErrors(current => ({...current, participants: ''}));
                  }}
                  min={0}
                  max={99}
                  hint={
                    errors.participants ||
                    'Each participant casts exactly one vote'
                  }
                />
              </GlassCard>
            </View>

            <GradientButton
              label="Start voting"
              icon="vote"
              onPress={submitSetup}
            />
          </>
        ) : (
          <>
            <GlassCard
              tone={voting.phase === 'result' ? 'gold' : 'emerald'}
              style={styles.statusCard}>
              <View style={styles.statusHead}>
                <TagPill
                  label={voting.phase === 'result' ? 'Final result' : 'Voting open'}
                  tone={voting.phase === 'result' ? 'gold' : 'emerald'}
                />
                <Text style={styles.statusCount}>
                  {votesCast}/{voting.participants}
                </Text>
              </View>
              {voting.phase === 'result' ? (
                <>
                  <GradientText style={styles.winnerTitle}>
                    {voting.winner === 'A'
                      ? voting.optionA.title
                      : voting.optionB.title}
                  </GradientText>
                  <Text style={styles.winnerNote}>
                    {voting.decidedRandomly
                      ? 'Both options finished level, so the winner was chosen at random.'
                      : `Won with ${Math.max(
                          voting.votesA,
                          voting.votesB,
                        )} of ${votesCast} votes.`}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.leaderLabel}>Current leader</Text>
                  <Text style={styles.leaderValue}>
                    {leader === null
                      ? 'Level — no leader yet'
                      : leader === 'A'
                      ? voting.optionA.title
                      : voting.optionB.title}
                  </Text>
                  <Text style={styles.remaining}>
                    {remaining > 0
                      ? `${remaining} vote${remaining > 1 ? 's' : ''} left`
                      : 'All votes are in'}
                  </Text>
                </>
              )}
            </GlassCard>

            <View style={styles.section}>
              <SectionTitle title="Options" caption="Tap to cast one vote" />
              <OptionCard
                index={1}
                title={voting.optionA.title}
                detail={voting.optionA.detail}
                votes={voting.votesA}
                percent={percent(voting.votesA)}
                winner={voting.phase === 'result' && voting.winner === 'A'}
                leading={leader === 'A'}
                disabled={voting.phase === 'result' || remaining === 0}
                onVote={() => castVote('A')}
              />
              <OptionCard
                index={2}
                title={voting.optionB.title}
                detail={voting.optionB.detail}
                votes={voting.votesB}
                percent={percent(voting.votesB)}
                winner={voting.phase === 'result' && voting.winner === 'B'}
                leading={leader === 'B'}
                disabled={voting.phase === 'result' || remaining === 0}
                onVote={() => castVote('B')}
              />
            </View>

            <View style={styles.actions}>
              {voting.phase === 'voting' ? (
                <>
                  {voting.history.length > 0 ? (
                    <GradientButton
                      label="Undo last vote"
                      variant="ghost"
                      icon="back"
                      onPress={undoLastVote}
                    />
                  ) : null}
                  {votesCast > 0 && remaining > 0 ? (
                    <GradientButton
                      label="Close voting now"
                      variant="outline"
                      icon="check"
                      onPress={finishVoting}
                    />
                  ) : null}
                </>
              ) : null}
              <GradientButton
                label="New voting"
                variant={voting.phase === 'result' ? 'gold' : 'ghost'}
                icon="plus"
                onPress={restart}
              />
            </View>
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const OptionCard = ({
  index,
  title,
  detail,
  votes,
  percent,
  winner,
  leading,
  disabled,
  onVote,
}: {
  index: number;
  title: string;
  detail: string;
  votes: number;
  percent: number;
  winner: boolean;
  leading: boolean;
  disabled: boolean;
  onVote: () => void;
}) => (
  <GlassCard
    tone={winner ? 'gold' : 'default'}
    highlighted={leading && !winner}
    style={styles.option}>
    <View style={styles.optionHead}>
      <View style={styles.optionIndex}>
        <Text style={styles.optionIndexText}>{index}</Text>
      </View>
      <View style={styles.optionTitleBlock}>
        <Text style={styles.optionTitle} numberOfLines={2}>
          {title}
        </Text>
        {detail ? (
          <Text style={styles.optionDetail} numberOfLines={3}>
            {detail}
          </Text>
        ) : null}
      </View>
      {winner ? (
        <Icon name="star" size={s(18)} color={colors.gold} />
      ) : leading ? (
        <Icon name="check" size={s(18)} color={colors.emerald} />
      ) : null}
    </View>

    <View style={styles.barRow}>
      <View style={styles.barTrack}>
        <LinearGradient
          colors={winner ? ['#F7EAC2', '#A6802F'] : ['#5CEE95', '#0C7A42']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={[styles.barFill, {width: `${percent}%`}]}
        />
      </View>
      <Text style={styles.barValue}>{percent}%</Text>
    </View>

    <View style={styles.optionFooter}>
      <Text style={styles.votesLabel}>
        {votes} vote{votes === 1 ? '' : 's'}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{disabled}}
        onPress={disabled ? undefined : onVote}
        style={({pressed}) => [
          styles.voteButton,
          disabled && styles.voteDisabled,
          pressed && !disabled && styles.votePressed,
        ]}>
        <LinearGradient
          colors={
            disabled
              ? ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']
              : ['#5CEE95', '#0C7A42']
          }
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.voteInner}>
          <Icon
            name="vote"
            size={s(15)}
            color={disabled ? colors.textDim : '#04170C'}
          />
          <Text
            style={[styles.voteLabel, disabled && styles.voteLabelDisabled]}>
            Vote
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  </GlassCard>
);

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: layout.gutter,
    paddingBottom: vs(30),
    gap: vs(18),
  },
  intro: {
    gap: s(8),
  },
  introTitle: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '800',
  },
  introText: {
    color: colors.textMuted,
    fontSize: typography.bodySm,
    lineHeight: typography.bodySm * 1.5,
  },
  section: {
    gap: s(12),
  },
  form: {
    gap: layout.gap,
  },
  statusCard: {
    gap: s(6),
  },
  statusHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: s(10),
  },
  statusCount: {
    color: colors.textSoft,
    fontSize: typography.bodySm,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  winnerTitle: {
    marginTop: s(6),
    fontSize: typography.h1,
    fontWeight: '800',
  },
  winnerNote: {
    color: colors.textMuted,
    fontSize: typography.bodySm,
    lineHeight: typography.bodySm * 1.5,
  },
  leaderLabel: {
    marginTop: s(6),
    color: colors.textDim,
    fontSize: typography.micro,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  leaderValue: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '800',
  },
  remaining: {
    color: colors.emeraldSoft,
    fontSize: typography.bodySm,
    fontWeight: '600',
  },
  option: {
    gap: s(12),
  },
  optionHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(11),
  },
  optionIndex: {
    width: s(30),
    height: s(30),
    borderRadius: s(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(47,212,111,0.14)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionIndexText: {
    color: colors.emeraldSoft,
    fontSize: typography.bodySm,
    fontWeight: '800',
  },
  optionTitleBlock: {
    flex: 1,
  },
  optionTitle: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '800',
  },
  optionDetail: {
    marginTop: s(4),
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: typography.caption * 1.5,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  barTrack: {
    flex: 1,
    height: s(8),
    borderRadius: s(4),
    backgroundColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: s(4),
  },
  barValue: {
    color: colors.textSoft,
    fontSize: typography.caption,
    fontWeight: '800',
    minWidth: s(34),
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  optionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: s(10),
  },
  votesLabel: {
    color: colors.textMuted,
    fontSize: typography.bodySm,
    fontWeight: '700',
  },
  voteButton: {
    borderRadius: layout.pill,
    overflow: 'hidden',
  },
  voteDisabled: {
    opacity: 0.6,
  },
  votePressed: {
    opacity: 0.85,
    transform: [{scale: 0.98}],
  },
  voteInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(7),
    paddingHorizontal: s(20),
    paddingVertical: s(10),
  },
  voteLabel: {
    color: '#04170C',
    fontSize: typography.bodySm,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  voteLabelDisabled: {
    color: colors.textDim,
  },
  actions: {
    gap: s(10),
  },
});
