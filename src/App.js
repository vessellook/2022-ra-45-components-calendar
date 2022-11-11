import './App.css';
import Calendar from './components/Calendar';

const now = new Date(2022, 10, 12);

function App() {
  return <Calendar date={now} />;
}

export default App;
