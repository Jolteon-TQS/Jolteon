import { useEffect, useState } from "react";
import LandmarkMap from "../components/LandmarkMap";
import {
  getAllCulturalLandmarks,
  createCulturalLandmark,
  deleteCulturalLandmark,
  updateCulturalLandmark,
  CulturalLandmark,
} from "../api/landmark-crud";

function LandmarkPanel() {
  const [landmarks, setLandmarks] = useState<any[]>([]);
  const [newLandmark, setNewLandmark] = useState({
    name: "",
    city: "",
    description: "",
    lat: "",
    lng: "",
    image: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchLandmarks = async () => {
      try {
        const data = await getAllCulturalLandmarks();
        const converted = data.map((lm) => ({
          id: lm.id,
          name: lm.name,
          city: lm.city,
          description: lm.description,
          lat: lm.latitude,
          lng: lm.longitude,
          image: lm.imageUrl || "",
        }));
        setLandmarks(converted);
      } catch (error) {
        console.error("Failed to load landmarks", error);
      }
    };

    fetchLandmarks();
  }, []);

  const addLandmark = async () => {
    try {
      const landmark: CulturalLandmark = {
        name: newLandmark.name,
        city: newLandmark.city,
        description: newLandmark.description,
        latitude: parseFloat(newLandmark.lat),
        longitude: parseFloat(newLandmark.lng),
        imageUrl: newLandmark.image,
      };

      const created = await createCulturalLandmark(landmark);

      setLandmarks([
        ...landmarks,
        {
          id: created.id,
          name: created.name,
          city: created.city,
          description: created.description,
          lat: created.latitude,
          lng: created.longitude,
          image: created.imageUrl,
        },
      ]);

      setNewLandmark({
        name: "",
        city: "",
        description: "",
        lat: "",
        lng: "",
        image: "",
      });
    } catch (error) {
      console.error("Failed to add landmark", error);
    }
  };

  const deleteLandmark = async (id: number) => {
    try {
      await deleteCulturalLandmark(id);
      setLandmarks((prev) => prev.filter((l) => l.id !== id));
    } catch (error) {
      console.error("Failed to delete landmark", error);
    }
  };

  const startEditing = (lm: any) => {
    setEditingId(lm.id);
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
        name: editingItem.name,
        city: editingItem.city,
        description: editingItem.description,
        latitude: parseFloat(editingItem.lat),
        longitude: parseFloat(editingItem.lng),
        imageUrl: editingItem.image,
      };

      const updatedLandmark = await updateCulturalLandmark(editingId, updated);

      setLandmarks((prev) =>
        prev.map((lm) =>
          lm.id === editingId
            ? {
              ...lm,
              ...updatedLandmark,
              lat: updatedLandmark.latitude,
              lng: updatedLandmark.longitude,
            }
            : lm
        )
      );

      setEditingId(null);
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to update landmark", error);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row gap-6 p-6 bg-green-50 mt-5 mockup-window border-base-300">
      <div className="flex-1 space-y-6 mt-5">
        <h1 className="text-3xl font-bold text-green-800">City Admin Panel</h1>

        {/* Add Landmark */}
        <div className="space-y-2">
          <h2 className="font-semibold text-lg">Add Landmark</h2>
          <input type="text" placeholder="Name" className="input input-bordered w-full max-w-xs mr-10" value={newLandmark.name} onChange={(e) => setNewLandmark({ ...newLandmark, name: e.target.value })} />
          <input type="text" placeholder="City" className="input input-bordered w-full max-w-xs" value={newLandmark.city} onChange={(e) => setNewLandmark({ ...newLandmark, city: e.target.value })} />
          <textarea placeholder="Description" className="textarea textarea-bordered w-full max-w-xs mr-10" value={newLandmark.description} onChange={(e) => setNewLandmark({ ...newLandmark, description: e.target.value })} />
          <input type="text" placeholder="Latitude" className="input input-bordered w-full max-w-xs" value={newLandmark.lat} onChange={(e) => setNewLandmark({ ...newLandmark, lat: e.target.value })} />
          <input type="text" placeholder="Longitude" className="input input-bordered w-full max-w-xs mr-10" value={newLandmark.lng} onChange={(e) => setNewLandmark({ ...newLandmark, lng: e.target.value })} />
          <input type="text" placeholder="Image URL" className="input input-bordered w-full max-w-xs" value={newLandmark.image} onChange={(e) => setNewLandmark({ ...newLandmark, image: e.target.value })} />
          <button onClick={addLandmark} className="btn btn-success ml-10">Add Landmark</button>
        </div>

        <div className="space-y-2 mt-6">
          <button onClick={() => setShowModal(true)} className="btn btn-primary w-full">
            View/Manage Landmarks
          </button>
        </div>
      </div>

      {/* Right: Map */}
      <div className="w-full lg:w-1/2 z-10">
        <LandmarkMap landmarks={landmarks} onDeleteLandmark={deleteLandmark} />
      </div>

      {/* Modal de Edição */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl max-h-[90vh] overflow-auto">
            <h3 className="font-bold text-lg">Landmarks Management ({landmarks.length})</h3>

            <ul className="mt-4 space-y-2">
              {landmarks.map((lm) => (
                <li key={lm.id} className="border-b py-2">
                  {editingId === lm.id ? (
                    <div className="space-y-1">
                      <input className="input input-sm input-bordered w-full" value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} />
                      <input className="input input-sm input-bordered w-full" value={editingItem.city} onChange={(e) => setEditingItem({ ...editingItem, city: e.target.value })} />
                      <textarea className="textarea textarea-bordered w-full" value={editingItem.description} onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} />
                      <div className="flex gap-2">
                        <input className="input input-sm input-bordered w-full" value={editingItem.lat} onChange={(e) => setEditingItem({ ...editingItem, lat: e.target.value })} />
                        <input className="input input-sm input-bordered w-full" value={editingItem.lng} onChange={(e) => setEditingItem({ ...editingItem, lng: e.target.value })} />
                      </div>
                      <input className="input input-sm input-bordered w-full" value={editingItem.image} onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })} />
                      <div className="flex gap-2 mt-2">
                        <button className="btn btn-success btn-sm" onClick={saveEditing}>Save</button>
                        <button className="btn btn-error btn-sm" onClick={cancelEditing}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <strong>{lm.name}</strong> ({lm.city}): {lm.description}
                      </div>
                      <div className="flex gap-2">
                        <button className="btn btn-warning btn-xs" onClick={() => startEditing(lm)}>Edit</button>
                        <button className="btn btn-error btn-xs" onClick={() => deleteLandmark(lm.id)}>Delete</button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <div className="modal-action">
              <button className="btn" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default LandmarkPanel;
