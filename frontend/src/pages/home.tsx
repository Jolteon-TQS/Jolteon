import { useEffect, useState } from "react";
import biker from "../assets/biker.gif";
import BikeMap from "../components/BikeMap";
import { getBikeById } from "../api/bike-crud";
import { Bike } from "../api/bike-crud";

function Home() {
  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBike = async () => {
      try {
        // You'll need to get the bike ID from somewhere -
        // this could be from props, URL params, or a hardcoded value for demo purposes
        const bikeId = 3; // Replace with actual ID source
        const data = await getBikeById(bikeId);
        setBike(data);
      } catch (error) {
        console.error("Failed to fetch bike:", error);
        setError("Failed to load bike data");
      } finally {
        setLoading(false);
      }
    };

    fetchBike();
  }, []);

  if (loading) {
    return <p className="p-6">Loading bike...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  if (!bike) {
    return <p className="p-6">No bike data available</p>;
  }

  return (
    <main className="flex flex-col lg:flex-row gap-6 p-10 bg-blue-50 window border-base-300 mt-40 shadow-sm">
      {/* Left: Info Panel */}
      <div className="flex-1 mt-5">
        <h1 className="text-3xl font-bold text-blue-800 mb-6 ml-2">Active Bike</h1>
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Left: Info */}
            <div className="flex-1 space-y-4 w-full">
              <div className="text-lg space-y-1">
                <p>
                  <strong>Remaining Time:</strong> {bike.autonomy} minutes
                </p>
                <p>
                  <strong>City:</strong> {bike.city}
                </p>
                <p>
                  <strong>Charging Spot ID:</strong> {bike.chargingSpotId}
                </p>
                <p>
                  <strong>Latitude:</strong> {bike.latitude}
                </p>
                <p>
                  <strong>Longitude:</strong> {bike.longitude}
                </p>
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
      <div className="w-full lg:w-1/2 z-9">
        <BikeMap latitude={bike.latitude} longitude={bike.longitude} />
      </div>
    </main>
  );
}

export default Home;
