import { useEffect, useState } from "react";
import LandmarkMap from "../components/LandmarkMap";
import {
  getAllCulturalLandmarks,
  createCulturalLandmark,
  deleteCulturalLandmark,
  updateCulturalLandmark,
  CulturalLandmark,
} from "../api/landmark-crud";
import { getAllStations, Station } from "../api/station-crud";

function LandmarkPanel() {
  const [landmarks, setLandmarks] = useState<CulturalLandmark[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [newLandmark, setNewLandmark] = useState({
    name: "",
    city: "",
    description: "",
    latitude: "",
    longitude: "",
    imageUrl: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingItem, setEditingItem] =
    useState<Partial<CulturalLandmark> | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Search and pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [landmarksData, stationsData] = await Promise.all([
          getAllCulturalLandmarks(),
          getAllStations(),
        ]);

        const convertedLandmarks = landmarksData.map((lm) => ({
          id: lm.id,
          name: lm.name,
          city: lm.city,
          description: lm.description,
          latitude: lm.latitude,
          longitude: lm.longitude,
          imageUrl: lm.imageUrl || "",
        }));

        setLandmarks(convertedLandmarks);
        setStations(stationsData);
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    fetchData();
  }, []);

  // Filter landmarks based on search term
  const filteredItems = landmarks.filter(
    (landmark) =>
      landmark.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      landmark.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      landmark.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const addLandmark = async () => {
    try {
      const landmark: CulturalLandmark = {
        name: newLandmark.name,
        city: newLandmark.city,
        description: newLandmark.description,
        latitude: parseFloat(newLandmark.latitude),
        longitude: parseFloat(newLandmark.longitude),
        imageUrl: newLandmark.imageUrl,
      };

      const created = await createCulturalLandmark(landmark);

      setLandmarks([
        ...landmarks,
        {
          id: created.id,
          name: created.name,
          city: created.city,
          description: created.description,
          latitude: created.latitude,
          longitude: created.longitude,
          imageUrl: created.imageUrl,
        },
      ]);

      setNewLandmark({
        name: "",
        city: "",
        description: "",
        latitude: "",
        longitude: "",
        imageUrl: "",
      });
    } catch (error) {
      console.error("Failed to add landmark", error);
    }
  };

  const deleteLandmark = async (id: number) => {
    try {
      await deleteCulturalLandmark(id);
      setLandmarks((prev) => prev.filter((l) => l.id !== id));
      // Reset pagination if we're on a page that might now be empty
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Failed to delete landmark", error);
    }
  };

  const startEditing = (id: number, lm: CulturalLandmark) => {
    setEditingId(id);
    setEditingItem({ ...lm });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingItem(null);
  };

  const saveEditing = async () => {
    if (!editingId || !editingItem) return;

    try {
      const updated = {
        id: editingId,
        name: editingItem.name || "",
        city: editingItem.city || "",
        description: editingItem.description || "",
        latitude: parseFloat(String(editingItem.latitude || "0")),
        longitude: parseFloat(String(editingItem.longitude || "0")),
        imageUrl: editingItem.imageUrl || "",
      };

      const updatedLandmark = await updateCulturalLandmark(editingId, updated);

      setLandmarks((prev) =>
        prev.map((lm) =>
          lm.id === editingId
            ? {
                ...lm,
                ...updatedLandmark,
                latitude: updatedLandmark.latitude,
                longitude: updatedLandmark.longitude,
              }
            : lm,
        ),
      );

      setEditingId(null);
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to update landmark", error);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row gap-6 p-10 bg-green-50 mt-18 shadow-sm window border-base-300 min-h-screen">
      <div className="flex-1 space-y-6 mt-5">
        <h1 className="text-3xl font-bold text-green-800">City Admin Panel</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Filter by City:
          </label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            value={selectedCity ?? ""}
            onChange={(e) => setSelectedCity(e.target.value || null)}
          >
            <option value="">All Cities</option>
            {Array.from(
              new Set(landmarks.map((landmark) => landmark.city)),
            ).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Add Landmark */}
        <div className="space-y-2">
          <h2 className="font-semibold text-lg">Add Landmark</h2>
          <input
            type="text"
            placeholder="Name"
            className="input input-bordered w-full max-w-xs mr-10"
            value={newLandmark.name}
            onChange={(e) =>
              setNewLandmark({ ...newLandmark, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="City"
            className="input input-bordered w-full max-w-xs"
            value={newLandmark.city}
            onChange={(e) =>
              setNewLandmark({ ...newLandmark, city: e.target.value })
            }
          />
          <textarea
            placeholder="Description"
            className="textarea textarea-bordered w-full max-w-xs mr-10"
            value={newLandmark.description}
            onChange={(e) =>
              setNewLandmark({ ...newLandmark, description: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Latitude"
            className="input input-bordered w-full max-w-xs"
            value={newLandmark.latitude}
            onChange={(e) =>
              setNewLandmark({ ...newLandmark, latitude: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Image URL"
            className="input input-bordered w-full max-w-xs"
            value={newLandmark.imageUrl}
            onChange={(e) =>
              setNewLandmark({ ...newLandmark, imageUrl: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Longitude"
            className="input input-bordered w-full max-w-xs ml-10"
            value={newLandmark.longitude}
            onChange={(e) =>
              setNewLandmark({ ...newLandmark, longitude: e.target.value })
            }
          />
          <button
            onClick={addLandmark}
            className="btn btn-success ml-10"
            disabled={
              !newLandmark.name ||
              !newLandmark.city ||
              !newLandmark.description ||
              !newLandmark.latitude ||
              !newLandmark.longitude ||
              !newLandmark.imageUrl
            }
          >
            Add Landmark
          </button>
        </div>

        <div className="space-y-2 mt-6">
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary w-full"
          >
            View/Manage Landmarks
          </button>
        </div>
      </div>

      {/* Right: Map */}
      <div className="w-full lg:w-1/2 z-10 bg-white rounded-2xl shadow-xl overflow-hidden h-full">
        <LandmarkMap
          landmarks={landmarks}
          stations={stations.map((station) => ({
            ...station,
            bikes: Array.isArray(station.bikes)
              ? station.bikes.length
              : station.bikes,
          }))}
          onStationSelect={() => {}}
          initialCenter={[-8.653, 40.641]}
          initialZoom={10}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-5xl max-h-[90vh] flex flex-col">
            <h3 className="font-bold text-lg">
              Landmarks Management
              <span className="ml-2 text-sm font-normal">
                ({filteredItems.length} items)
              </span>
            </h3>

            {/* Search Bar */}
            <div className="my-4">
              <input
                type="text"
                placeholder="Search landmarks..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
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
                    <th>City</th>
                    <th>Description</th>
                    <th>Location</th>
                    <th>Image URL</th>
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
                          <>
                            <td>
                              <input
                                type="text"
                                className="input input-bordered input-sm"
                                value={editingItem?.name || ""}
                                onChange={(e) =>
                                  setEditingItem({
                                    ...editingItem,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="input input-bordered input-sm"
                                value={editingItem?.city || ""}
                                onChange={(e) =>
                                  setEditingItem({
                                    ...editingItem,
                                    city: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="input input-bordered input-sm"
                                value={editingItem?.description || ""}
                                onChange={(e) =>
                                  setEditingItem({
                                    ...editingItem,
                                    description: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td>
                              <div className="flex gap-1">
                                <input
                                  type="number"
                                  className="input input-bordered input-sm w-20"
                                  value={
                                    editingItem?.latitude?.toString() || ""
                                  }
                                  onChange={(e) =>
                                    setEditingItem({
                                      ...editingItem,
                                      latitude: parseFloat(e.target.value) || 0,
                                    })
                                  }
                                  step="0.000001"
                                />
                                <input
                                  type="number"
                                  className="input input-bordered input-sm w-20"
                                  value={
                                    editingItem?.longitude?.toString() || ""
                                  }
                                  onChange={(e) =>
                                    setEditingItem({
                                      ...editingItem,
                                      longitude:
                                        parseFloat(e.target.value) || 0,
                                    })
                                  }
                                  step="0.000001"
                                />
                              </div>
                            </td>
                            <td>
                              <input
                                type="text"
                                className="input input-bordered input-sm"
                                value={editingItem?.imageUrl || ""}
                                onChange={(e) =>
                                  setEditingItem({
                                    ...editingItem,
                                    imageUrl: e.target.value,
                                  })
                                }
                              />
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{item.name}</td>
                            <td>{item.city}</td>
                            <td className="truncate max-w-xs">
                              {item.description}
                            </td>
                            <td>
                              {item.latitude.toFixed(4)},{" "}
                              {item.longitude.toFixed(4)}
                            </td>
                            <td className="truncate max-w-xs">
                              {item.imageUrl}
                            </td>
                          </>
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
                                onClick={() => deleteLandmark(item.id!)}
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
                      <td colSpan={7} className="text-center">
                        No landmarks found
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
                        className={`join-item btn ${
                          currentPage === pageNum ? "btn-active" : ""
                        }`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
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
              <button onClick={() => setShowModal(false)} className="btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default LandmarkPanel;
