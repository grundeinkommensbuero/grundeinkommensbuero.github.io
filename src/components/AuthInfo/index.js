import React, { useContext } from 'react';
import { InlineButton } from '../Forms/Button';
import { useSignOut } from '../../hooks/Authentication';
import AuthContext from '../../context/Authentication';

// The component can optionally take in a username, which will be shown
// If not, the default will be to get the email from context
export default ({ children, username }) => {
  const { user } = useContext(AuthContext);
  const signOut = useSignOut();

  return (
    <>
      {children} Nicht {username || (user && user.attributes.email)}?{' '}
      <InlineButton onClick={signOut} type="button">
        {' '}
        Hier klicken zum Abmelden.
      </InlineButton>
    </>
  );
};
