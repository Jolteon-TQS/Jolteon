import { useState } from "react";
import LandmarkMap from "../components/LandmarkMap";

function LandmarkPanel() {
  const [landmarks, setLandmarks] = useState([
    {
      id: 1,
      name: "Town Hall",
      city: "Aveiro",
      description: "Historic building in the city center.",
      lat: 40.6405,
      lng: -8.6530,
      image: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Aveiro_town_hall.jpg",
    },
  ]);

  const [newLandmark, setNewLandmark] = useState({
    name: "",
    city: "",
    description: "",
    lat: "",
    lng: "",
    image: "",
  });

  const addLandmark = () => {
    const id = landmarks.length + 1;
    setLandmarks([
      ...landmarks,
      {
        id,
        name: newLandmark.name,
        city: newLandmark.city,
        description: newLandmark.description,
        lat: parseFloat(newLandmark.lat),
        lng: parseFloat(newLandmark.lng),
        image: newLandmark.image,
      },
    ]);
    setNewLandmark({ name: "", city: "", description: "", lat: "", lng: "", image: "" });
  };

  const deleteLandmark = (id: number) => {
    setLandmarks((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <main className="flex flex-col lg:flex-row gap-6 p-6 bg-green-50 mt-5 mockup-window border-base-300">
      {/* Left */}
      <div className="flex-1 space-y-6 mt-5">
        <h1 className="text-3xl font-bold text-green-800">City Admin Panel</h1>

        {/* Add Landmark */}
        <div className="space-y-2">
          <h2 className="font-semibold text-lg">Add Landmark</h2>
          <input
            type="text"
            placeholder="Name"
            className="input input-bordered w-full max-w-xs mr-10"
            value={newLandmark.name}
            onChange={(e) => setNewLandmark({ ...newLandmark, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="City"
            className="input input-bordered w-full max-w-xs"
            value={newLandmark.city}
            onChange={(e) => setNewLandmark({ ...newLandmark, city: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="textarea textarea-bordered w-full max-w-xs mr-10"
            value={newLandmark.description}
            onChange={(e) => setNewLandmark({ ...newLandmark, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="Latitude"
            className="input input-bordered w-full max-w-xs"
            value={newLandmark.lat}
            onChange={(e) => setNewLandmark({ ...newLandmark, lat: e.target.value })}
          />
          <input
            type="text"
            placeholder="Longitude"
            className="input input-bordered w-full max-w-xs mr-10"
            value={newLandmark.lng}
            onChange={(e) => setNewLandmark({ ...newLandmark, lng: e.target.value })}
          />
          <input
            type="text"
            placeholder="Image URL"
            className="input input-bordered w-full max-w-xs"
            value={newLandmark.image}
            onChange={(e) => setNewLandmark({ ...newLandmark, image: e.target.value })}
          />
          <button onClick={addLandmark} className="btn btn-success ml-10">Add Landmark</button>
        </div>

        {/* Landmark List */}
        <div className="space-y-2 mt-6">
          <h2 className="font-semibold text-lg">Current Landmarks</h2>
          <ul className="list-disc pl-5">
            {landmarks.map((lm) => (
              <li key={lm.id}>
                <strong>{lm.name}</strong> ({lm.city}): {lm.description}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right: Map */}
      <div className="w-full lg:w-1/2">
        <LandmarkMap landmarks={landmarks} onDeleteLandmark={deleteLandmark} />
      </div>
    </main>
  );
}

export default LandmarkPanel;
