import type {HallSector, Seat} from '../types';
import {seededPercent} from '../utils/hash';

export const hallSectors: HallSector[] = [
  {
    id: 'A',
    name: 'Sector A · Emerald Stage',
    note: 'Closest to the stage, premium service',
    rows: 3,
    seatsPerRow: 8,
    price: 120,
  },
  {
    id: 'B',
    name: 'Sector B · Main Floor',
    note: 'Central seating with full stage view',
    rows: 4,
    seatsPerRow: 10,
    price: 85,
  },
  {
    id: 'C',
    name: 'Sector C · Balcony',
    note: 'Elevated rows above the main floor',
    rows: 3,
    seatsPerRow: 12,
    price: 55,
  },
];

export const sectorById = (id: string) =>
  hallSectors.find(sector => sector.id === id);

const OCCUPANCY_THRESHOLD = 26;

export const isSeatTaken = (
  eventId: string,
  dateKeyValue: string,
  seatId: string,
) => seededPercent(`${eventId}|${dateKeyValue}|${seatId}`) < OCCUPANCY_THRESHOLD;

export const buildSectorSeats = (
  sector: HallSector,
  eventId: string,
  dateKeyValue: string,
): Seat[][] => {
  const rows: Seat[][] = [];
  for (let row = 1; row <= sector.rows; row += 1) {
    const seats: Seat[] = [];
    for (let number = 1; number <= sector.seatsPerRow; number += 1) {
      const id = `${sector.id}-${row}-${number}`;
      seats.push({
        id,
        sectorId: sector.id,
        sectorName: sector.name,
        row,
        number,
        price: sector.price,
        taken: isSeatTaken(eventId, dateKeyValue, id),
      });
    }
    rows.push(seats);
  }
  return rows;
};
