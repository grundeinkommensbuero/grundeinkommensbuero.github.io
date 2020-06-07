import React, { useEffect, useState, useContext } from 'react';
import { Form, Field } from 'react-final-form';
import { TextInputWrapped } from '../TextInput';
import { validateEmail, addActionTrackingId, trackEvent } from '../../utils';
import s from './style.module.less';
import { CTAButton, CTAButtonContainer } from '../../Layout/CTAButton';
import { LinkButton, InlineButton } from '../Button';
import { FinallyMessage } from '../FinallyMessage';
import { StepListItem } from '../../StepList';
import { useCreateSignatureList } from '../../../hooks/Api/Signatures/Create';
import { useSignUp } from '../../../hooks/Authentication';
import EnterLoginCode from '../../EnterLoginCode';
import AuthContext from '../../../context/Authentication';
import AuthInfo from '../../AuthInfo';
import DownloadListsNextSteps from '../DownloadListsNextSteps';

const trackingCategory = 'ListDownload';

export default ({ signaturesId }) => {
  const [state, pdf, anonymous, createPdf] = useCreateSignatureList();
  const [signUpState, signUp] = useSignUp();
  const [email, setEmail] = useState();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  // We need the following flag to check if we want to update newsletter consent
  const [wasAlreadyAuthenticated, setWasAlreadyAuthenticated] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    // If user was registered proceed by creating list
    if (signUpState === 'success') {
      createPdf({ email, campaignCode: signaturesId });
    } else if (signUpState === 'userExists') {
      createPdf({
        email,
        campaignCode: signaturesId,
        userExists: true,
      });
    }
  }, [signUpState]);

  useEffect(() => {
    if (isAuthenticated && hasSubmitted) {
      createPdf({
        campaignCode: signaturesId,
        userExists: true,
        shouldNotUpdateUser: wasAlreadyAuthenticated,
      });
    }
  }, [isAuthenticated, hasSubmitted, wasAlreadyAuthenticated]);

  if (state === 'unauthorized') {
    return (
      <EnterLoginCode>
        <p>
          Hey, wir kennen dich schon! Bitte gib den Code ein, den wir dir gerade
          in einer E-Mail geschickt haben. Alternativ kannst du auch eine Liste{' '}
          <InlineButton
            onClick={() => {
              createPdf({ campaignCode: signaturesId });
            }}
            type="button"
          >
            hier
          </InlineButton>{' '}
          anonym herunterladen.
        </p>
      </EnterLoginCode>
    );
  }

  if (state === 'creating') {
    return (
      <FinallyMessage state="progress">
        Liste wird generiert, bitte einen Moment Geduld...
      </FinallyMessage>
    );
  }

  if (state === 'error') {
    trackEvent({
      category: trackingCategory,
      action: addActionTrackingId('downloadCreationError', signaturesId),
    });

    return (
      <FinallyMessage state="error">
        Da ist was schief gegangen. Melde dich bitte bei uns{' '}
        <a href="mailto:support@expedition-grundeinkommen.de">
          support@expedition-grundeinkommen.de
        </a>
        .
      </FinallyMessage>
    );
  }

  if (state === 'created') {
    return (
      <>
        {!anonymous ? (
          <p>
            Juhu! Die Unterschriftslisten und unser Sammelleitfaden sind in
            deinem Postfach. Du kannst sie dir auch{' '}
            <a target="_blank" rel="noreferrer" href={pdf.url}>
              direkt im Browser herunterladen
            </a>{' '}
            - alle weiteren Infos findest du dort!
          </p>
        ) : (
          <p>
            Juhu!{' '}
            <a target="_blank" rel="noreferrer" href={pdf.url}>
              Hier
            </a>{' '}
            kannst du die Unterschriftslisten samt Leitfaden herunterladen!
          </p>
        )}
        <DownloadListsNextSteps>
          {!anonymous && signUpState !== 'userExists' && (
            <StepListItem icon="mail">
              Check deine Mails und klick den Link, damit du dabei bist.
            </StepListItem>
          )}
          {anonymous && (
            <StepListItem icon="download">
              <LinkButton target="_blank" href={pdf.url}>
                Listen herunterladen
              </LinkButton>
            </StepListItem>
          )}
        </DownloadListsNextSteps>
      </>
    );
  }

  return (
    <>
      <Form
        onSubmit={e => {
          if (!isAuthenticated) {
            setEmail(e.email);
            signUp(e.email);
          } else {
            setWasAlreadyAuthenticated(true);
          }

          setHasSubmitted(true);
        }}
        validate={values => validate(values, isAuthenticated)}
        render={({ handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit} className={s.form}>
              {!isAuthenticated ? (
                <>
                  <p className={s.hint}>
                    Schickt mir die Unterschriftenliste, erinnert mich an das
                    Zurücksenden und haltet mich auf dem Laufenden.
                  </p>

                  <div className={s.textInputContainer}>
                    <Field
                      name="email"
                      label="E-Mail"
                      placeholder="E-Mail"
                      component={TextInputWrapped}
                    ></Field>
                  </div>
                
                </>
              ) : (
                <FinallyMessage className={s.hint} preventScrolling={true}>
                  <p>
                    <AuthInfo />
                  </p>
                </FinallyMessage>
              )}
  
              <CTAButtonContainer illustration="POINT_LEFT">
                <CTAButton type="submit">Her mit den Listen</CTAButton>
              </CTAButtonContainer>

              {!isAuthenticated && (
                <>
                  <p>
                    Du wills deine E-Mail-Adresse nicht angeben?<br></br>
                    Du kannst die Liste{' '}
                    <InlineButton
                      onClick={() => {
                        createPdf({ campaignCode: signaturesId });
                      }}
                      type="button"
                    >
                      hier auch anonym herunterladen
                    </InlineButton>
                    . Allerdings können wir dich dann nicht informieren,
                    wenn deine Unterschriften bei uns eingegangen sind!
                    <br />
                    <br />
                  </p>
                </>
              )}

              <p className={s.hint}>
                Kein Drucker?{' '}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://expeditionbge.typeform.com/to/Dq3SOi"
                >
                  Bitte schickt mir Unterschriftenlisten per Post
                </a>
                !
              </p>
            </form>
          );
        }}
      />
    </>
  );
};

const validate = (values, isAuthenticated) => {
  const errors = {};

  if (!isAuthenticated) {
    if (values.email && values.email.includes('+')) {
      errors.email = 'Zurzeit unterstützen wir kein + in E-Mails';
    }

    if (!validateEmail(values.email)) {
      errors.email = 'Wir benötigen eine valide E-Mail Adresse';
    }
  }

  return errors;
};
