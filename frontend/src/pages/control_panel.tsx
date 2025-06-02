import { useState, useEffect } from "react";
import PanelMap from "../components/PanelMap";
import { getAllBikes, createBike, deleteBike, updateBike, Bike } from "../api/bike-crud";
import { getAllStations, createStation, deleteStation, updateStation, Station } from "../api/station-crud";

function Panel() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [newBike, setNewBike] = useState({ city: "", latitude: "", longitude: "", chargingSpotId: "", autonomy: "" });
  const [newStation, setNewStation] = useState({ city: "", latitude: "", longitude: "", capacity: "" });
  const [showModal, setShowModal] = useState<"bikes" | "stations" | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<Partial<Bike> | Partial<Station> | null>(null);
  const itemsPerPage = 10;
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedBikes, fetchedStations] = await Promise.all([
          getAllBikes(),
          getAllStations()
        ]);
                  console.log("Fetched Bikes:", fetchedBikes);
          console.log("Fetched Stations:", fetchedStations)
        setBikes(fetchedBikes);
        setStations(fetchedStations);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const addBike = async () => {
    if (!newBike.city || !newBike.latitude || !newBike.longitude || !newBike.chargingSpotId || !newBike.autonomy) return;
    try {
      const bikeToCreate = {
        city: newBike.city,
        latitude: parseFloat(newBike.latitude),
        longitude: parseFloat(newBike.longitude),
        chargingSpotId: parseInt(newBike.chargingSpotId),
        autonomy: parseInt(newBike.autonomy),
      };
      const createdBike = await createBike(bikeToCreate);
      console.log("Created Bike:", createdBike);
      setBikes([...bikes, createdBike]);
      setNewBike({
        city: "",
        latitude: "",
        longitude: "",
        chargingSpotId: "",
        autonomy: "",
      });
    } catch (err) {
      setError("Failed to create bike.");
      console.error(err);
    }
  };

  const addStation = async () => {
    // Validate all required fields are filled
    if (!newStation.city || !newStation.latitude || !newStation.longitude || !newStation.capacity) {
      setError("Please fill all station fields");
      return;
    }

    // Validate numeric fields
    const latitude = parseFloat(newStation.latitude);
    const longitude = parseFloat(newStation.longitude);
    const capacity = parseInt(newStation.capacity);

    if (isNaN(latitude) || isNaN(longitude) || isNaN(capacity)) {
      setError("Please enter valid numbers for latitude, longitude and capacity");
      return;
    }

    try {
      const stationToCreate = {
        city: newStation.city.trim(), // Trim whitespace
        latitude,
        longitude,
        capacity,
        bikes: [] // Initialize with an empty array
      };

      console.log("Creating station with data:", stationToCreate); // Debug log

      const createdStation = await createStation(stationToCreate);
      console.log("Created station:", createdStation); // Debug log

      if (!createdStation.id) {
        throw new Error("Station created but no ID returned");
      }

      setStations([...stations, createdStation]);
      setNewStation({ city: "", latitude: "", longitude: "", capacity: "" });
      setError(null); // Clear any previous errors

      // Reset modal state if stations modal is open
      if (showModal === "stations") {
        setSearchTerm("");
        setCurrentPage(1);
      }
    } catch (err) {
      setError("Failed to create station: " + (err as Error).message);
      console.error("Station creation error:", err);
    }
  };

  const startEditing = (id: number, item: Bike | Station) => {
    setEditingId(id);
    setEditingItem({ ...item });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingItem(null);
  };

  const saveEditing = async () => {
    if (!editingId || !editingItem) return;

    try {
      if (showModal === "bikes") {
        const updatedBike = await updateBike(editingId, editingItem as Bike);
        setBikes(bikes.map(b => b.id === editingId ? updatedBike : b));
      } else {
        const updatedStation = await updateStation(editingId, editingItem as Station);
        setStations(stations.map(s => s.id === editingId ? updatedStation : s));
      }
      setEditingId(null);
      setEditingItem(null);
    } catch (err) {
      setError("Failed to update item.");
      console.error(err);
    }
  };

  const handleDeleteBike = async (id: number) => {
    try {
      await deleteBike(id);
      setBikes(bikes.filter(b => b.id !== id));
    } catch (err) {
      setError("Failed to delete bike.");
      console.error(err);
    }
  };

  const handleDeleteStation = async (id: number) => {
    try {
      await deleteStation(id);
      setStations(stations.filter(s => s.id !== id));
    } catch (err) {
      setError("Failed to delete station.");
      console.error(err);
    }
  };

  // Filter items based on search term
  const filteredItems = showModal === "bikes"
    ? bikes.filter(bike =>
      bike.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bike.autonomy.toString().includes(searchTerm.toLowerCase())
    )
    : stations.filter(station =>
      station.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const openModal = (type: "bikes" | "stations") => {
    setShowModal(type);
    setSearchTerm("");
    setCurrentPage(1);
    setEditingId(null);
    setEditingItem(null);
  };

  const closeModal = () => {
    setShowModal(null);
    setEditingId(null);
    setEditingItem(null);
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

        {/* City Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Filter by City:</label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            value={selectedCity ?? ""}
            onChange={(e) => setSelectedCity(e.target.value || null)}
          >
            <option value="">All Cities</option>
            {Array.from(new Set(bikes.map((bike) => bike.city))).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

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
              onChange={(e) =>
                setNewBike({ ...newBike, latitude: e.target.value })
              }
              step="0.000001"
            />
            <input
              type="number"
              placeholder="Longitude"
              className="input input-bordered flex-1"
              value={newBike.longitude}
              onChange={(e) =>
                setNewBike({ ...newBike, longitude: e.target.value })
              }
              step="0.000001"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="number"
              placeholder="Charging Spot ID"
              className="input input-bordered flex-1"
              value={newBike.chargingSpotId}
              onChange={(e) =>
                setNewBike({ ...newBike, chargingSpotId: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Autonomy (km)"
              className="input input-bordered flex-1"
              value={newBike.autonomy}
              onChange={(e) =>
                setNewBike({ ...newBike, autonomy: e.target.value })
              }
            />
          </div>
          <button
            onClick={addBike}
          <button
            onClick={addBike}
            className="btn btn-secondary"
            disabled={
              !newBike.city ||
              !newBike.latitude ||
              !newBike.longitude ||
              !newBike.chargingSpotId ||
              !newBike.autonomy
            }
          >
            Add Bike
          </button>
        </div>

        {/* Bikes Summary */}
        <div className="space-y-2 mt-6">
          {/* <h2 className="font-semibold text-lg">All Bikes ({bikes.length})</h2> */}
          <button
            onClick={() => openModal("bikes")}
            className="btn btn-primary w-full"
          >
            View/Manage Bikes
          </button>
        </div>

        {/* Add New Station Form */}
        <div className="space-y-2">
          <h2 className="font-semibold text-lg">Add Charging Station ({stations.length})</h2>
          {error && <div className="text-error text-sm">{error}</div>}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="City *"
              className="input input-bordered flex-1"
              value={newStation.city}
              onChange={(e) => setNewStation({ ...newStation, city: e.target.value })}
            />
            <input
              type="number"
              placeholder="Latitude *"
              className="input input-bordered flex-1"
              value={newStation.latitude}
              onChange={(e) =>
                setNewStation({ ...newStation, latitude: e.target.value })
              }
              step="0.000001"
            />
            <input
              type="number"
              placeholder="Longitude *"
              className="input input-bordered flex-1"
              value={newStation.longitude}
              onChange={(e) =>
                setNewStation({ ...newStation, longitude: e.target.value })
              }
              step="0.000001"
            />
            <input
              type="number"
              placeholder="Capacity *"
              className="input input-bordered flex-1"
              value={newStation.capacity}
              onChange={(e) => setNewStation({ ...newStation, capacity: e.target.value })}
            />
          </div>
          <button
            onClick={addStation}
          <button
            onClick={addStation}
            className="btn btn-secondary"
            disabled={
              !newStation.city.trim() ||
              !newStation.latitude ||
              !newStation.longitude ||
              !newStation.capacity ||
              isNaN(parseFloat(newStation.latitude)) ||
              isNaN(parseFloat(newStation.longitude)) ||
              isNaN(parseInt(newStation.capacity))
            }
          >
            Add Station
          </button>
        </div>


        {/* Stations Summary */}
        <div className="space-y-2 mt-6">
          {/* <h2 className="font-semibold text-lg">All Stations ({stations.length})</h2> */}
          <button
            onClick={() => openModal("stations")}
            className="btn btn-primary w-full"
          >
            {/* View/Manage Stations */}
            NÃO MEXER
          </button>
        </div>
      </div>

      {/* Right Side - Map */}
      <div className="w-full lg:w-1/2">
        <PanelMap
          markers={[
            ...bikes
              .filter((bike) => typeof bike.id === "number")
              .filter((bike) => !selectedCity || bike.city === selectedCity)
              .map((bike) => ({
                id: bike.id as number,
                type: "bike" as const,
                latitude: bike.latitude,
                longitude: bike.longitude,
                label: `<b>Bike ${bike.id}</b></br>${bike.city}</br>`
              })),
            ...stations
              .filter(station => typeof station.id === "number")
              .filter(station => !selectedCity || station.city === selectedCity)
              .map(station => ({
                id: station.id as number,
                type: "station" as const,
                latitude: station.latitude,
                longitude: station.longitude,
                label: `<b>Station ${station.id}</b></br>${station.city}</br>(${station.bikes.length}/${station.capacity} bikes)`
              }))
          ]}
        />
      </div>

      {/* Management Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-5xl max-h-[90vh] flex flex-col">
            <h3 className="font-bold text-lg">
              {showModal === "bikes"
                ? "Bikes Management"
                : "Stations Management"}
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
                      <>
                        <th>City</th>
                        <th>Capacity</th>
                      </>
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

                        {/* Editable Fields */}
                        {editingId === item.id ? (
                          showModal === "bikes" ? (
                            <>
                              <td>
                                <input
                                  type="text"
                                  className="input input-bordered input-sm"
                                  value={(editingItem as Bike)?.city || ""}
                                  onChange={(e) => setEditingItem({ ...editingItem, city: e.target.value })}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="input input-bordered input-sm"
                                  value={(editingItem as Bike)?.chargingSpotId?.toString() || ""}
                                  onChange={(e) => setEditingItem({ ...editingItem, chargingSpotId: parseInt(e.target.value) || 0 })}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="input input-bordered input-sm"
                                  value={(editingItem as Bike)?.autonomy?.toString() || ""}
                                  onChange={(e) => setEditingItem({ ...editingItem, autonomy: parseInt(e.target.value) || 0 })}
                                />
                              </td>
                              <td>
                                <div className="flex gap-1">
                                  <input
                                    type="number"
                                    className="input input-bordered input-sm w-20"
                                    value={(editingItem as Bike)?.latitude?.toString() || ""}
                                    onChange={(e) => setEditingItem({ ...editingItem, latitude: parseFloat(e.target.value) || 0 })}
                                    step="0.000001"
                                  />
                                  <input
                                    type="number"
                                    className="input input-bordered input-sm w-20"
                                    value={(editingItem as Bike)?.longitude?.toString() || ""}
                                    onChange={(e) => setEditingItem({ ...editingItem, longitude: parseFloat(e.target.value) || 0 })}
                                    step="0.000001"
                                  />
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td>
                                <input
                                  type="text"
                                  className="input input-bordered input-sm"
                                  value={(editingItem as Station)?.city || ""}
                                  onChange={(e) => setEditingItem({ ...editingItem, city: e.target.value })}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="input input-bordered input-sm"
                                  value={(editingItem as Station)?.capacity?.toString() || ""}
                                  onChange={(e) => setEditingItem({ ...editingItem, capacity: parseInt(e.target.value) || 0 })}
                                />
                              </td>
                              <td>
                                <div className="flex gap-1">
                                  <input
                                    type="number"
                                    className="input input-bordered input-sm w-20"
                                    value={(editingItem as Station)?.latitude?.toString() || ""}
                                    onChange={(e) => setEditingItem({ ...editingItem, latitude: parseFloat(e.target.value) || 0 })}
                                    step="0.000001"
                                  />
                                  <input
                                    type="number"
                                    className="input input-bordered input-sm w-20"
                                    value={(editingItem as Station)?.longitude?.toString() || ""}
                                    onChange={(e) => setEditingItem({ ...editingItem, longitude: parseFloat(e.target.value) || 0 })}
                                    step="0.000001"
                                  />
                                </div>
                              </td>
                            </>
                          )
                        ) : (
                          showModal === "bikes" ? (
                            <>
                              <td>{(item as Bike).city}</td>
                              <td>{(item as Bike).chargingSpotId}</td>
                              <td>{(item as Bike).autonomy}</td>
                              <td>{item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</td>
                            </>
                          ) : (
                            <>
                              <td>{(item as Station).city}</td>
                              <td>{(item as Station).capacity}</td>
                              <td>{item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</td>
                            </>
                          )
                        )}

                        {/* Action Buttons */}
                        <td className="flex gap-2">
                          {editingId === item.id ? (
                            <>
                              <button
                                className="btn btn-success btn-xs"
                                onClick={saveEditing}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-error btn-xs"
                                onClick={cancelEditing}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="btn btn-info btn-xs"
                                onClick={() => startEditing(item.id!, item)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-error btn-xs"
                                onClick={() => showModal === "bikes"
                                  ? handleDeleteBike(item.id!)
                                  : handleDeleteStation(item.id!)
                                }
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={showModal === "bikes" ? 6 : 5}
                        className="text-center"
                      >
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
                  <button
                    className="join-item btn"
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
                        className={`join-item btn ${currentPage === pageNum ? "btn-active" : ""}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                  <button
                    className="join-item btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    »
                  </button>
                </div>
              </div>
            )}

            <div className="modal-action">
              <button onClick={closeModal} className="btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Panel;