import React, { useContext } from 'react';
import * as s from './hertieStyle.module.less';
import { StickyBannerContext } from '../../../../context/StickyBanner';
import cN from 'classnames';
import Confetti from '../../../Confetti';
import Crowd1 from './crowd1.svg';

export const HertieCrowdfunding = () => {
  const closeIcon = require('!svg-inline-loader!./close-icon.svg');
  const { closeStickyBanner } = useContext(StickyBannerContext);

  return (
    <div className={s.donationBar}>
      <div className={s.donationBarItemContainer}>
        <div
          aria-hidden="true"
          alt=""
          className={s.closeButton}
          src={closeIcon}
          onClick={() => closeStickyBanner()}
        />
        <div className={s.leftSection}>
          <p className={s.crowdfundingHeading}>
            <b>
              Vielen Dank für eure Unterstützung beim Hertie Crowdfunding
              Contest.
            </b>
          </p>
          <p className={s.crowdfundingDescription}>
            Dank euch allen hat die Expedition den ersten Platz gewonnen!{' '}
            <span role="img" aria-label="Party-Tüte">
              🎉
            </span>
          </p>
        </div>
        <div className={cN(s.rightSection, s.visualisationForDesktop)}>
          <img src={Crowd1} className={s.crowd} alt="Illustration von feiernden Händen" />
        </div>
      </div>

      <Confetti></Confetti>
    </div>
  );
};
