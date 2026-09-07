import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  type ImagePickerResponse,
} from 'react-native-image-picker';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RouteProp} from '@react-navigation/native';
import {
  BottomSheet,
  EmptyState,
  GlassCard,
  GradientButton,
  Icon,
  ScreenContainer,
  ScreenHeader,
  Segmented,
} from '../../components';
import {events, eventById} from '../../data/events';
import {venueName} from '../../data/venues';
import {colors, layout, s, typography, vs} from '../../theme';
import {useAppState} from '../../store/AppStateContext';
import {formatFullDate} from '../../utils/date';
import {eventDate} from '../../utils/events';
import type {RootStackParamList, TabParamList} from '../../navigation/types';
import type {UserPhoto} from '../../types';
import {MyPhotoCard} from './MyPhotoCard';
import {OfficialPhotoCard, galleryGridGap} from './OfficialPhotoCard';
import {PhotoEditorSheet} from './PhotoEditorSheet';
import {PhotoViewer, type ViewerContent} from './PhotoViewer';

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<TabParamList, 'Gallery'>;

const tabs = [
  {key: 'official', label: 'Official photos'},
  {key: 'mine', label: 'My photos'},
];

export const GalleryScreen = () => {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<Route>();
  const {photos, addPhoto, updatePhoto, removePhoto} = useAppState();
  const [tab, setTab] = useState<'official' | 'mine'>('official');
  const [viewer, setViewer] = useState<ViewerContent | null>(null);
  const [sourceSheet, setSourceSheet] = useState(false);
  const [draftUri, setDraftUri] = useState<string | null>(null);
  const [editing, setEditing] = useState<UserPhoto | null>(null);
  const [editorVisible, setEditorVisible] = useState(false);

  useEffect(() => {
    if (route.params?.tab) {
      setTab(route.params.tab);
    }
  }, [route.params?.tab]);

  const handlePicked = useCallback((response: ImagePickerResponse) => {
    if (response.didCancel) {
      return;
    }
    if (response.errorCode) {
      Alert.alert(
        'Photo not available',
        response.errorMessage ??
          'Access to the photo library or camera was not granted.',
      );
      return;
    }
    const uri = response.assets?.[0]?.uri;
    if (!uri) {
      return;
    }
    setEditing(null);
    setDraftUri(uri);
    setEditorVisible(true);
  }, []);

  const pickFromLibrary = useCallback(async () => {
    setSourceSheet(false);
    const response = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.9,
      selectionLimit: 1,
    });
    handlePicked(response);
  }, [handlePicked]);

  const pickFromCamera = useCallback(async () => {
    setSourceSheet(false);
    const response = await launchCamera({
      mediaType: 'photo',
      quality: 0.9,
      saveToPhotos: false,
    });
    handlePicked(response);
  }, [handlePicked]);

  const confirmDelete = useCallback(
    (photo: UserPhoto) => {
      Alert.alert(
        'Delete photo',
        `Remove “${photo.title}” from your gallery?`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              removePhoto(photo.id);
              setViewer(null);
            },
          },
        ],
      );
    },
    [removePhoto],
  );

  const openMyPhoto = useCallback(
    (photo: UserPhoto) => {
      const linked = photo.eventId ? eventById(photo.eventId) : null;
      setViewer({
        source: {uri: photo.uri},
        title: photo.title,
        subtitle: linked
          ? `${linked.title} · ${formatFullDate(eventDate(linked))}`
          : 'No linked event',
        note: photo.note || undefined,
        tags: linked ? [linked.category, linked.format] : ['My photo'],
        primaryLabel: linked ? 'Open event' : undefined,
        onPrimary: linked
          ? () => {
              setViewer(null);
              navigation.navigate('EventDetail', {eventId: linked.id});
            }
          : undefined,
        secondaryLabel: 'Edit details',
        onSecondary: () => {
          setViewer(null);
          setEditing(photo);
          setDraftUri(null);
          setEditorVisible(true);
        },
        destructiveLabel: 'Delete photo',
        onDestructive: () => confirmDelete(photo),
      });
    },
    [confirmDelete, navigation],
  );

  const openOfficial = useCallback(
    (eventId: string) => {
      const event = eventById(eventId);
      if (!event) {
        return;
      }
      setViewer({
        source: event.image,
        title: event.title,
        subtitle: `${formatFullDate(eventDate(event))} · ${event.time} · ${venueName(
          event.venueId,
        )}`,
        note: event.short,
        tags: [event.category, event.format],
        primaryLabel: 'Open event',
        onPrimary: () => {
          setViewer(null);
          navigation.navigate('EventDetail', {eventId: event.id});
        },
      });
    },
    [navigation],
  );

  const submitPhoto = useCallback(
    (draft: {
      uri: string;
      title: string;
      note: string;
      eventId: string | null;
    }) => {
      if (editing) {
        updatePhoto(editing.id, {
          title: draft.title,
          note: draft.note,
          eventId: draft.eventId,
        });
      } else {
        addPhoto({
          uri: draft.uri,
          title: draft.title,
          note: draft.note,
          eventId: draft.eventId,
        });
      }
      setEditorVisible(false);
      setEditing(null);
      setDraftUri(null);
      setTab('mine');
    },
    [addPhoto, editing, updatePhoto],
  );

  const officialCount = events.length;

  const sortedPhotos = useMemo(
    () => [...photos].sort((a, b) => b.createdAt - a.createdAt),
    [photos],
  );

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Gallery"
        subtitle={
          tab === 'official'
            ? `${officialCount} official photos`
            : `${sortedPhotos.length} of my photos`
        }
        actionIcon={tab === 'mine' ? 'plus' : undefined}
        onAction={() => setSourceSheet(true)}
      />

      <View style={styles.tabs}>
        <Segmented
          options={tabs}
          value={tab}
          onChange={key => setTab(key as 'official' | 'mine')}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        {tab === 'official' ? (
          <>
            <GlassCard style={styles.infoCard}>
              <Icon name="info" size={s(16)} color={colors.emerald} />
              <Text style={styles.infoText}>
                Official photos of every upcoming event, with the event name,
                date and basic information.
              </Text>
            </GlassCard>
            <View style={styles.grid}>
              {events.map(event => (
                <OfficialPhotoCard
                  key={event.id}
                  event={event}
                  onPress={() => openOfficial(event.id)}
                />
              ))}
            </View>
          </>
        ) : sortedPhotos.length === 0 ? (
          <EmptyState
            icon="camera"
            title="No photos yet"
            message="Add your own photos of the evening and link each one to a specific event.">
            <GradientButton
              label="Add first photo"
              icon="plus"
              onPress={() => setSourceSheet(true)}
            />
          </EmptyState>
        ) : (
          <>
            <GradientButton
              label="Add photo"
              icon="plus"
              onPress={() => setSourceSheet(true)}
              style={styles.addButton}
            />
            <View style={styles.grid}>
              {sortedPhotos.map(photo => (
                <MyPhotoCard
                  key={photo.id}
                  photo={photo}
                  onPress={() => openMyPhoto(photo)}
                  onEdit={() => {
                    setEditing(photo);
                    setDraftUri(null);
                    setEditorVisible(true);
                  }}
                  onDelete={() => confirmDelete(photo)}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <BottomSheet
        visible={sourceSheet}
        onClose={() => setSourceSheet(false)}
        title="Add a photo"
        subtitle="Choose where the photo comes from"
        footer={
          <GradientButton
            label="Cancel"
            variant="ghost"
            onPress={() => setSourceSheet(false)}
          />
        }>
        <GradientButton
          label="Choose from library"
          icon="gallery"
          onPress={pickFromLibrary}
        />
        <GradientButton
          label="Take a photo"
          variant="outline"
          icon="camera"
          onPress={pickFromCamera}
        />
      </BottomSheet>

      <PhotoEditorSheet
        visible={editorVisible}
        photo={editing}
        draftUri={draftUri}
        onClose={() => {
          setEditorVisible(false);
          setEditing(null);
          setDraftUri(null);
        }}
        onSubmit={submitPhoto}
      />

      <PhotoViewer content={viewer} onClose={() => setViewer(null)} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  tabs: {
    paddingHorizontal: layout.gutter,
    paddingBottom: s(14),
  },
  scroll: {
    paddingHorizontal: layout.gutter,
    paddingBottom: vs(30),
    gap: layout.gap + s(2),
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  infoText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: typography.bodySm,
    lineHeight: typography.bodySm * 1.45,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: galleryGridGap,
  },
  addButton: {
    marginBottom: s(2),
  },
});
