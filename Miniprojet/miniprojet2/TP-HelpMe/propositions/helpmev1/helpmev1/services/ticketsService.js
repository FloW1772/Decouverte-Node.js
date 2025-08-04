const { EtatTicket } = require('../bo/Ticket');

let tickets = [
   {
      id: 1,
      titre: 'Ticket 1',
      auteur: { id: 2, name: 'Alice' },
      description: 'Description du ticket 1',
      creation: new Date('2025-06-07T15:30:00Z'),
      etat: EtatTicket.OUVERT,
   },
   {
      id: 2,
      titre: 'Ticket 2',
      auteur: { id: 3, name: 'Bob' },
      description: 'Description du ticket 2',
      creation: new Date('2025-06-07T15:35:00Z'),
      etat: EtatTicket.CLOS,
   },
   {
      id: 3,
      titre: 'Ticket 3',
      auteur: { id: 3, name: 'Bob' },
      description: 'Description du ticket 3',
      creation: new Date('2025-06-08T15:05:00Z'),
      etat: EtatTicket.OUVERT,
   },
];
let idx = 4;

exports.removeAllTickets = () => {
   tickets = [];
   idx = 1;
};

exports.setTickets = (newTickets) => {
   tickets = newTickets;
   idx = tickets[tickets.length - 1].id + 1;
};

exports.findTickets = (filtreEtat = EtatTicket.TOUS, tri = 'asc') => {
   let tabTickets = tickets.filter(
      (ticket) => filtreEtat == EtatTicket.TOUS || ticket.etat == filtreEtat,
   );

   if (tri === 'asc') {
      tabTickets.sort((a, b) => a.creation - b.creation);
   } else {
      tabTickets.sort((a, b) => b.creation - a.creation);
   }

   return tabTickets;
};

exports.findTicketById = (id) => {
   let ticket = tickets.find((ticket) => ticket.id == id);

   return { ...ticket }; //shallow copy de ticket
};

exports.deleteTicket = (id) => {
   tickets = tickets.filter((ticket) => ticket.id != id);
};

exports.addTicket = (titre, auteur, description) => {
   const creation = Date.now();
   const newTicket = {
      id: idx++,
      titre,
      auteur,
      description,
      creation,
      etat: EtatTicket.OUVERT,
   };
   tickets.push(newTicket);
   return newTicket;
};

exports.updateTicket = (id, titre, auteur, description, etat) => {
   let index = tickets.findIndex((ticket) => ticket.id == id);

   tickets[index] = {
      id: id,
      titre,
      auteur,
      description,
      creation: tickets[index].creation,
      etat: etat,
   };
};
