import { useEffect, useState } from 'react';
// import ebike from '../assets/ebike.png';
import biker from '../assets/biker.gif';
import BikeMap from '../components/BikeMap';
import { getBikeById } from '../api/get-bike';

interface Bike {
  id: number;
  autonomy: number;
  isAvailable: boolean;
  latitude: number;
  longitude: number;
  city: string;
  chargingSpot: string
}

function Home() {
  const [bike, setBike] = useState<Bike | null>(null);

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const data = await getBikeById(); // you can pass a dynamic ID if needed
        setBike(data as Bike);
      } catch (error) {
        console.error('Failed to fetch bike:', error);
      }
    };

    fetchBike();
  }, []);

  if (!bike) {
    return <p className="p-6">Loading bike...</p>;
  }

  return (
    <main className="flex flex-col lg:flex-row gap-6 p-6 bg-blue-50 mt-5 mockup-window border-base-300">
      {/* Left: Info Panel */}
      <div className="flex-1 mt-5">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">Active Bike</h1>
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Left: Info */}
            <div className="flex-1 space-y-4 w-full">
              <div className="text-lg space-y-1">
                <p><strong>Remaining Time:</strong> {bike.autonomy} minutes
                (Please return until <strong>{new Date(Date.now() + bike.autonomy * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}h</strong>)</p>
                <p><strong>City:</strong> {bike.city}</p>
                <p><strong>Latitude:</strong> {bike.latitude}</p>
                <p><strong>Longitude:</strong> {bike.longitude}</p>
              </div>
              <div className="card-actions mt-4">
                <button className="btn btn-info">End Trip</button>
              </div>
            </div>
            {/* Right: Biker Image */}
            <div className="flex-shrink-0">
              <img src={biker} alt="E-Bike" className="h-55 rounded mr-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Right: Map */}
      <div className="w-full lg:w-1/2">
        <BikeMap latitude={bike.latitude} longitude={bike.longitude} />
      </div>
    </main>
  );
}

export default Home;
