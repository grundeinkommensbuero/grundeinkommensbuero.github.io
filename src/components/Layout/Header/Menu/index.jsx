import React, { useContext } from 'react';
import cN from 'classnames';

import * as s from './style.module.less';
import { MenuItemLink } from './MenuItem';
import MenuItemParent from './MenuItemParent';
import LoginMenuItem from './LoginMenuItem';
import { MunicipalityContext } from '../../../../context/Municipality';

const Menu = ({ menu, menuOpen }) => {
  const { setPageContext } = useContext(MunicipalityContext);
  return (
    <ul className={cN(s.navList, { [s.isOpen]: menuOpen })} id="menuHeader">
      {menu.map((item, index) => {
        if (item.__typename === 'ContentfulStaticContent') {
          return (
            <MenuItemLink
              slug={item.slug}
              key={index}
              onClick={
                item.slug === '/'
                  ? () => {
                      setPageContext({
                        slug: '/',
                        isMunicipality: false,
                        isSpecificMunicipality: false,
                      });
                    }
                  : undefined
              }
            >
              {item.shortTitle || item.title}
            </MenuItemLink>
          );
        } else {
          return (
            <MenuItemParent title={item.title} key={index} {...item}>
              {/* Map thru children of the menu item and pass to the submenu */}
              {item.contentfulchildren &&
                item.contentfulchildren.map((item, index) => (
                  <MenuItemLink
                    key={index}
                    isChild={true}
                    // Replace /, so internal links work with or without /
                    slug={item.slug || item.internalLink.replace('/', '')}
                    externalLink={item.externalLink}
                  >
                    {item.shortTitle || item.title}
                  </MenuItemLink>
                ))}
            </MenuItemParent>
          );
        }
      })}
      <LoginMenuItem />
    </ul>
  );
};

export default Menu;
