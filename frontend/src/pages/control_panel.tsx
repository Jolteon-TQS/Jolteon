import { useState, useEffect } from "react";
import PanelMap from "../components/PanelMap";
import { getAllBikes, createBike, deleteBike } from "../api/bike-crud";
import { Bike } from "../api/bike-crud";


interface Station {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

function Panel() {
  // State for bikes and stations
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stations, setStations] = useState<Station[]>([
    { id: 1, name: "Central Station", latitude: 40.6410, longitude: -8.6530 },
    { id: 2, name: "North Hub", latitude: 40.6430, longitude: -8.6600 },
  ]);

  // State for new bike/station forms
  const [newBike, setNewBike] = useState({ city: "", latitude: "", longitude: "", chargingSpotId: "", autonomy: "" });
  const [newStation, setNewStation] = useState({ name: "", latitude: "", longitude: "" });

  // Modal state
  const [showModal, setShowModal] = useState<"bikes" | "stations" | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch bikes on component mount
  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const fetchedBikes = await getAllBikes();
        setBikes(fetchedBikes);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch bikes. Please try again later.");
        setIsLoading(false);
        console.error("Error fetching bikes:", err);
      }
    };

    fetchBikes();
  }, []);

  // Add new bike using API
  const addBike = async () => {
    if (!newBike.city || !newBike.latitude || !newBike.longitude || !newBike.chargingSpotId || !newBike.autonomy) return;
    
    try {
      const bikeToCreate = {
        city: newBike.city,
        latitude: parseFloat(newBike.latitude),
        longitude: parseFloat(newBike.longitude),
        chargingSpotId: parseInt(newBike.chargingSpotId),
        autonomy: parseInt(newBike.autonomy)
      };

      const createdBike = await createBike(bikeToCreate);
      setBikes([...bikes, createdBike]);
      setNewBike({ city: "", latitude: "", longitude: "", chargingSpotId: "", autonomy: "" });
    } catch (err) {
      setError("Failed to create bike. Please try again.");
      console.error("Error creating bike:", err);
    }
  };

  // Add new station (keeping this static as no API was provided)
  const addStation = () => {
    if (!newStation.name || !newStation.latitude || !newStation.longitude) return;
    
    const id = stations.length > 0 ? Math.max(...stations.map(s => s.id)) + 1 : 1;
    setStations([...stations, { 
      id,
      name: newStation.name, 
      latitude: parseFloat(newStation.latitude), 
      longitude: parseFloat(newStation.longitude)
    }]);
    setNewStation({ name: "", latitude: "", longitude: "" });
  };

  // Delete bike using API
  const handleDeleteBike = async (id: number) => {
    try {
      await deleteBike(id);
      setBikes(bikes.filter(bike => bike.id !== id));
    } catch (err) {
      setError("Failed to delete bike. Please try again.");
      console.error("Error deleting bike:", err);
    }
  };

  // Delete station (keeping this static as no API was provided)
  const deleteStation = (id: number) => {
    setStations(stations.filter(station => station.id !== id));
  };

  // Filter items based on search term
  const filteredItems = showModal === "bikes" 
    ? bikes.filter(bike => 
        bike.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bike.chargingSpotId.toString().includes(searchTerm.toLowerCase()) ||
        bike.autonomy.toString().includes(searchTerm.toLowerCase())
      )
    : stations.filter(station => 
        station.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Open modal handler
  const openModal = (type: "bikes" | "stations") => {
    setShowModal(type);
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Close modal handler
  const closeModal = () => {
    setShowModal(null);
  };

  if (isLoading) {
    return <div className="p-6">Loading bikes...</div>;
  }

  if (error) {
    return <div className="p-6 text-error">{error}</div>;
  }

  return (
    <main className="flex flex-col lg:flex-row gap-6 p-6 bg-orange-100 mt-5 mockup-window border-base-300">
      {/* Left Side - Forms and Controls */}
      <div className="flex-1 space-y-6 mt-5">
        <h1 className="text-3xl font-bold text-orange-700">Control Panel</h1>

        {/* Add New Bike Form */}
        <div className="space-y-2">
          <h2 className="font-semibold text-lg">Add New Bike</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="City"
              className="input input-bordered flex-1"
              value={newBike.city}
              onChange={(e) => setNewBike({ ...newBike, city: e.target.value })}
            />
            <input
              type="number"
              placeholder="Latitude"
              className="input input-bordered flex-1"
              value={newBike.latitude}
              onChange={(e) => setNewBike({ ...newBike, latitude: e.target.value })}
              step="0.000001"
            />
            <input
              type="number"
              placeholder="Longitude"
              className="input input-bordered flex-1"
              value={newBike.longitude}
              onChange={(e) => setNewBike({ ...newBike, longitude: e.target.value })}
              step="0.000001"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="number"
              placeholder="Charging Spot ID"
              className="input input-bordered flex-1"
              value={newBike.chargingSpotId}
              onChange={(e) => setNewBike({ ...newBike, chargingSpotId: e.target.value })}
            />
            <input
              type="number"
              placeholder="Autonomy (km)"
              className="input input-bordered flex-1"
              value={newBike.autonomy}
              onChange={(e) => setNewBike({ ...newBike, autonomy: e.target.value })}
            />
          </div>
          <button 
            onClick={addBike} 
            className="btn btn-secondary"
            disabled={!newBike.city || !newBike.latitude || !newBike.longitude || !newBike.chargingSpotId || !newBike.autonomy}
          >
            Add Bike
          </button>
        </div>

        {/* Add New Station Form */}
        <div className="space-y-2">
          <h2 className="font-semibold text-lg">Add Charging Station</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Station Name"
              className="input input-bordered flex-1"
              value={newStation.name}
              onChange={(e) => setNewStation({ ...newStation, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Latitude"
              className="input input-bordered flex-1"
              value={newStation.latitude}
              onChange={(e) => setNewStation({ ...newStation, latitude: e.target.value })}
              step="0.000001"
            />
            <input
              type="number"
              placeholder="Longitude"
              className="input input-bordered flex-1"
              value={newStation.longitude}
              onChange={(e) => setNewStation({ ...newStation, longitude: e.target.value })}
              step="0.000001"
            />
          </div>
          <button 
            onClick={addStation} 
            className="btn btn-secondary"
            disabled={!newStation.name || !newStation.latitude || !newStation.longitude}
          >
            Add Station
          </button>
        </div>

        {/* Bikes Summary */}
        <div className="space-y-2 mt-6">
          <h2 className="font-semibold text-lg">All Bikes ({bikes.length})</h2>
          <button 
            onClick={() => openModal("bikes")} 
            className="btn btn-primary w-full"
          >
            View/Manage Bikes
          </button>
        </div>

        {/* Stations Summary */}
        <div className="space-y-2 mt-6">
          <h2 className="font-semibold text-lg">All Stations ({stations.length})</h2>
          <button 
            onClick={() => openModal("stations")} 
            className="btn btn-primary w-full"
          >
            View/Manage Stations
          </button>
        </div>
      </div>

      {/* Right Side - Map */}
      <div className="w-full lg:w-1/2">
        <PanelMap 
          bikes={bikes} 
          stations={stations} 
          onDeleteBike={handleDeleteBike} 
          onDeleteStation={deleteStation} 
        />
      </div>

      {/* Management Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-5xl max-h-[90vh] flex flex-col">
            <h3 className="font-bold text-lg">
              {showModal === "bikes" ? "Bikes Management" : "Stations Management"}
              <span className="ml-2 text-sm font-normal">
                ({filteredItems.length} items)
              </span>
            </h3>
            
            {/* Search Bar */}
            <div className="my-4">
              <input
                type="text"
                placeholder={`Search ${showModal}...`}
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Table */}
            <div className="overflow-auto flex-1">
              <table className="table table-zebra table-pin-rows">
                <thead>
                  <tr>
                    <th>ID</th>
                    {showModal === "bikes" ? (
                      <>
                        <th>City</th>
                        <th>Charging Spot</th>
                        <th>Autonomy (km)</th>
                      </>
                    ) : (
                      <th>Name</th>
                    )}
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        {showModal === "bikes" ? (
                          <>
                            <td>{(item as Bike).city}</td>
                            <td>{(item as Bike).chargingSpotId}</td>
                            <td>{(item as Bike).autonomy}</td>
                          </>
                        ) : (
                          <td>{(item as Station).name}</td>
                        )}
                        <td>{item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</td>
                        <td>
                          <button 
                            className="btn btn-error btn-xs"
                            onClick={() => showModal === "bikes" 
                              ? handleDeleteBike(item.id!) 
                              : item.id !== undefined && deleteStation(item.id)
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={showModal === "bikes" ? 6 : 5} className="text-center">
                        No {showModal} found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <div className="join">
                  <button 
                    className="join-item btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
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
                        className={`join-item btn ${currentPage === pageNum ? 'btn-active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button 
                    className="join-item btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    »
                  </button>
                </div>
              </div>
            )}

            <div className="modal-action">
              <button onClick={closeModal} className="btn">Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Panel;
