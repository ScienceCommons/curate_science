import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';

import { CookiesProvider } from 'react-cookie';

ReactDOM.render(<CookiesProvider><App authenticated={auth} /></CookiesProvider>, document.getElementById('root'));