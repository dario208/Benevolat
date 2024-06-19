import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './routes/App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './store/configureStore';
import './assets/scss/index.scss';
import './assets/scss/home.scss';
import './assets/scss/portfolio.scss';


const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);

root.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
);


reportWebVitals();
