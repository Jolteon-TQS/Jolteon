import { useState } from "react";
import PanelMap from "../components/PanelMap";

function Panel() {
  const [bikes, setBikes] = useState([
    { id: 1, name: "Bike 1", lat: 40.6408, lng: -8.6515, status: "Active - Battery: 70%" },
    { id: 2, name: "Bike 2", lat: 40.642, lng: -8.648, status: "Idle - Battery: 45%" },
  ]);

  const [stations, setStations] = useState([
    { id: 1, name: "Central Station", lat: 40.6410, lng: -8.6530 },
    { id: 2, name: "North Hub", lat: 40.6430, lng: -8.6600 },
  ]);

  const [newBike, setNewBike] = useState({ name: "", lat: "", lng: "" });
  const [newStation, setNewStation] = useState({ name: "", lat: "", lng: "" });

  const addBike = () => {
    const id = bikes.length + 1;
    setBikes([...bikes, { id, name: newBike.name, lat: parseFloat(newBike.lat), lng: parseFloat(newBike.lng), status: "Idle - Battery: 100%" }]);
    setNewBike({ name: "", lat: "", lng: "" });
  };

  const addStation = () => {
    const id = stations.length + 1;
    setStations([...stations, { id, name: newStation.name, lat: parseFloat(newStation.lat), lng: parseFloat(newStation.lng) }]);
    setNewStation({ name: "", lat: "", lng: "" });
  };

  // Inside Panel component:

const deleteBike = (id: number) => {
  setBikes((prev) => prev.filter((b) => b.id !== id));
};

const deleteStation = (id: number) => {
  setStations((prev) => prev.filter((s) => s.id !== id));
};

  return (
    <main className="flex flex-col lg:flex-row gap-6 p-6 bg-orange-100 mt-5 mockup-window border-base-300">
      {/* Left Side */}
      <div className="flex-1 space-y-6 mt-5">
        <h1 className="text-3xl font-bold text-orange-700">Control Panel</h1>

        {/* Add New Bike */}
        <div className="space-y-2">
          <h2 className="font-semibold text-lg">Add New Bike</h2>
          <input
            type="text"
            placeholder="Bike Name"
            className="input input-bordered w-full max-w-xs mr-10"
            value={newBike.name}
            onChange={(e) => setNewBike({ ...newBike, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Latitude"
            className="input input-bordered w-full max-w-xs"
            value={newBike.lat}
            onChange={(e) => setNewBike({ ...newBike, lat: e.target.value })}
          />
          <input
            type="text"
            placeholder="Longitude"
            className="input input-bordered w-full max-w-xs"
            value={newBike.lng}
            onChange={(e) => setNewBike({ ...newBike, lng: e.target.value })}
          />
          <button onClick={addBike} className="btn btn-secondary ml-10">Add Bike</button>
        </div>

        {/* Add New Station */}
        <div className="space-y-2">
          <h2 className="font-semibold text-lg">Add Charging Station</h2>
          <input
            type="text"
            placeholder="Station Name"
            className="input input-bordered w-full max-w-xs mr-10"
            value={newStation.name}
            onChange={(e) => setNewStation({ ...newStation, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Latitude"
            className="input input-bordered w-full max-w-xs"
            value={newStation.lat}
            onChange={(e) => setNewStation({ ...newStation, lat: e.target.value })}
          />
          <input
            type="text"
            placeholder="Longitude"
            className="input input-bordered w-full max-w-xs"
            value={newStation.lng}
            onChange={(e) => setNewStation({ ...newStation, lng: e.target.value })}
          />
          <button onClick={addStation} className="btn btn-secondary ml-10">Add Station</button>
        </div>

        {/* View Bike Status */}
        <div className="space-y-2 mt-6">
          <h2 className="font-semibold text-lg">All Bikes</h2>
          <ul className="list-disc pl-5">
            {bikes.map((bike) => (
              <li key={bike.id}>
                <strong>{bike.name}</strong>: {bike.status}
              </li>
            ))}
          </ul>
        </div>

        {/* View Station Status */}
      <div className="space-y-2 mt-6">  
        <h2 className="font-semibold text-lg">All Charging Stations</h2>
        <ul className="list-disc pl-5">
          {stations.map((station) => (
            <li key={station.id}>
              <strong>{station.name}</strong>: {station.lat}, {station.lng}
            </li>
          ))}
        </ul>
      </div>
      </div>
      {/* Right Side: Map */}
      <div className="w-full lg:w-1/2">
        <PanelMap bikes={bikes} stations={stations} onDeleteBike={deleteBike} onDeleteStation={deleteStation} />
      </div>
    </main>
  );
}

export default Panel;
