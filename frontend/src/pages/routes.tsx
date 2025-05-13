import RouteCard from '../components/RouteCard';
import park from '../assets/park.jpg';
import costa from '../assets/costa.jpg';
import rua from '../assets/rua.jpg';

function Routing() {
  const routes = [
    {
      title: 'Bairro de Santiago Route',
      description: 'A nice and long route through a known park in Aveiro. Explore the beautiful parks and streets of this charming neighborhood.',
      location: 'Bairro de Santiago, Aveiro, Portugal',
      distance: '3 kilometers',
      estimatedTime: '45 minutes',
      spots: ['Park of Santiago', 'Jardim do Rossio', 'Praça da República'],
      image: park,
    },
    {
      title: 'Costa Nova Beach Route',
      description: 'A scenic route along the famous Costa Nova beach with its colorful striped houses.',
      location: 'Costa Nova, Aveiro, Portugal',
      distance: '5 kilometers',
      estimatedTime: '1 hour',
      spots: ['Costa Nova Beach', 'Moliceiro Boats', 'Fish Market'],
      image: costa,
    },
    {
      title: 'Rua da Pega Route',
      description: 'A route that takes you through the charming streets of Aveiro, perfect for a leisurely ride.',
      location: 'Rua da Pega, Aveiro, Portugal',
      distance: '2 kilometers',
      estimatedTime: '30 minutes',
      spots: ['Rua da Pega', 'Café do Mercado', 'Igreja de São Gonçalinho'],
      image: rua,
    },
  ];

  return (
    <main className="flex flex-col">
      {routes.map((route, index) => (
        <RouteCard key={index} {...route} />
      ))}
    </main>
  );
}

export default Routing;
