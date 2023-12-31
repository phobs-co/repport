import React, { useState } from 'react';
import { Accounts } from 'meteor/accounts-base';
import PropTypes from 'prop-types';
import { Link, Navigate } from 'react-router-dom';
import { Alert, Card, Col, Container, Row } from 'react-bootstrap';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, ErrorsField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { Profiles } from '../../api/profile/Profiles';

/**
 * SignUp component is similar to signin component, but we create a new user instead.
 */
const SignUpOrganization = ({ location }) => {
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToRef] = useState(false);

  const schema = new SimpleSchema({
    organization: String,
    email: String,
    password: String,
  });
  const bridge = new SimpleSchema2Bridge(schema);

  /* Handle SignUp submission. Create user account and a profile entry, then redirect to the home page. */
  const submit = (doc) => {
    const { organization, email, password } = doc;
    const username = email;
    Accounts.createUser({ username, organization, email, password }, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setError('');
        setRedirectToRef(true);

        const image = '/images/noTextLogoPNG.png';
        const firstName = 'Team';
        const lastName = 'BOPS';
        const age = '2023';
        const bio = 'We are bops.';
        const owner = username;

        Profiles.collection.insert({ image, firstName, lastName, age, bio, owner });
      }
    });
  };

  /* Display the signup form. Redirect to add page after successful registration and login. */
  const { from } = location?.state || { from: { pathname: '/organization-landing' } };
  // if correct authentication, redirect to from: page instead of signup screen
  if (redirectToReferer) {
    return <Navigate to={from} />;
  }
  return (
    <Container id="signup-page" className="py-3">
      <Row className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center">
            <h2>Register your organization account</h2>
          </Col>
          <AutoForm schema={bridge} onSubmit={data => submit(data)}>
            <Card>
              <Card.Body>
                <TextField name="organization" placeholder="Organization Name" type="organization" />
                <TextField name="email" placeholder="E-mail address" />
                <TextField name="password" placeholder="Password" type="password" />
                <ErrorsField />
                <SubmitField />
              </Card.Body>
            </Card>
          </AutoForm>
          <Alert variant="light">
            Already have an account? Login
            {' '}
            <Link to="/organization/signin">here</Link>
          </Alert>
          {error === '' ? (
            ''
          ) : (
            <Alert variant="danger">
              <Alert.Heading>Registration was not successful</Alert.Heading>
              {error}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

/* Ensure that the React Router location object is available in case we need to redirect. */
SignUpOrganization.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.string,
  }),
};

SignUpOrganization.defaultProps = {
  location: { state: '' },
};

export default SignUpOrganization;
