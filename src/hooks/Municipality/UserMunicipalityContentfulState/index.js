import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../../context/Authentication';
import { MunicipalityContext } from '../../../context/Municipality';

export const useUserMunicipalityContentfulState = () => {
  const { customUserData, isAuthenticated, userId } = useContext(AuthContext);

  const { municipality, municipalityContentfulState } = useContext(
    MunicipalityContext
  );
  const [userContentfulState, setUserContentfulState] = useState();

  useEffect(() => {
    console.log(customUserData?.municipalities);

    if (userId) {
      if (customUserData?.municipalities?.length) {
        const userAgs = customUserData.municipalities.map(m => m.ags);
        if (municipality?.ags && userAgs.includes(municipality.ags)) {
          setUserContentfulState('loggedInThisMunicipalitySignup');
        } else {
          setUserContentfulState('loggedInOtherMunicipalitySignup');
        }
      } else {
        setUserContentfulState('loggedInNoMunicipalitySignup');
      }
    } else {
      setUserContentfulState('loggedOut');
    }
  }, [isAuthenticated, customUserData, municipality]);

  // Debug Contentful showForOptions with this log:
  console.log(
    `*\nContentful state:\nmunicipality: ${municipalityContentfulState}, user: ${userContentfulState}\n\n`
  );

  return { municipalityContentfulState, userContentfulState };
};
