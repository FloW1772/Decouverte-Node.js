const { EtatTicket } = require('../bo/Ticket');

let tickets = [
   {
      _id: 1,
      titre: 'Ticket 1',
      auteur: { _id: 2, name: 'Alice', role: 1 },
      description: 'Description du ticket 1',
      creation: new Date('2025-06-07T15:30:00Z'),
      etat: EtatTicket.OUVERT,
   },
   {
      _id: 2,
      titre: 'Ticket 2',
      auteur: { _id: 3, name: 'Bob', role: 1 },
      description: 'Description du ticket 2',
      creation: new Date('2025-06-07T15:35:00Z'),
      etat: EtatTicket.CLOS,
   },
   {
      _id: 3,
      titre: 'Ticket 3',
      auteur: { _id: 3, name: 'Bob', role: 1 },
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
   idx = tickets[tickets.length - 1]._id + 1;
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
   let ticket = tickets.find((ticket) => ticket._id == id);

   return { ...ticket }; //shallow copy
};

exports.deleteTicket = (id) => {
   tickets = tickets.filter((ticket) => ticket._id != id);
};

exports.addTicket = (titre, auteur, description) => {
   const creation = Date.now();
   const newTicket = {
      _id: idx++,
      titre,
      auteur,
      description,
      creation,
      etat: EtatTicket.OUVERT,
   };
   tickets.push(newTicket);
   return newTicket;
};

exports.updateTicket = (id, titre,  description, etat) => {
   let index = tickets.findIndex((ticket) => ticket._id == id);

   tickets[index] = {
      _id: id,
      titre,
      auteur: tickets[index].auteur,
      description,
      creation: tickets[index].creation,
      etat: etat!=undefined?etat:tickets[index].etat,
   };
};
