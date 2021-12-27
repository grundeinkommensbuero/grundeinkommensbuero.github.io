import React, { useState, useEffect, useContext } from 'react';
import * as s from './style.module.less';
import AuthContext from '../../../context/Authentication/index';
import { useGetMostRecentInteractions } from '../../../hooks/Api/Interactions';
import { LoadingAnimation } from '../../LoadingAnimation';
import { Package } from './Package';
import { CTALink } from '../../Layout/CTAButton';

export const PledgePackagesSection = () => {
  const [state, pledgePackages, getInteractions] =
    useGetMostRecentInteractions();
  const [pledgePackagesDone, setPledgePackagesDone] = useState([]);
  const { customUserData: userData, userId } = useContext(AuthContext);
  const [packagesOfUser, setPackagesOfUser] = useState([]);

  // Fetch all interactions once
  useEffect(() => {
    getInteractions(null, 0, 'pledgePackage');
  }, []);

  // Get a list of all done packages
  useEffect(() => {
    const done = pledgePackages.filter(pledgePackage => pledgePackage.done);
    setPledgePackagesDone(done);
  }, [pledgePackages]);

  useEffect(() => {
    if (userData?.interactions) {
      setPackagesOfUser(
        userData.interactions.filter(
          interaction => interaction.type === 'pledgePackage'
        )
      );
    }
  }, [userData]);

  return (
    <>
      <h2 className={s.violet}>Schnapp dir ein Sammelpaket</h2>
      {packagesOfUser && pledgePackages && userData.interactions ? (
        <div>
          <div className={s.flexContainer}>
            <div className={s.flexItem}>
              {packagesOfUser.length === 0 ? (
                <p>
                  Zeig deinen Einsatz für's Grundeinkommen und setze dir ein
                  Sammelziel! Es gibt Pakete mit jeweils einem Ziel von 50
                  Unterschriften, von denen du dir so viele nehmen kannst, wie
                  du möchtest! Mach mit und schnapp dir dein erstes Paket!
                </p>
              ) : (
                <p>
                  Du hast dir {packagesOfUser.length} Pakete geschnappt und
                  somit versprochen, {packagesOfUser.length * 50} Unterschriften
                  zu sammeln.
                </p>
              )}
              <div className={s.packagesColumnLeft}>
                {packagesOfUser.slice(0, 2).map((pledgePackage, index) => {
                  return (
                    <Package
                      belongsToCurrentUser={true}
                      key={index}
                      body={pledgePackage.body}
                      user={userData}
                      createdAt={pledgePackage.createdAt}
                      id={pledgePackage.id}
                      done={pledgePackage.done}
                    />
                  );
                })}
              </div>
              <div className={s.CTA}>
                {userId && (
                  <CTALink to={`/mensch/${userId}/paket-nehmen`}>
                    {userData && packagesOfUser.length === 0
                      ? 'Nimm dein Paket'
                      : 'Weiteres Paket nehmen'}
                  </CTALink>
                )}
              </div>
            </div>
            <div className={s.flexItem}>
              {state && state !== 'loading' && (
                <p className={s.violet}>
                  {pledgePackages[0] ? (
                    <b>
                      Schon {pledgePackages.length} Pakete verteilt
                      {pledgePackagesDone.length > 0 &&
                        ` und davon ${pledgePackagesDone.length} erledigt`}
                      !
                    </b>
                  ) : (
                    <b>Noch keine Pakete verteilt!</b>
                  )}
                </p>
              )}
              <div className={s.packagesColumnRight}>
                {pledgePackages.slice(0, 3).map((pledgePackage, index) => {
                  return (
                    <Package
                      key={index}
                      body={pledgePackage.body}
                      user={pledgePackage.user}
                      createdAt={pledgePackage.createdAt}
                      id={pledgePackage.id}
                      done={pledgePackage.done}
                    />
                  );
                })}
              </div>
              <div className={s.CTA}>
                <CTALink to={`/pakete`}>Alle ansehen</CTALink>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LoadingAnimation />
      )}
    </>
  );
};
