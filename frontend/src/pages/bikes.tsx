import { useState, useEffect } from "react";
import BikeList from "../components/BikeList";
import StationsMap from "../components/StationsMap";
import { getAllStations } from "../api/station-crud";
import {
  getAllCulturalLandmarks,
  CulturalLandmark,
} from "../api/landmark-crud"; // Assuming you have this API function

function Bikes() {
  const [duration, setDuration] = useState<number | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [landmarks, setLandmarks] = useState<CulturalLandmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define the Station type that matches what your StationsMap expects
  interface Station {
    id: number;
    city: string;
    latitude: number;
    longitude: number;
    capacity?: number;
    bikes?: number; // Changed from Bike[] to number
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedStations, fetchedLandmarks] = await Promise.all([
          getAllStations(),
          getAllCulturalLandmarks(), // Add this function to your API
        ]);

        // Transform the API stations to match the expected Station type
        const transformedStations: Station[] = fetchedStations.map(
          (station) => ({
            id: station.id,
            city: station.city,
            latitude: station.latitude,
            longitude: station.longitude,
            capacity: station.capacity,
            bikes: station.bikes?.length || 0, // Convert bikes array to count
          }),
        );

        setStations(transformedStations);
        setLandmarks(fetchedLandmarks);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDuration(value === "indefinite" ? null : parseInt(value));
  };

  const handleStationSelect = (stationId: number) => {
    console.log("Selected station:", stationId);
    // You can add any station selection logic here
  };

  if (isLoading) {
    return <div className="p-6">Loading data...</div>;
  }

  if (error) {
    return <div className="p-6 text-error">{error}</div>;
  }

  return (
    <main className="flex flex-col lg:flex-row gap-6 p-10 bg-orange-50 mt-5 window border-base-300 mt-18 min-h-screen">
      {/* Left Side */}
      <div className="flex-1 space-y-4 mt-5">
        <h1 className="text-3xl font-bold text-primary">Rent a Bike</h1>

        {/* Rental Duration */}
        <div className="space-y-2">
          <label className="label">
            <span className="label-text mr-3">Rental Duration</span>
          </label>

          <select
            className="select select-primary w-full max-w-xs"
            value={duration === null ? "indefinite" : duration}
            onChange={handleDurationChange}
            data-cy="duration-select"
          >
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="180">3 hours</option>
            <option value="indefinite">Until I end it</option>
          </select>
        </div>

        {/* Bike List */}
        <label className="label">
          <span className="label-text">Select Charging Station</span>
        </label>
        <BikeList duration={duration} />
      </div>

      {/* Right Side: Map */}
      <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow-xl overflow-hidden h-full mt-20">
        <StationsMap
          landmarks={landmarks}
          stations={stations}
          onStationSelect={handleStationSelect}
          initialCenter={[-8.653, 40.641]}
          initialZoom={14}
        />
      </div>
    </main>
  );
}

export default Bikes;
