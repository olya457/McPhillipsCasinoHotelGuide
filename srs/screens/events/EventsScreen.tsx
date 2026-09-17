import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  BottomSheet,
  ContentReveal,
  EmptyState,
  GradientButton,
  Icon,
  ScreenContainer,
  ScreenHeader,
} from '../../components';
import {
  eventCategories,
  eventDateFilters,
  eventFormats,
} from '../../data/events';
import { colors, layout, s, typography, vs } from '../../theme';
import { useAppState } from '../../store/AppStateContext';
import {
  activeFilterCount,
  emptyFilters,
  eventDateKey,
  filterEvents,
  type EventFilters,
} from '../../utils/events';
import type { RootStackParamList } from '../../navigation/types';
import type { CasinoEvent } from '../../types';
import { EventCard } from './EventCard';
import { EventFilterBar, type FilterGroup } from './EventFilterBar';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const groupTitles: Record<FilterGroup['key'], string> = {
  category: 'Category',
  date: 'Date',
  format: 'Format',
};

const ListSeparator = () => <View style={styles.separator} />;

export const EventsScreen = () => {
  const navigation = useNavigation<Navigation>();
  const { bookings } = useAppState();
  const [filters, setFilters] = useState<EventFilters>(emptyFilters);
  const [openGroup, setOpenGroup] = useState<FilterGroup['key'] | null>(null);

  const results = useMemo(() => filterEvents(filters), [filters]);
  const count = activeFilterCount(filters);

  const groups = useMemo<FilterGroup[]>(
    () => [
      {
        key: 'category',
        label: 'Category',
        options: eventCategories,
        value: filters.category,
      },
      {
        key: 'date',
        label: 'Date',
        options: eventDateFilters,
        value: filters.date,
      },
      {
        key: 'format',
        label: 'Format',
        options: eventFormats,
        value: filters.format,
      },
    ],
    [filters],
  );

  const activeGroup = groups.find(group => group.key === openGroup) ?? null;

  const select = useCallback(
    (key: FilterGroup['key'], value: string | null) => {
      setFilters(current => ({ ...current, [key]: value } as EventFilters));
      setOpenGroup(null);
    },
    [],
  );

  const seatsFor = useCallback(
    (event: CasinoEvent) =>
      bookings.filter(
        item =>
          item.eventId === event.id && item.dateKey === eventDateKey(event),
      ).length,
    [bookings],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: CasinoEvent; index: number }) => (
      <ContentReveal delay={index < 4 ? index * 65 : 0}>
        <EventCard
          event={item}
          bookedSeats={seatsFor(item)}
          onPress={() =>
            navigation.navigate('EventDetail', { eventId: item.id })
          }
        />
      </ContentReveal>
    ),
    [navigation, seatsFor],
  );

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Events"
        subtitle={`${results.length} of 12 upcoming events`}
      />

      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={ListSeparator}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <EventFilterBar
              groups={groups}
              activeCount={count}
              onOpen={setOpenGroup}
              onReset={() => setFilters(emptyFilters)}
            />
            <View style={styles.summaryRow}>
              <Icon name="filter" size={s(14)} color={colors.textMuted} />
              <Text style={styles.summaryText}>
                {count === 0
                  ? 'All events · combine three filters to narrow the list'
                  : `${count} filter${count > 1 ? 's' : ''} applied`}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="events"
            title="No events match"
            message="Try another combination of category, date and format to see the programme."
          >
            <GradientButton
              label="Reset filters"
              variant="outline"
              onPress={() => setFilters(emptyFilters)}
            />
          </EmptyState>
        }
      />

      <BottomSheet
        visible={activeGroup != null}
        onClose={() => setOpenGroup(null)}
        title={activeGroup ? groupTitles[activeGroup.key] : ''}
        subtitle="Choose one option or clear this filter"
      >
        {activeGroup
          ? [null, ...activeGroup.options].map(option => {
              const selected = activeGroup.value === option;
              const label = option ?? 'Any';
              return (
                <Pressable
                  key={label}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => select(activeGroup.key, option)}
                  style={({ pressed }) => [
                    styles.option,
                    selected && styles.optionSelected,
                    pressed && styles.optionPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      selected && styles.optionLabelSelected,
                    ]}
                  >
                    {label}
                  </Text>
                  {selected ? (
                    <Icon name="check" size={s(16)} color={colors.emerald} />
                  ) : null}
                </Pressable>
              );
            })
          : null}
      </BottomSheet>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: layout.gutter,
    paddingBottom: vs(28),
  },
  header: {
    gap: s(10),
    paddingBottom: s(14),
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(7),
  },
  summaryText: {
    color: colors.textMuted,
    fontSize: typography.caption,
    flex: 1,
  },
  separator: {
    height: layout.gap + s(2),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(16),
    paddingVertical: s(15),
    borderRadius: layout.radiusMd,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
  },
  optionSelected: {
    backgroundColor: 'rgba(47,212,111,0.12)',
    borderColor: colors.borderStrong,
  },
  optionPressed: {
    opacity: 0.7,
  },
  optionLabel: {
    color: colors.textSoft,
    fontSize: typography.body,
    fontWeight: '600',
  },
  optionLabelSelected: {
    color: colors.text,
    fontWeight: '800',
  },
});
