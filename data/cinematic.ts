/** Time is expressed in timeline units; reading holds are intentionally longer than flights. */
export const cinematicTiming = {
  duration: 21,
  worldEntry: 2.2,
  pullback: 17.6,
  chapters: [
    { arrival: 3.4, departure: 5.0, point: [0.46, 0.79], zoom: 2.1, side: 'right' },
    { arrival: 6.4, departure: 8.0, point: [0.30, 0.55], zoom: 2.25, side: 'right' },
    { arrival: 9.4, departure: 11.0, point: [0.70, 0.40], zoom: 2.25, side: 'left' },
    { arrival: 12.4, departure: 14.0, point: [0.34, 0.29], zoom: 2.35, side: 'right' },
    { arrival: 15.4, departure: 17.4, point: [0.55, 0.18], zoom: 2.0, side: 'left' },
  ],
} as const;
