import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { CheckSquareFill, PencilSquare, XSquareFill } from 'react-bootstrap-icons';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

const ClaimedItems = ({ event }) => {
  const navigate = useNavigate();
  const [showRelease, setShowRelease] = useState(false);
  const [showStore, setShowStore] = useState(false);

  const claimTime = event.claimedAt;
  const [timer, setTimer] = useState(claimTime ? Date.now() - claimTime : null);
  // Action for "Details" button
  const handleDetailsClick = () => {
    navigate(`/detail/${event._id}`);
  };

  // Action for "Release" button
  const handleCloseRelease = () => setShowRelease(false);
  const handleShowRelease = () => setShowRelease(true);

  const handleCloseStore = () => setShowStore(false);
  const handleShowStore = () => setShowStore(true);

  const handleRelease = () => {
    Meteor.call('events.release', event._id, (error) => {
      if (error) {
        // TODO add error handling
        // eslint-disable-next-line no-console
        console.log(`Releasing ${event._id} failed`);
      } else {
        handleCloseRelease();
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (claimTime) {
        const currentTime = Date.now();
        const timeElapsed = Math.floor((currentTime - claimTime) / 1000);
        setTimer(120 * 60 * 60 - timeElapsed);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [claimTime]);

  useEffect(() => {
    // If timer reaches 0, this releases the debris. However, this is not the best way to do this.
    // The timer should be set on the server side, and the server should release the debris when the timer reaches 0. For now this is a temporary solution.
    if (timer === 0) handleRelease();
  }, [timer]);

  const handleStore = () => {
    Meteor.call('events.store', event._id, (error) => {
      if (error) {
        // TODO add error handling
        // eslint-disable-next-line no-console
        console.log(`Moving ${event._id} to storage failed`);
      } else {
        handleCloseStore();
      }
    });
  };

  return (
    <>
      <tr>
        <td>{event.island}</td>
        <td>{event.city}</td>
        {event.type === 'Other' ? <td>{event.customTypeDescription}</td> : <td>{event.type}</td>}
        {event.located === 'Other' ? <td>{event.customLocatedDescription}</td> : <td>{event.located}</td>}
        {event.describe === 'Other' ? <td>{event.customDescriptionDescription}</td> : <td>{event.describe}</td>}
        <td>
          <div className="text-center">
            <Button variant="secondary" onClick={handleDetailsClick}><PencilSquare /></Button>
          </div>
        </td>
        <td>
          <div className="text-center">
            <Button variant="outline-danger" onClick={handleShowRelease} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><XSquareFill /></Button>
          </div>
        </td>
        <td>
          <div className="text-center">
            <Button onClick={handleShowStore}><CheckSquareFill /></Button>
          </div>
        </td>

      </tr>

      <Modal show={showRelease} onHide={handleCloseRelease}>
        <Modal.Header closeButton>
          <Modal.Title>Unclaim Debris</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove this debris from your claimed list?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRelease}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRelease}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showStore} onHide={handleCloseStore}>
        <Modal.Header closeButton>
          <Modal.Title>Move Debris to Storage</Modal.Title>
        </Modal.Header>
        <Modal.Body>Has this debris been collected and moved to storage?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseStore}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleStore}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

ClaimedItems.propTypes = {
  event: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    island: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    customTypeDescription: PropTypes.string,
    located: PropTypes.string.isRequired,
    customLocatedDescription: PropTypes.string,
    describe: PropTypes.string.isRequired,
    customDescriptionDescription: PropTypes.string,
    claimedAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default ClaimedItems;
