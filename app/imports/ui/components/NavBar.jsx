import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill, ChatQuote } from 'react-bootstrap-icons';

const NavBar = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { currentUser } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
  }), []);

  return (
    <Navbar bg="dark" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <h4>Repport <ChatQuote /></h4>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-start">
            {currentUser ? ([
              // nothing here so far
            ]) : ''}
            {Roles.userIsInRole(Meteor.userId(), 'org') ? (
              <>
                <Nav.Link id="report-debris-nav" as={NavLink} to="/report" key="report">Report Debris</Nav.Link>
                <Nav.Link id="list-stuff-nav" as={NavLink} to="/reported" key="reported">Reported</Nav.Link>
                <Nav.Link id="list-stuff-nav" as={NavLink} to="/claimed" key="claimed">Claimed</Nav.Link>
                <Nav.Link id="list-stuff-nav" as={NavLink} to="/stored" key="stored">Stored</Nav.Link>
                <Nav.Link id="list-stuff-nav" as={NavLink} to="/distributed" key="distributed">Distributed</Nav.Link>
              </>
            ) : ''}
            {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
              <Nav.Link id="list-stuff-admin-nav" as={NavLink} to="/analysis" key="analysis">Analysis</Nav.Link>
            ) : ''}
          </Nav>
          <Nav className="justify-content-end">
            {Roles.userIsInRole(Meteor.userId(), 'org') ? (
              <Nav.Link id="list-stuff-admin-nav" as={NavLink} to="/landing-organization" key="org">Organization Home</Nav.Link>
            ) : ''}
            {currentUser === '' ? (
              <NavDropdown id="login-dropdown" title="Login">
                <NavDropdown.Item id="login-dropdown-sign-in" as={NavLink} to="/signin">
                  <PersonFill /> Sign in
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-up" as={NavLink} to="/signup">
                  <PersonPlusFill /> Sign up
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id="navbar-current-user" title={currentUser}>
                <NavDropdown.Item id="navbar-profile" as={NavLink} to="/profile/:_id">
                  <PersonFill /> Profile
                </NavDropdown.Item>
                <NavDropdown.Item id="navbar-sign-out" as={NavLink} to="/signout">
                  <BoxArrowRight />
                  {' '}
                  Sign
                  out
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
