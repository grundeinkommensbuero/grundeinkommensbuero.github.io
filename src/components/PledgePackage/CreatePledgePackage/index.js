import React, { useEffect, useState } from 'react';
import querystring from 'query-string';
import { SectionInner } from '../../Layout/Sections';
import * as s from './style.module.less';
import { Form, Field } from 'react-final-form';
import { Button } from '../../Forms/Button';
import { TextInputWrapped } from '../../Forms/TextInput';
import { FinallyMessage } from '../../Forms/FinallyMessage';
import { useSaveInteraction } from '../../../hooks/Api/Interactions';
import { useUpdateUser } from '../../../hooks/Api/Users/Update';
import AvatarImage from '../../AvatarImage';
import packageV2 from '../paket-v2.svg';
import { Speechbubble } from '../Speechbubble/index';
import { mapCampaignCodeToAgs, mapCampaignCodeToState } from '../../utils';

export default ({ userData, updateCustomUserData }) => {
  const [pledgePackageState, uploadPledgePackage] = useSaveInteraction();
  const [, setPledgePackage] = useState();
  const [, updateUser] = useUpdateUser();
  const [campaignCode, setCampaignCode] = useState('bremen-1');

  useEffect(() => {
    const urlParams = querystring.parse(window.location.search);
    if (urlParams.campaignCode) {
      setCampaignCode(urlParams.campaignCode);
    } else {
      if (userData?.municipalities?.length > 0) {
        // Find and sort all collecting municipalities of the user
        const collectingCitiesOfUser = getCities();
        if (collectingCitiesOfUser.length > 0) {
          // If there were any, use the most recent one
          const indexOfMostRecent = collectingCitiesOfUser.length - 1;
          if (collectingCitiesOfUser[indexOfMostRecent].ags === '11000000') {
            setCampaignCode('berlin-1');
          } else if (
            collectingCitiesOfUser[indexOfMostRecent].ags === '04011000'
          ) {
            setCampaignCode('bremen-1');
          } else if (
            collectingCitiesOfUser[indexOfMostRecent].ags === '02000000'
          ) {
            setCampaignCode('hamburg-1');
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    if (pledgePackageState === 'saved') {
      const ags = mapCampaignCodeToAgs(campaignCode);

      // Sign up user for municipality if they aren't already
      const shouldSignUpForMunicipality =
        ags &&
        !userData?.municipalities?.find(
          municipality => municipality.ags === ags
        );

      // If user does not have newsletter consent, or already has newsletter of campaign
      // or already has unsubscribed from campaign (newsletter.value is false in that case), we do nothing.
      // Otherwise we give user newsletter for campaign.
      const shouldSubscribeToNewsletter =
        userData.newsletterConsent.value &&
        userData.customNewsletters.findIndex(
          newsletter => newsletter.ags === ags
        ) === -1;

      const data = {};

      if (shouldSignUpForMunicipality) {
        data.ags = ags;
      }

      if (shouldSubscribeToNewsletter) {
        data.customNewsletters = [
          ...userData.customNewsletters,
          {
            name: mapCampaignCodeToState(campaignCode),
            ags,
            value: true,
            extraInfo: false,
            timestamp: new Date().toISOString(),
          },
        ];
      }

      if (shouldSubscribeToNewsletter || shouldSignUpForMunicipality) {
        updateUser(data);
      }

      updateCustomUserData();
    }
  }, [pledgePackageState]);

  const getCities = () => {
    return userData.municipalities
      .filter(
        municipality =>
          municipality.ags === '11000000' ||
          municipality.ags === '04011000' ||
          municipality.ags === '02000000'
      )
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  if (pledgePackageState === 'error') {
    return (
      <SectionInner>
        <FinallyMessage>
          {pledgePackageState === 'error' && (
            <>Das Absenden hat nicht geklappt. </>
          )}
          <br />
          <br />
          Probiere es bitte ein weiteres Mal oder melde dich bei uns mit dem
          Hinweis zu der genauen Fehlermeldung. Nenne uns bitte außerdem falls
          möglich deinen Browser und die Version:
          <br />
          <br />
          <a href="mailto:support@expedition-grundeinkommen.de">
            support@expedition-grundeinkommen.de
          </a>
        </FinallyMessage>
      </SectionInner>
    );
  }

  if (pledgePackageState === 'saving') {
    return (
      <SectionInner>
        <FinallyMessage state="progress">Speichere...</FinallyMessage>
      </SectionInner>
    );
  }

  return (
    <>
      {pledgePackageState === 'saved' && (
        <SectionInner>
          <FinallyMessage>Du hast dir ein Paket genommen!</FinallyMessage>
        </SectionInner>
      )}
      <Form
        onSubmit={data => {
          setPledgePackage({
            body: data.body,
          });

          uploadPledgePackage({ ...data, campaignCode, type: 'pledgePackage' });
        }}
        validate={validate}
        render={({ handleSubmit }) => (
          <SectionInner>
            <form onSubmit={handleSubmit}>
              <h2>Sammelpaket nehmen</h2>
              <section className={s.flexContainer}>
                <div className={s.bubbleElement}>
                  <Speechbubble>
                    <Field
                      name="body"
                      label="Warum sammelst du für's Grundeinkommen?"
                      placeholder="Dein Grund (Maximal 70 Zeichen)"
                      type="textarea"
                      maxLength={70}
                      component={TextInputWrapped}
                      inputClassName={s.bodyInput}
                      errorClassName={s.error}
                      hideLabel={true}
                    />
                  </Speechbubble>
                  <div className={s.belowBubble}>
                    <AvatarImage
                      user={userData}
                      className={s.avatar}
                      sizes="120px"
                    />
                  </div>
                </div>
                <div className={s.descriptionTextElement}>
                  <p>
                    Mit dem Sammelpaket versprichst du, 50 Unterschriften
                    einzusammeln. Das ist super!
                    <br />
                    <br />
                    Optional: Erzähle der Welt, warum du für's Grundeinkommen
                    sammelst.
                  </p>
                  <div className={s.submitButtonContainer}>
                    <img
                      src={packageV2}
                      alt="Grafik eines Paketes"
                      className={s.packageIcon}
                    />
                    <Button type="submit" className={s.submitButton}>
                      Paket schnappen
                    </Button>
                  </div>
                </div>
              </section>
            </form>
          </SectionInner>
        )}
      ></Form>
    </>
  );
};

const validate = values => {
  const errors = {};

  if (values.body?.length > 70) {
    errors.body = 'Der Text darf nicht länger als 70 Zeichen sein.';
  }

  return errors;
};
