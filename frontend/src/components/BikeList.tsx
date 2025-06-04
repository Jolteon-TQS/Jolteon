import { useEffect, useState } from "react";
import stationImg from "../assets/station.jpg";
import {
  Station,
  getAllStations,
  getAvailableBikesAtStation,
} from "../api/station-crud";
import { LandMark, getLandmarksByCity } from "../api/landmark-crud";
import { BikeRentingDTO, createBikeRenting } from "../api/bikeRenting-crud";
import { Bike } from "../api/bike-crud";

function BikeList() {
  const [stations, setStations] = useState<Station[]>([]);
  const [availableBikesMap, setAvailableBikesMap] = useState<
    Record<number, number>
  >({});
  const [availableBikes, setAvailableBikes] = useState<Record<number, Bike[]>>(
    {},
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showRouteOptions, setShowRouteOptions] = useState(false);
  const [landmarks, setLandmarks] = useState<LandMark[]>([]);
  const [selectedLandmarks, setSelectedLandmarks] = useState<LandMark[]>([]);
  const [isLoadingLandmarks, setIsLoadingLandmarks] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchStationsAndBikes = async () => {
      try {
        const stationsData = await getAllStations();
        setStations(stationsData);

        const bikesMap: Record<number, number> = {};
        const availableBikesData: Record<number, Bike[]> = {};

        await Promise.all(
          stationsData.map(async (station) => {
            try {
              const stationBikes = await getAvailableBikesAtStation(station.id);
              availableBikesData[station.id] = stationBikes;
              bikesMap[station.id] = stationBikes.length;
            } catch {
              availableBikesData[station.id] = [];
              bikesMap[station.id] = 0;
            }
          }),
        );

        setAvailableBikes(availableBikesData);
        setAvailableBikesMap(bikesMap);
      } catch (error) {
        console.error("Failed to fetch stations or bikes:", error);
      }
    };

    fetchStationsAndBikes();
  }, []);

  const handleRentClick = async (station: Station) => {
    const stationBikes = availableBikes[station.id] || [];
    const randomBike =
      stationBikes.length > 0
        ? stationBikes[Math.floor(Math.random() * stationBikes.length)]
        : null;

    setSelectedBike(randomBike);
    setSelectedStation(station);
    setShowModal(true);
    setShowRouteOptions(false);
    setLandmarks([]);
    setSelectedLandmarks([]);
  };

  const handleRouteRequest = async () => {
    if (!selectedStation) return;

    setShowRouteOptions(true);
    setIsLoadingLandmarks(true);
    try {
      const cityLandmarks = await getLandmarksByCity(selectedStation.city);
      setLandmarks(cityLandmarks);
    } catch (error) {
      console.error("Failed to fetch landmarks:", error);
      setLandmarks([]);
    } finally {
      setIsLoadingLandmarks(false);
    }
  };

  const toggleLandmarkSelection = (landmark: LandMark) => {
    setSelectedLandmarks((prev) => {
      const isSelected = prev.some((l) => l.id === landmark.id);
      if (isSelected) {
        return prev.filter((l) => l.id !== landmark.id);
      } else {
        return [...prev, landmark];
      }
    });
  };

  const handleConfirmRental = async () => {
    if (!selectedStation || !selectedBike) return;

    setIsSubmitting(true);
    try {
      // Replace with actual user from your auth context
      const currentUser = { id: 1, username: "andredora" };

      const rentingData: BikeRentingDTO = {
        bike: selectedBike,
        user: currentUser,
        startSpot: selectedStation,
        endSpot: null,
        culturalLandmarks:
          selectedLandmarks.length > 0 ? selectedLandmarks : null,
        time: new Date().toISOString(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
      };

      await createBikeRenting(rentingData);

      // Update UI
      setShowModal(false);
      setSelectedLandmarks([]);
      setSelectedBike(null);

      // Refresh available bikes
      const updatedBikes = await getAvailableBikesAtStation(selectedStation.id);
      setAvailableBikes((prev) => ({
        ...prev,
        [selectedStation.id]: updatedBikes,
      }));
      setAvailableBikesMap((prev) => ({
        ...prev,
        [selectedStation.id]: updatedBikes.length,
      }));
    } catch (error) {
      console.error("Failed to create rental:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStations = stations.filter((station) =>
    station.city.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredStations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStations = filteredStations.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  return (
    <div className="bg-base-100 rounded-box shadow-md">
      {/* Search Bar */}
      <div className="p-4 pb-0">
        <input
          type="text"
          placeholder="Search for a city..."
          className="input input-bordered w-full"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <ul className="list p-4">
        <li className="pb-2 text-xs opacity-60 tracking-wide">
          Charging stations available ({filteredStations.length} stations)
        </li>

        {currentStations.length > 0 ? (
          currentStations.map((station) => {
            const availableCount = availableBikesMap[station.id] ?? 0;
            return (
              <li
                key={station.id}
                className="list-row flex items-center gap-4 p-4 border-t border-base-200"
              >
                <div>
                  <img
                    className="size-10 rounded-box"
                    src={stationImg}
                    alt="Station"
                  />
                </div>
                <div className="flex-grow">
                  <div>{station.city}</div>
                  <div className="text-xs uppercase font-semibold opacity-60">
                    {availableCount > 0
                      ? `${availableCount} bikes available`
                      : "No bikes available"}
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  disabled={availableCount === 0}
                  onClick={() => handleRentClick(station)}
                >
                  Rent Here
                </button>
              </li>
            );
          })
        ) : (
          <li className="p-4 text-center">No stations found</li>
        )}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center p-4 border-t border-base-200">
          <div className="join">
            <button
              className="join-item btn btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              «
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  className={`join-item btn btn-sm ${currentPage === pageNum ? "btn-active" : ""}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              className="join-item btn btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              »
            </button>
          </div>
        </div>
      )}

      {/* Rental Modal */}
      {showModal && selectedStation && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg">Confirm Your Rental</h3>
            <div className="py-4 space-y-4">
              <div>
                <p>You are about to rent a bike from:</p>
                <div className="mt-2 p-4 bg-base-200 rounded-box">
                  <div className="flex items-center gap-4">
                    <img
                      className="size-12 rounded-box"
                      src={stationImg}
                      alt="Station"
                    />
                    <div>
                      <div className="font-medium">{selectedStation.city}</div>
                      <div className="text-sm opacity-75">
                        {availableBikesMap[selectedStation.id] ?? 0} bikes
                        available
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Route Options */}
              {!showRouteOptions ? (
                <div className="pt-2">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input
                      type="checkbox"
                      className="checkbox"
                      onChange={handleRouteRequest}
                    />
                    <span className="label-text">
                      Would you like a suggested route?
                    </span>
                  </label>
                </div>
              ) : (
                <div>
                  <h4 className="font-medium mb-2">
                    Landmarks in {selectedStation.city}:
                  </h4>
                  {isLoadingLandmarks ? (
                    <div className="flex justify-center">
                      <span className="loading loading-spinner loading-md"></span>
                    </div>
                  ) : landmarks.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {landmarks.map((landmark) => (
                        <div
                          key={landmark.id}
                          className={`p-3 rounded-box cursor-pointer transition-colors ${
                            selectedLandmarks.some((l) => l.id === landmark.id)
                              ? "bg-primary text-primary-content"
                              : "bg-base-200 hover:bg-base-300"
                          }`}
                          onClick={() => toggleLandmarkSelection(landmark)}
                        >
                          <div className="font-medium">{landmark.name}</div>
                          <div className="text-sm opacity-75">
                            {landmark.description}
                          </div>
                          {selectedLandmarks.some(
                            (l) => l.id === landmark.id,
                          ) && <div className="text-xs mt-1">✓ Selected</div>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm opacity-75">
                      No landmarks found for this city
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => {
                  setShowModal(false);
                  setSelectedLandmarks([]);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleConfirmRental}
                disabled={isSubmitting || !selectedBike}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Confirm Rental"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BikeList;
