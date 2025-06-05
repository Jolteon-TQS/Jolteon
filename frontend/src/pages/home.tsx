import { useEffect, useState } from "react";
import biker from "../assets/biker.gif";
import BikeMap from "../components/BikeMap";
import { getBikeRentingById, endBikeRenting } from "../api/bikeRenting-crud";
import { getAllStations } from "../api/station-crud";
import { BikeRentingDTO } from "../api/bikeRenting-crud";
import { Station } from "../api/station-crud";
import { notify } from "../components/Notify";

function Home() {
  const [bikeRenting, setBikeRenting] = useState<BikeRentingDTO | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedEndSpot, setSelectedEndSpot] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [endingTrip, setEndingTrip] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rentingData, stationsData] = await Promise.all([
          getBikeRentingById(1), // this is the user id
          getAllStations(),
        ]);
        setBikeRenting(rentingData); // might be null now
        setStations(stationsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEndTrip = async () => {
    if (!bikeRenting || !selectedEndSpot) {
      notify("Please select an end station");
      return;
    }

    setEndingTrip(true);
    try {
      const updatedRental = await endBikeRenting(
        bikeRenting.id!,
        selectedEndSpot!,
      );
      setBikeRenting(updatedRental);
      notify("Trip ended successfully!");
    } catch (error) {
      console.error("Failed to end trip:", error);
      notify("Failed to end trip");
    } finally {
      setEndingTrip(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bike data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 p-6 rounded-lg max-w-md text-center">
          <div className="text-red-500 font-medium">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!bikeRenting) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No Active Rental
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have any active bike rentals at the moment.
          </p>
          <button
            className="px-6 py-3 bg-primary text-white font-medium rounded-lg shadow-md hover:bg-primary-700 transition-all"
            onClick={() => {
              window.location.href = "/bikes";
            }}
          >
            Rent a Bike
          </button>
        </div>
      </div>
    );
  }

const { bike, user, culturalLandmarks, startSpot, endSpot, time, endTime } = bikeRenting;


const endTimeUTC = endTime ? new Date(endTime + "Z") : null; // force UTC parsing

const remainingTime = endTimeUTC
  ? Math.max(0, Math.floor((endTimeUTC.getTime() - Date.now()) / (1000 * 60)))
  : 0; // fallback to 0 if no endTime

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto mt-30">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Info Panel */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-blue-900 mb-1">
                      Bike Rental Details
                    </h1>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        endTime
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {endTime ? "Completed" : "Active"}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <img src={biker} alt="E-Bike" className="h-24 rounded-lg" />
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Rider
                      </h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">
                        {user.username}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Rental time
                      </h3>
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              remainingTime > 30
                                ? "bg-green-500"
                                : remainingTime > 10
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{
                              width: `${Math.min(100, (remainingTime / bike.autonomy) * 100)}%`,
                            }}
                          ></div>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {Math.max(0, remainingTime)} minutes remaining
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Current Location
                      </h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">
                        {bike.city}
                      </p>
                      <p className="text-sm text-gray-600">
                        {bike.latitude.toFixed(4)}, {bike.longitude.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Start Time
                      </h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">
                        {new Date(time).toLocaleString()}
                      </p>
                      {startSpot && (
                        <p className="text-sm text-gray-600 mt-1">
                          {startSpot.city} ({startSpot.latitude.toFixed(4)},{" "}
                          {startSpot.longitude.toFixed(4)})
                        </p>
                      )}
                    </div>

                    {endTime && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          End Time
                        </h3>
                        <p className="mt-1 text-lg font-medium text-gray-900">
                          {new Date(endTime).toLocaleString()}
                        </p>
                        {endSpot && (
                          <p className="text-sm text-gray-600 mt-1">
                            {endSpot.city} ({endSpot.latitude.toFixed(4)},{" "}
                            {endSpot.longitude.toFixed(4)})
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {(culturalLandmarks ?? []).length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Landmarks to Visit
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {culturalLandmarks
                        ?.filter((landmark) => typeof landmark.id === "number")
                        .map((landmark) => (
                          <div
                            key={landmark.id}
                            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                          >
                            <h4 className="font-medium text-gray-900">
                              {landmark.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {landmark.city}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                  <>
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select End Station
                      </label>
                      <select
                        value={selectedEndSpot || ""}
                        onChange={(e) =>
                          setSelectedEndSpot(Number(e.target.value))
                        }
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a station</option>
                        {stations.map((station) => (
                          <option key={station.id} value={station.id}>
                            {station.city}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleEndTrip}
                        disabled={endingTrip || !selectedEndSpot}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {endingTrip ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Ending Trip...
                          </span>
                        ) : (
                          "End Trip"
                        )}
                      </button>
                    </div>
                  </>
              </div>
            </div>
          </div>

          {/* Right: Map */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
              <BikeMap
                latitude={bike.latitude}
                longitude={bike.longitude}
                landmarks={culturalLandmarks
                  ?.filter((landmark) => typeof landmark.id === "number")
                  .map((landmark) => ({
                    ...landmark,
                    id: landmark.id as number,
                  }))}
                startSpot={startSpot ?? undefined}
                endSpot={endSpot}
                stations={stations}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
