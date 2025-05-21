import { useEffect, useState } from 'react';
// import ebike from '../assets/ebike.png';
import biker from '../assets/biker.gif';
import BikeMap from '../components/BikeMap';
import { getBikeById } from '../api/get-bike';

interface Bike {
  id: number;
  battery: number;
  autonomy: number;
  isAvailable: boolean;
  latitude: number;
  longitude: number;
  city: string;
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
                <p><strong>Remaining Time:</strong> {bike.autonomy} minutes</p>
                <p><strong>Location:</strong> {bike.city}</p>
                {/* <p><strong>Availability:</strong> {bike.isAvailable ? 'Available' : 'Unavailable'}</p> */}
              </div>
              <div className="flex items-center gap-4">
                <strong>Battery Level</strong>
                <div
                  className="radial-progress text-info"
                  style={{ '--value': bike.battery } as React.CSSProperties}
                  role="progressbar"
                  aria-valuenow={bike.battery}
                >
                  {bike.battery}%
                </div>
              </div>
              <div className="card-actions mt-4">
                <button className="btn btn-info">End Trip</button>
              </div>
            </div>
            {/* Right: Biker Image */}
            <div className="flex-shrink-0">
              <img src={biker} alt="E-Bike" className="h-55 rounded mr-50" />
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
