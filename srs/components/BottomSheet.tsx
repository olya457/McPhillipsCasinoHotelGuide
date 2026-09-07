import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors, layout, s, screenHeight, typography} from '../theme';
import {Icon} from './Icon';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const BottomSheet = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: BottomSheetProps) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={styles.backdrop}
          onPress={onClose}
        />
        <LinearGradient
          colors={['rgba(22,34,27,0.99)', 'rgba(6,9,7,1)']}
          style={[styles.sheet, {paddingBottom: insets.bottom + s(16)}]}>
          <View style={styles.grabber} />
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>{title}</Text>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={layout.hitSlop}
              onPress={onClose}
              style={({pressed}) => [styles.close, pressed && styles.pressed]}>
              <Icon name="close" size={s(16)} color={colors.textSoft} />
            </Pressable>
          </View>
          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(2,4,3,0.72)',
  },
  sheet: {
    borderTopLeftRadius: layout.radiusXl,
    borderTopRightRadius: layout.radiusXl,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.border,
    paddingHorizontal: layout.gutter,
    paddingTop: s(10),
    maxHeight: screenHeight * 0.86,
  },
  grabber: {
    alignSelf: 'center',
    width: s(46),
    height: s(4),
    borderRadius: s(2),
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: s(14),
    gap: s(12),
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: s(3),
    color: colors.textMuted,
    fontSize: typography.bodySm,
  },
  close: {
    width: s(34),
    height: s(34),
    borderRadius: s(17),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
  },
  pressed: {
    opacity: 0.6,
  },
  body: {
    marginTop: s(14),
    flexGrow: 0,
  },
  bodyContent: {
    paddingBottom: s(6),
    gap: layout.gap,
  },
  footer: {
    marginTop: s(14),
    gap: s(10),
  },
});
