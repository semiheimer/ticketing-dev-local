import Link from "next/link";

const LandingPage = ({ tickets = [] }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href={`/tickets/${ticket.id}`}>View</Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h1>Tickets</h1>
        <Link className='btn btn-primary float-end' href='/tickets/new'>
          Add New Ticket
        </Link>
      </div>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};

export default LandingPage;
