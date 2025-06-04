import { useState } from "react";
import BikeList from "../components/BikeList";
import Map from "../components/StationsMap";

function Bikes() {
  const [duration, setDuration] = useState<number | null>(null); // null means indefinite

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDuration(value === "indefinite" ? null : parseInt(value));
  };

  return (
    <main className="flex flex-col lg:flex-row gap-6 p-10 bg-orange-50 mt-5 window border-base-300 mt-40">
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
      <div className="w-full lg:w-1/2">
        <Map />
      </div>
    </main>
  );
}

export default Bikes;
