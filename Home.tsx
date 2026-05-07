import LandingPage from '../components/LandingPage';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return <LandingPage onStart={() => navigate('/upload')} />;
}
