/**
 *  This file holds a hook to create a meetup
 */

import CONFIG from '../../../../../backend-config';
import { useState, useContext } from 'react';
import AuthContext from '../../../../context/Authentication';

export const useCreateMeetup = () => {
  const [state, setState] = useState(null);

  //get user id  from global context
  const { userId } = useContext(AuthContext);

  return [
    state,
    (data, isBerlin) => createMeetup(userId, data, isBerlin, setState),
  ];
};

const createMeetup = async (userId, data, isBerlin, setState) => {
  try {
    setState('saving');

    // Body and endpoint needs to be different for app api
    let body;
    let endpoint;
    if (isBerlin) {
      if (data.type === 'collect') {
        const now = new Date();
        const startTime = data.startTime || now;
        const endTime =
          data.endTime ||
          new Date(now.getFullYear() + 1, now.getMonth, now.getDate());

        body = {
          action: {
            typ: 'Sammeln',
            beginn: startTime.split('.')[0], // App backend does not accept the ms part
            ende: endTime.split('.')[0],
            ort: data.locationName || data.address,
            longitude: data.coordinates[0],
            latitude: data.coordinates[1],
            initiativenIds: [1], // 1 is Expedition
            details: {
              beschreibung: data.description,
              kontakt: data.contact,
              treffpunkt: data.locationName ? data.address : null,
            },
          },
        };

        endpoint = `${CONFIG.APP_API.INVOKE_URL}/service/termine/neu`;
      } else {
        // Type list is created via different api endpoint in app backend
        body = {
          longitude: data.coordinates[0],
          latitude: data.coordinates[1],
          name: data.locationName,
          initiativenIds: [1], // 1 is Expedition
          street: data.street,
          number: data.number,
        };

        endpoint = `${CONFIG.APP_API.INVOKE_URL}/service/listlocations/neu`;
      }
    } else {
      body = { ...data, userId };

      endpoint = `${CONFIG.API.INVOKE_URL}/meetups`;
    }

    const request = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(endpoint, request);

    // App backend returns 200
    if (response.status === 201 || response.status === 200) {
      setState('saved');
    } else {
      setState('error');
    }
  } catch (error) {
    console.log('Error while saving pledge', error);
    setState('error');
  }
};
