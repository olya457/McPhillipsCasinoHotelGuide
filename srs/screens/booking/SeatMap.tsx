import React, {useMemo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors, layout, s, screenWidth, typography} from '../../theme';
import {buildSectorSeats, hallSectors} from '../../data/hall';
import type {Seat} from '../../types';

interface SeatMapProps {
  eventId: string;
  dateKeyValue: string;
  allowedSectors: string[];
  selectedSeatId: string | null;
  isBooked: (seatId: string) => boolean;
  onSelectSeat: (seat: Seat) => void;
}

const ROW_LABEL = s(20);
const SEAT_GAP = s(4);
const CARD_PADDING = (layout.gutter - 2) * 2;
const MAX_SEATS = Math.max(...hallSectors.map(sector => sector.seatsPerRow));

const usableWidth =
  screenWidth - layout.gutter * 2 - CARD_PADDING - ROW_LABEL * 2;
const rawSize = (usableWidth - SEAT_GAP * (MAX_SEATS - 1)) / MAX_SEATS;
const SEAT_SIZE = Math.max(s(18), Math.min(s(30), Math.floor(rawSize)));
const SEAT_HIT_SLOP = {top: 4, bottom: 4, left: 2, right: 2};

export const SeatMap = ({
  eventId,
  dateKeyValue,
  allowedSectors,
  selectedSeatId,
  isBooked,
  onSelectSeat,
}: SeatMapProps) => {
  const sectors = useMemo(
    () =>
      hallSectors
        .filter(sector => allowedSectors.includes(sector.id))
        .map(sector => ({
          sector,
          rows: buildSectorSeats(sector, eventId, dateKeyValue),
        })),
    [allowedSectors, dateKeyValue, eventId],
  );

  return (
    <View>
      <LinearGradient
        colors={['rgba(47,212,111,0.35)', 'rgba(47,212,111,0.05)']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.stage}>
        <Text style={styles.stageLabel}>Stage</Text>
      </LinearGradient>

      {sectors.map(({sector, rows}) => (
        <View key={sector.id} style={styles.sector}>
          <View style={styles.sectorHead}>
            <Text style={styles.sectorName} numberOfLines={1}>
              {sector.name}
            </Text>
            <Text style={styles.sectorPrice}>€{sector.price}</Text>
          </View>
          <Text style={styles.sectorNote}>{sector.note}</Text>

          {rows.map((seats, rowIndex) => (
            <View key={`${sector.id}-${rowIndex}`} style={styles.row}>
              <Text style={styles.rowLabel}>{rowIndex + 1}</Text>
              <View style={styles.seats}>
                {seats.map(seat => {
                  const mine = isBooked(seat.id);
                  const selected = seat.id === selectedSeatId;
                  const disabled = seat.taken || mine;
                  return (
                    <Pressable
                      key={seat.id}
                      accessibilityRole="button"
                      accessibilityLabel={`Sector ${seat.sectorId}, row ${seat.row}, seat ${seat.number}`}
                      accessibilityState={{disabled, selected}}
                      hitSlop={SEAT_HIT_SLOP}
                      onPress={disabled ? undefined : () => onSelectSeat(seat)}
                      style={[
                        styles.seat,
                        seat.taken && styles.seatTaken,
                        mine && styles.seatMine,
                        selected && styles.seatSelected,
                      ]}>
                      <Text
                        style={[
                          styles.seatLabel,
                          seat.taken && styles.seatLabelTaken,
                          (selected || mine) && styles.seatLabelStrong,
                        ]}>
                        {seat.number}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={styles.rowLabel}>{rowIndex + 1}</Text>
            </View>
          ))}
        </View>
      ))}

      <View style={styles.legend}>
        <LegendItem style={styles.seatFreeSample} label="Free" />
        <LegendItem style={styles.seatTaken} label="Taken" />
        <LegendItem style={styles.seatSelected} label="Selected" />
        <LegendItem style={styles.seatMine} label="Yours" />
      </View>
    </View>
  );
};

const LegendItem = ({style, label}: {style: object; label: string}) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendSwatch, style]} />
    <Text style={styles.legendLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  stage: {
    marginHorizontal: ROW_LABEL,
    height: s(30),
    borderRadius: s(15),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  stageLabel: {
    color: colors.emeraldSoft,
    fontSize: typography.micro,
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontWeight: '800',
  },
  sector: {
    marginTop: s(18),
  },
  sectorHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: s(8),
  },
  sectorName: {
    color: colors.text,
    fontSize: typography.bodySm,
    fontWeight: '800',
    flexShrink: 1,
  },
  sectorPrice: {
    color: colors.gold,
    fontSize: typography.bodySm,
    fontWeight: '800',
  },
  sectorNote: {
    marginTop: s(2),
    color: colors.textDim,
    fontSize: typography.caption,
    marginBottom: s(9),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SEAT_GAP + s(1),
  },
  rowLabel: {
    width: ROW_LABEL,
    textAlign: 'center',
    color: colors.textDim,
    fontSize: typography.micro,
    fontWeight: '700',
  },
  seats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SEAT_GAP,
  },
  seat: {
    width: SEAT_SIZE,
    height: SEAT_SIZE,
    borderRadius: s(5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.seatFree,
    borderWidth: 1,
    borderColor: colors.seatFreeBorder,
  },
  seatFreeSample: {
    backgroundColor: colors.seatFree,
    borderWidth: 1,
    borderColor: colors.seatFreeBorder,
  },
  seatTaken: {
    backgroundColor: colors.seatTaken,
    borderColor: colors.seatTakenBorder,
  },
  seatSelected: {
    backgroundColor: colors.seatSelected,
    borderColor: colors.seatSelected,
  },
  seatMine: {
    backgroundColor: colors.seatMine,
    borderColor: colors.seatMine,
  },
  seatLabel: {
    color: colors.emeraldSoft,
    fontSize: typography.micro,
    fontWeight: '700',
  },
  seatLabelTaken: {
    color: 'rgba(240,154,147,0.9)',
  },
  seatLabelStrong: {
    color: '#04170C',
    fontWeight: '800',
  },
  legend: {
    marginTop: s(18),
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(14),
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  legendSwatch: {
    width: s(14),
    height: s(14),
    borderRadius: s(4),
  },
  legendLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontWeight: '600',
  },
});
