import React from 'react';
import Flowers from './flowers.svg';
import Hat from './hat.svg';
import Crowd1 from './crowd1.svg';
import Crowd2 from './crowd2.svg';
import Crowd1Red from './crowd1_red.svg';
import Crowd2Red from './crowd2_red.svg';
import * as s from './style.module.less';
import cN from 'classnames';

export const HurrayCrowd = ({ color, small }) => (
  <div className={cN(s.savedStage, { [s.small]: small })}>
    <img src={Flowers} className={s.savedStageFlowers} alt="" />
    <img src={Hat} className={s.savedStageHat} alt="" />
    {color === 'RED' ? (
      <>
        <img src={Crowd1Red} className={s.savedStageCrowd1} alt="" />
        <img src={Crowd2Red} className={s.savedStageCrowd2} alt="" />
      </>
    ) : (
      <>
        <img src={Crowd1} className={s.savedStageCrowd1} alt="" />
        <img src={Crowd2} className={s.savedStageCrowd2} alt="" />
      </>
    )}
  </div>
);
