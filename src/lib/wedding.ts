/**
 * Central place to edit the couple's details.
 * All placeholder values — update before sending invitations.
 */
export const WEDDING = {
  bride: "Sophia",
  groom: "Julian",
  /** Countdown target (local time). Keep in sync with the copy below. */
  date: new Date("2027-06-19T16:00:00"),
  dateLabel: "Saturday, June 19, 2027",
  timeLabel: "4 o'clock in the afternoon",
  venue: "Villa Serenella",
  location: "Tuscany, Italy",
  email: "hello@julianandsophia.com",
} as const;

export const EVENTS = [
  {
    name: "The Ceremony",
    time: "4:00 PM",
    timeDetail: "Saturday afternoon",
    location: "The Rose Garden Terrace",
    venueDetail: "Villa Serenella, Tuscany",
    dressCode: "Garden Formal",
    dressNote: "Soft, muted tones are encouraged",
    mapQuery: "Villa Serenella, Tuscany, Italy",
  },
  {
    name: "Cocktail Hour",
    time: "6:00 PM",
    timeDetail: "Golden hour on the lawn",
    location: "The Cypress Lawn",
    venueDetail: "Villa Serenella, Tuscany",
    dressCode: "Garden Formal",
    dressNote: "Aperitivi & passed canapés served",
    mapQuery: "Villa Serenella, Tuscany, Italy",
  },
  {
    name: "The Reception",
    time: "7:30 PM",
    timeDetail: "Dinner & dancing under the stars",
    location: "The Grand Orangery",
    venueDetail: "Villa Serenella, Tuscany",
    dressCode: "Black Tie Optional",
    dressNote: "Late-night dessert bar to follow",
    mapQuery: "Villa Serenella, Tuscany, Italy",
  },
] as const;
