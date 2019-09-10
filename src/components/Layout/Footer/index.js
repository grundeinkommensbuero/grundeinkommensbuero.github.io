import React from 'react';
import Link from 'gatsby-link';
import style from './style.module.css';

export default () => (
  <footer>
    <section>
      &copy; Grundeinkommensbüro 2019 | <Link to="/privacy">Datenschutz</Link> |{' '}
      <Link to="/imprint">Impressum</Link>
    </section>
  </footer>
);
