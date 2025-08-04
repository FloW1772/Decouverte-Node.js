let app = require('../app');

let { format } = require('date-fns');

let ticketsService = require('../services/ticketsService');

function toTicketDto(ticket) {
   let copie = { ...ticket };
   copie.creation_formatted = format(ticket.creation, 'dd/MM/yyyy HH:mm');
   if (ticket.description.length > 50) {
      copie.description = ticket.description.substring(0, 50) + '...';
   }
   return copie;
}

app.get(['/', '/tickets'], (req, res) => {
   let tickets = ticketsService.findTickets();

   for (let i = 0; i < tickets.length; i++) {
      tickets[i] = toTicketDto(tickets[i]);
   }

   res.render('liste-tickets', { tickets, session: req.session });
});
