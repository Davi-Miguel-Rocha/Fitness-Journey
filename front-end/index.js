import { registerRootComponent } from 'expo';
import App from './screens/App'; // Importa o seu componente App.js

// registerRootComponent chama AppRegistry.registerComponent('main', () => App);
// Também garante que você está usando o bundle correto do Expo
registerRootComponent(App);