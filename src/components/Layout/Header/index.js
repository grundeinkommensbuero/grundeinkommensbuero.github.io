import React from 'react';
import s from './style.module.less';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { stringToId } from '../../utils';
import Logo from './logo.svg';

const Header = ({ sections }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <header className={s.header}>
      <h1 className={s.title}>
        <Link to="/">
          <img
            src={Logo}
            className={s.logo}
            alt="Expedition Grundeinkommen Home"
          />
        </Link>
      </h1>
      {sections && (
        <nav className={s.nav}>
          <ul className={s.navList}>
            {sections.map(section => {
              const id = stringToId(section.titleShort);

              if (id) {
                return (
                  <li key={id} className={s.navItem}>
                    <a href={`#${id}`}>{section.titleShort}</a>
                  </li>
                );
              }
            })}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
