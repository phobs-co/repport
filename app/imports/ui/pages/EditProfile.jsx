import React from 'react';
import swal from 'sweetalert';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, HiddenField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import { Profiles } from '../../api/profile/Profiles';
import LoadingSpinner from '../components/LoadingSpinner';

const bridge = new SimpleSchema2Bridge(Profiles.schema);
/* Renders the EditStuff page for editing a single document. */
const EditProfile = () => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  // console.log('EditProfile', _id);
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { doc, ready } = useTracker(() => {
    // Get access to Profiles documents.
    const subscription = Meteor.subscribe(Profiles.userPublicationName);
    // Determine if the subscription is ready
    const rdy = subscription.ready();
    // Get the document
    const document = Profiles.collection.findOne(_id);
    return {
      doc: document,
      ready: rdy,
    };
  }, [_id]);
  // console.log('EditStuff', doc, ready);
  // On successful submit, insert the data.
  const submit = (profile) => {
    const { firstname, lastname, age, email, password, bio } = profile;
    Meteor.users.update(_id, { $set: { firstname, lastname, age, email, password, bio } }, (error) => (error ?
      swal('Error', error.message, 'error') :
      swal('Success', 'Item updated successfully', 'success')));
  };
  return ready ? (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col className="text-center"><h2>Edit Profile</h2></Col>
        <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
          <Card>
            <Card.Body>
              <TextField name="firstName" placeholder="Change First Name" />
              <TextField name="lastName" placeholder="Change Last Name" />
              <TextField name="age" placeholder="Change Age" />
              <TextField name="email" placeholder="Change Email" />
              <TextField name="password" placeholder="Change Password" />
              <LongTextField name="bio" placeholder="Tell Us About Yourself" />
              <SubmitField value="Submit" />
              <ErrorsField />
              <HiddenField name="username" />
            </Card.Body>
          </Card>
        </AutoForm>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};
export default EditProfile;
