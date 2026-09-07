import React, {useMemo, useRef, useState} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  FilterChip,
  GlassCard,
  GradientButton,
  Icon,
  ScreenContainer,
  ScreenHeader,
  SectionTitle,
} from '../../components';
import {menuSections} from '../../data/menu';
import {venueById} from '../../data/venues';
import {colors, layout, s, typography, vs} from '../../theme';
import type {RootStackParamList} from '../../navigation/types';
import type {MenuItem, MenuSectionId} from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Menu'>;

export const MenuScreen = ({navigation, route}: Props) => {
  const venue = route.params?.venueId
    ? venueById(route.params.venueId)
    : undefined;

  const available = useMemo(() => {
    const allowed = venue?.menuSections;
    if (!allowed?.length) {
      return menuSections;
    }
    return menuSections.filter(section => allowed.includes(section.id));
  }, [venue]);

  const [activeSection, setActiveSection] = useState<MenuSectionId>(
    (route.params?.sectionId as MenuSectionId) ?? available[0].id,
  );
  const scrollRef = useRef<ScrollView>(null);

  const section =
    available.find(item => item.id === activeSection) ?? available[0];

  const selectSection = (id: MenuSectionId) => {
    setActiveSection(id);
    scrollRef.current?.scrollTo({y: 0, animated: true});
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Menu"
        subtitle={venue ? venue.name : 'Emerald Restaurant selection'}
        onBack={navigation.goBack}
      />

      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}>
          {available.map(item => (
            <FilterChip
              key={item.id}
              label={item.title}
              active={item.id === section.id}
              onPress={() => selectSection(item.id)}
            />
          ))}
        </ScrollView>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <SectionTitle title={section.title} caption={section.subtitle} />

        {section.items.map((item, index) => (
          <MenuRow key={item.id} item={item} index={index + 1} />
        ))}

        <GlassCard style={styles.noteCard}>
          <Icon name="info" size={s(16)} color={colors.gold} />
          <Text style={styles.noteText}>
            Prices are shown in euro. Seasonal items and daily specialties may
            vary depending on availability.
          </Text>
        </GlassCard>

        {venue ? (
          <GradientButton
            label={`Open ${venue.name}`}
            variant="outline"
            icon="venues"
            onPress={() =>
              navigation.navigate('VenueDetail', {venueId: venue.id})
            }
          />
        ) : (
          <GradientButton
            label="Open Emerald Restaurant"
            variant="outline"
            icon="venues"
            onPress={() =>
              navigation.navigate('VenueDetail', {
                venueId: 'emerald-restaurant',
              })
            }
          />
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const MenuRow = ({item, index}: {item: MenuItem; index: number}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => setExpanded(current => !current)}
      style={({pressed}) => [styles.row, pressed && styles.pressed]}>
      <Image source={item.image} style={styles.rowImage} resizeMode="cover" />
      <LinearGradient
        colors={['rgba(6,9,7,0.15)', 'rgba(6,9,7,0.8)', 'rgba(6,9,7,0.98)']}
        locations={[0, 0.5, 1]}
        style={styles.rowOverlay}
      />
      <View style={styles.rowTop}>
        <View style={styles.rowIndex}>
          <Text style={styles.rowIndexText}>{index}</Text>
        </View>
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>€{item.price}</Text>
        </View>
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle} numberOfLines={2}>
          {item.name}
        </Text>
        <Text
          style={styles.rowIngredients}
          numberOfLines={expanded ? undefined : 2}>
          {item.ingredients}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tabsWrapper: {
    paddingBottom: s(12),
  },
  tabs: {
    flexDirection: 'row',
    gap: s(8),
    paddingHorizontal: layout.gutter,
  },
  scroll: {
    paddingHorizontal: layout.gutter,
    paddingBottom: vs(30),
    gap: layout.gap + s(2),
  },
  row: {
    height: vs(152),
    borderRadius: layout.radiusLg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.88,
  },
  rowImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  rowOverlay: {
    ...StyleSheet.absoluteFill,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: s(11),
  },
  rowIndex: {
    width: s(28),
    height: s(28),
    borderRadius: s(14),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6,9,7,0.7)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowIndexText: {
    color: colors.emeraldSoft,
    fontSize: typography.caption,
    fontWeight: '800',
  },
  priceTag: {
    paddingHorizontal: s(12),
    paddingVertical: s(6),
    borderRadius: layout.pill,
    backgroundColor: 'rgba(231,206,142,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(231,206,142,0.36)',
  },
  priceText: {
    color: colors.gold,
    fontSize: typography.bodySm,
    fontWeight: '800',
  },
  rowBody: {
    padding: s(14),
    gap: s(4),
  },
  rowTitle: {
    color: colors.text,
    fontSize: typography.h3,
    fontWeight: '800',
  },
  rowIngredients: {
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: typography.caption * 1.5,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  noteText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: typography.caption,
    lineHeight: typography.caption * 1.5,
  },
});
