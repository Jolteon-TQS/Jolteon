import { useState } from "react";
import PanelMap from "../components/PanelMap";

interface Bike {
  id: number;
  name: string;
  lat: number;
  lng: number;
  status: string;
}

interface Station {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

function Panel() {
  // State for bikes and stations
  const [bikes, setBikes] = useState<Bike[]>([
    { id: 1, name: "Bike 1", lat: 40.6408, lng: -8.6515, status: "Active - Battery: 70%" },
    { id: 2, name: "Bike 2", lat: 40.642, lng: -8.648, status: "Idle - Battery: 45%" },
  ]);

  const [stations, setStations] = useState<Station[]>([
    { id: 1, name: "Central Station", lat: 40.6410, lng: -8.6530 },
    { id: 2, name: "North Hub", lat: 40.6430, lng: -8.6600 },
  ]);

  // State for new bike/station forms
  const [newBike, setNewBike] = useState({ name: "", lat: "", lng: "" });
  const [newStation, setNewStation] = useState({ name: "", lat: "", lng: "" });

  // Modal state
  const [showModal, setShowModal] = useState<"bikes" | "stations" | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Add new bike
  const addBike = () => {
    if (!newBike.name || !newBike.lat || !newBike.lng) return;
    
    const id = bikes.length > 0 ? Math.max(...bikes.map(b => b.id)) + 1 : 1;
    setBikes([...bikes, { 
      id,
      name: newBike.name, 
      lat: parseFloat(newBike.lat), 
      lng: parseFloat(newBike.lng), 
      status: "Idle - Battery: 100%" 
    }]);
    setNewBike({ name: "", lat: "", lng: "" });
  };

  // Add new station
  const addStation = () => {
    if (!newStation.name || !newStation.lat || !newStation.lng) return;
    
    const id = stations.length > 0 ? Math.max(...stations.map(s => s.id)) + 1 : 1;
    setStations([...stations, { 
      id,
      name: newStation.name, 
      lat: parseFloat(newStation.lat), 
      lng: parseFloat(newStation.lng)
    }]);
    setNewStation({ name: "", lat: "", lng: "" });
  };

  // Delete bike
  const deleteBike = (id: number) => {
    setBikes(bikes.filter(bike => bike.id !== id));
  };

  // Delete station
  const deleteStation = (id: number) => {
    setStations(stations.filter(station => station.id !== id));
  };

  // Filter items based on search term
  const filteredItems = showModal === "bikes" 
    ? bikes.filter(bike => 
        bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bike.status.toLowerCase().includes(searchTerm.toLowerCase())
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
              placeholder="Bike Name"
              className="input input-bordered flex-1"
              value={newBike.name}
              onChange={(e) => setNewBike({ ...newBike, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Latitude"
              className="input input-bordered flex-1"
              value={newBike.lat}
              onChange={(e) => setNewBike({ ...newBike, lat: e.target.value })}
              step="0.000001"
            />
            <input
              type="number"
              placeholder="Longitude"
              className="input input-bordered flex-1"
              value={newBike.lng}
              onChange={(e) => setNewBike({ ...newBike, lng: e.target.value })}
              step="0.000001"
            />
          </div>
          <button 
            onClick={addBike} 
            className="btn btn-secondary"
            disabled={!newBike.name || !newBike.lat || !newBike.lng}
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
              value={newStation.lat}
              onChange={(e) => setNewStation({ ...newStation, lat: e.target.value })}
              step="0.000001"
            />
            <input
              type="number"
              placeholder="Longitude"
              className="input input-bordered flex-1"
              value={newStation.lng}
              onChange={(e) => setNewStation({ ...newStation, lng: e.target.value })}
              step="0.000001"
            />
          </div>
          <button 
            onClick={addStation} 
            className="btn btn-secondary"
            disabled={!newStation.name || !newStation.lat || !newStation.lng}
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
          onDeleteBike={deleteBike} 
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
                    <th>Name</th>
                    {showModal === "bikes" && <th>Status</th>}
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        {showModal === "bikes" && <td>{(item as Bike).status}</td>}
                        <td>{item.lat.toFixed(4)}, {item.lng.toFixed(4)}</td>
                        <td>
                          <button 
                            onClick={() => {
                              showModal === "bikes" 
                                ? deleteBike(item.id) 
                                : deleteStation(item.id);
                            }}
                            className="btn btn-error btn-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={showModal === "bikes" ? 5 : 4} className="text-center">
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
