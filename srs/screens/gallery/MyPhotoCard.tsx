import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from '../../components';
import {eventById} from '../../data/events';
import {colors, layout, s, typography} from '../../theme';
import type {UserPhoto} from '../../types';
import {galleryColumnWidth} from './OfficialPhotoCard';

interface MyPhotoCardProps {
  photo: UserPhoto;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const MyPhotoCard = ({
  photo,
  onPress,
  onEdit,
  onDelete,
}: MyPhotoCardProps) => {
  const linked = photo.eventId ? eventById(photo.eventId) : null;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({pressed}) => [styles.root, pressed && styles.pressed]}>
      <Image source={{uri: photo.uri}} style={styles.image} resizeMode="cover" />
      <LinearGradient
        colors={['rgba(6,9,7,0.1)', 'rgba(6,9,7,0.72)', 'rgba(6,9,7,0.98)']}
        locations={[0, 0.5, 1]}
        style={styles.overlay}
      />

      <View style={styles.tools}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Edit photo"
          hitSlop={layout.hitSlop}
          onPress={onEdit}
          style={({pressed}) => [styles.tool, pressed && styles.pressed]}>
          <Icon name="edit" size={s(13)} color={colors.textSoft} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete photo"
          hitSlop={layout.hitSlop}
          onPress={onDelete}
          style={({pressed}) => [
            styles.tool,
            styles.toolDanger,
            pressed && styles.pressed,
          ]}>
          <Icon name="trash" size={s(13)} color={colors.danger} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {photo.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {linked ? linked.title : 'No linked event'}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    width: galleryColumnWidth,
    height: galleryColumnWidth * 1.34,
    borderRadius: layout.radiusMd,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.82,
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  tools: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: s(6),
    padding: s(8),
  },
  tool: {
    width: s(28),
    height: s(28),
    borderRadius: s(14),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6,9,7,0.72)',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
  },
  toolDanger: {
    borderColor: 'rgba(229,87,78,0.32)',
  },
  content: {
    padding: s(11),
    gap: s(2),
  },
  title: {
    color: colors.text,
    fontSize: typography.bodySm,
    fontWeight: '800',
  },
  meta: {
    color: colors.emeraldSoft,
    fontSize: typography.micro,
    fontWeight: '600',
  },
});
