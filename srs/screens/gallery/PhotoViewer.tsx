import React from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {GradientButton, Icon, TagPill} from '../../components';
import {colors, layout, s, typography} from '../../theme';

export interface ViewerContent {
  source: ImageSourcePropType;
  title: string;
  subtitle?: string;
  note?: string;
  tags?: string[];
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  destructiveLabel?: string;
  onDestructive?: () => void;
}

interface PhotoViewerProps {
  content: ViewerContent | null;
  onClose: () => void;
}

export const PhotoViewer = ({content, onClose}: PhotoViewerProps) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={content != null}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.root}>
        {content ? (
          <>
            <Image
              source={content.source}
              style={styles.image}
              resizeMode="contain"
            />
            <LinearGradient
              colors={['rgba(4,7,5,0.92)', 'rgba(4,7,5,0.2)']}
              style={[styles.topScrim, {paddingTop: insets.top + s(10)}]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                hitSlop={layout.hitSlop}
                onPress={onClose}
                style={({pressed}) => [styles.close, pressed && styles.pressed]}>
                <Icon name="close" size={s(18)} color={colors.textSoft} />
              </Pressable>
            </LinearGradient>

            <LinearGradient
              colors={['rgba(4,7,5,0)', 'rgba(4,7,5,0.85)', 'rgba(4,7,5,0.99)']}
              style={[
                styles.bottomScrim,
                {paddingBottom: insets.bottom + s(18)},
              ]}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.info}>
                {content.tags?.length ? (
                  <View style={styles.tags}>
                    {content.tags.map(tag => (
                      <TagPill key={tag} label={tag} tone="emerald" />
                    ))}
                  </View>
                ) : null}
                <Text style={styles.title}>{content.title}</Text>
                {content.subtitle ? (
                  <Text style={styles.subtitle}>{content.subtitle}</Text>
                ) : null}
                {content.note ? (
                  <Text style={styles.note}>{content.note}</Text>
                ) : null}

                <View style={styles.actions}>
                  {content.primaryLabel && content.onPrimary ? (
                    <GradientButton
                      label={content.primaryLabel}
                      onPress={content.onPrimary}
                    />
                  ) : null}
                  {content.secondaryLabel && content.onSecondary ? (
                    <GradientButton
                      label={content.secondaryLabel}
                      variant="outline"
                      icon="edit"
                      onPress={content.onSecondary}
                    />
                  ) : null}
                  {content.destructiveLabel && content.onDestructive ? (
                    <GradientButton
                      label={content.destructiveLabel}
                      variant="danger"
                      icon="trash"
                      onPress={content.onDestructive}
                    />
                  ) : null}
                </View>
              </ScrollView>
            </LinearGradient>
          </>
        ) : null}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(4,7,5,0.98)',
    justifyContent: 'center',
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  topScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: layout.gutter,
    paddingBottom: s(20),
    alignItems: 'flex-end',
  },
  close: {
    width: s(38),
    height: s(38),
    borderRadius: s(19),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6,9,7,0.7)',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
  },
  pressed: {
    opacity: 0.65,
  },
  bottomScrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: s(40),
    paddingHorizontal: layout.gutter,
    maxHeight: '68%',
  },
  info: {
    gap: s(7),
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
  },
  title: {
    color: colors.text,
    fontSize: typography.h1,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.gold,
    fontSize: typography.bodySm,
    fontWeight: '700',
  },
  note: {
    color: colors.textMuted,
    fontSize: typography.bodySm,
    lineHeight: typography.bodySm * 1.5,
  },
  actions: {
    marginTop: s(12),
    gap: s(9),
  },
});
