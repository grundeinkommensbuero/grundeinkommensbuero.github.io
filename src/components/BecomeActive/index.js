import React, { useContext } from 'react';
import { MunicipalityContext } from '../../context/Municipality';
import { CTAButton } from '../Layout/CTAButton';
// import { contentfulJsonToHtml } from '../utils/contentfulJsonToHtml';

export const BecomeActive = ({ headline, body }) => {
  const { municipality } = useContext(MunicipalityContext);

  // TODO: text from contentful
  // const text = contentfulJsonToHtml(body.json);
  // console.log(text);

  return (
    <div>
      <div>
        <h2>{headline}</h2>
        <p>
          Damit die Kampagne {municipality ? `in ${municipality.name}` : ''}{' '}
          losgehen kann, brauchen wir Freiwillige vor Ort, die bei der
          Organisation helfen können. Wenn du Lust hast, dann finde jetzt
          heraus, wie du aktiv werden kannst!
        </p>
        <CTAButton type="submit" size="MEDIUM">
          Aktiv werden
        </CTAButton>
      </div>
      {/* <div>*illustration*</div> */}
    </div>
  );
};
