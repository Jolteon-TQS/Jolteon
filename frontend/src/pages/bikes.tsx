import { useState } from "react";
import BikeList from "../components/BikeList";
import Map from "../components/Map";

function Bikes() {
    const [wantsRoute, setWantsRoute] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState("");

    return (
        <main className="flex flex-col lg:flex-row gap-6 p-6">
            {/* Left Side */}
            <div className="flex-1 space-y-4">
                <h1 className="text-3xl font-bold text-primary">Rent a Bike</h1>

                {/* Time Picker */}
                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">Choose Time</span>
                    </label>
                    <input
                        type="time"
                        className="input input-bordered"
                    />
                </div>

                {/* Route Option */}
                <div className="form-control">
                    <label className="cursor-pointer label">
                        <span className="label-text">Do you want a route?</span>
                        <input
                            type="checkbox"
                            className="checkbox checkbox-primary"
                            checked={wantsRoute}
                            onChange={() => setWantsRoute(!wantsRoute)}
                        />
                    </label>
                </div>

                {/* Destination Dropdown */}
                {wantsRoute && (
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Select Destination</span>
                        </label>
                        <select
                            className="select select-bordered"
                            value={selectedDestination}
                            onChange={(e) => setSelectedDestination(e.target.value)}
                        >
                            <option disabled value="">Pick a location</option>
                            <option>Campus Library</option>
                            <option>Central Cafeteria</option>
                            <option>North Dorms</option>
                            <option>Gymnasium</option>
                        </select>
                    </div>
                )}

                {/* Bike List */}
                <label className="label">
                            <span className="label-text">Select Charging Station</span>
                        </label>
                <BikeList />
            </div>

            {/* Right Side: Map */}
            <div className="w-full lg:w-1/2">
                <Map />
            </div>
        </main>
    );
}

export default Bikes;
