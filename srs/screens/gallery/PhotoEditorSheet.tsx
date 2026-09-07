import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  BottomSheet,
  FilterChip,
  GradientButton,
  TextField,
} from '../../components';
import {events} from '../../data/events';
import {colors, layout, s, typography} from '../../theme';
import type {UserPhoto} from '../../types';

interface PhotoDraft {
  uri: string;
  title: string;
  note: string;
  eventId: string | null;
}

interface PhotoEditorSheetProps {
  visible: boolean;
  photo: UserPhoto | null;
  draftUri: string | null;
  onClose: () => void;
  onSubmit: (draft: PhotoDraft) => void;
}

export const PhotoEditorSheet = ({
  visible,
  photo,
  draftUri,
  onClose,
  onSubmit,
}: PhotoEditorSheetProps) => {
  const uri = photo?.uri ?? draftUri ?? '';
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [eventId, setEventId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) {
      return;
    }
    setTitle(photo?.title ?? '');
    setNote(photo?.note ?? '');
    setEventId(photo?.eventId ?? null);
    setError('');
  }, [photo, visible]);

  const submit = () => {
    if (!title.trim()) {
      setError('Add a short title for this photo');
      return;
    }
    onSubmit({uri, title: title.trim(), note: note.trim(), eventId});
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={photo ? 'Edit photo' : 'Add photo'}
      subtitle="Fill in the details and link the photo to an event"
      footer={
        <>
          <GradientButton
            label={photo ? 'Save changes' : 'Add to my photos'}
            icon="check"
            onPress={submit}
          />
          <GradientButton label="Cancel" variant="ghost" onPress={onClose} />
        </>
      }>
      {uri ? (
        <View style={styles.preview}>
          <Image source={{uri}} style={styles.previewImage} resizeMode="cover" />
        </View>
      ) : null}

      <TextField
        label="Title"
        value={title}
        onChangeText={text => {
          setTitle(text);
          setError('');
        }}
        placeholder="Enter a title"
        maxLength={60}
        error={error || undefined}
      />

      <TextField
        label="Note"
        value={note}
        onChangeText={setNote}
        placeholder="Add your own note"
        multiline
        maxLength={200}
      />

      <View style={styles.eventBlock}>
        <Text style={styles.eventLabel}>Linked event</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eventRow}>
          <FilterChip
            compact
            label="No event"
            active={eventId === null}
            onPress={() => setEventId(null)}
          />
          {events.map(event => (
            <FilterChip
              key={event.id}
              compact
              label={event.title}
              active={eventId === event.id}
              onPress={() => setEventId(event.id)}
            />
          ))}
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  preview: {
    height: s(170),
    borderRadius: layout.radiusMd,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderNeutral,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  eventBlock: {
    gap: s(8),
  },
  eventLabel: {
    color: colors.textMuted,
    fontSize: typography.micro,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  eventRow: {
    flexDirection: 'row',
    gap: s(7),
    paddingRight: s(4),
  },
});
