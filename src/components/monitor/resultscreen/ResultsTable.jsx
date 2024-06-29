import React from 'react';
import Table from 'react-bootstrap/Table';

function ResultsTable({users}) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Username</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {users.map((item, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.username}</td>
            <td>{item.score}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ResultsTable;