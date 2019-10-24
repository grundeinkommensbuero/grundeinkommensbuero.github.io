import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { INLINES } from '@contentful/rich-text-types';

// create a valid ID for usage in the DOM
export function stringToId(string) {
  return string && string.toString().replace(/^[^a-z]+|[^\w:.-]+/gi, '');
}

// Generates a random string (e.g. for generating random password)
export function getRandomString(bytes) {
  const randomValues = new Uint8Array(bytes);
  window.crypto.getRandomValues(randomValues);
  return Array.from(randomValues)
    .map(intToHex)
    .join('');
}

function intToHex(nr) {
  return nr.toString(16).padStart(2, '0');
}

export function contentfulJsonToHtml(json) {
  const website_url = 'https://www.change.org';

  const documentToREactComponentsOptions = {
    // needed so that line breaks are properly added.
    renderText: text => {
      return text.split('\n').reduce((children, textSegment, index) => {
        return [...children, index > 0 && <br key={index} />, textSegment];
      }, []);
    },
    renderNode: {
      [INLINES.HYPERLINK]: node => {
        return (
          <a
            href={node.data.uri}
            target={`${
              node.data.uri.startsWith(website_url) ? '_blank' : '_self'
            }`}
          >
            {node.content[0].value}
          </a>
        );
      },
    },
  };

  return documentToReactComponents(json, documentToREactComponentsOptions);
}

// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
export function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// https://stackoverflow.com/questions/8922107/javascript-scrollintoview-middle-alignment
export function scrollIntoView(element) {
  const elementRect = element.getBoundingClientRect();
  const absoluteElementTop = elementRect.top + window.pageYOffset;
  const middle = absoluteElementTop - window.innerHeight / 2;
  window.scrollTo(0, middle);
}

// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// usage for matomo https://matomo.org/docs/event-tracking/
export function trackEvent({ category, action, name, value }) {
  if (window._paq) {
    console.log('tracked', event);
    window._paq.push(['trackEvent', category, action, name, value]);
  } else {
    console.log('did not track', { category, action, name, value });
  }
}
