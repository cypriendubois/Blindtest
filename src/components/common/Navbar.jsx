import React, { useState } from 'react';
import { Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState();
  const handleSelect = (selectedKey) => {
    if (selectedKey === activeTab) {
      window.location.reload();
    } else {
      setActiveTab(selectedKey);
    }
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BootstrapNavbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto" activeKey={activeTab} onSelect={handleSelect}>
          <Nav.Item>
            <Nav.Link eventKey="" as={Link} to="/">Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="monitor" as={Link} to="/monitor">Monitor</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="player" as={Link} to="/player">Player</Nav.Link>
          </Nav.Item>
        </Nav>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
};

export default Navbar;
