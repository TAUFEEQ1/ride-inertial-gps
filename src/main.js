import App from './App.svelte';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fontsource/roboto";

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;