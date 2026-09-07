import {buildSectorSeats, hallSectors, isSeatTaken, sectorById} from '../data/hall';

describe('hall plan', () => {
  const sector = hallSectors[1];

  it('builds every row and seat of a sector', () => {
    const rows = buildSectorSeats(sector, 'emerald-night-gala', '2026-09-07');
    expect(rows).toHaveLength(sector.rows);
    rows.forEach((seats, index) => {
      expect(seats).toHaveLength(sector.seatsPerRow);
      seats.forEach((seat, seatIndex) => {
        expect(seat.row).toBe(index + 1);
        expect(seat.number).toBe(seatIndex + 1);
        expect(seat.sectorId).toBe(sector.id);
        expect(seat.price).toBe(sector.price);
      });
    });
  });

  it('keeps occupancy stable for the same event and date', () => {
    const first = buildSectorSeats(sector, 'roulette-masters-cup', '2026-09-08');
    const second = buildSectorSeats(sector, 'roulette-masters-cup', '2026-09-08');
    expect(first.flat().map(seat => seat.taken)).toEqual(
      second.flat().map(seat => seat.taken),
    );
  });

  it('changes occupancy for another date', () => {
    const monday = buildSectorSeats(sector, 'roulette-masters-cup', '2026-09-08');
    const tuesday = buildSectorSeats(sector, 'roulette-masters-cup', '2026-09-09');
    expect(monday.flat().map(seat => seat.taken)).not.toEqual(
      tuesday.flat().map(seat => seat.taken),
    );
  });

  it('leaves free seats available in every sector', () => {
    hallSectors.forEach(item => {
      const seats = buildSectorSeats(item, 'emerald-night-gala', '2026-09-07').flat();
      const free = seats.filter(seat => !seat.taken);
      expect(free.length).toBeGreaterThan(seats.length / 2);
    });
  });

  it('resolves a sector by id and marks seats consistently', () => {
    expect(sectorById('C')?.seatsPerRow).toBe(12);
    expect(isSeatTaken('emerald-night-gala', '2026-09-07', 'C-1-1')).toBe(
      isSeatTaken('emerald-night-gala', '2026-09-07', 'C-1-1'),
    );
  });
});
