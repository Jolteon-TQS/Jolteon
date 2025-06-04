import BikeList from "../components/BikeList";
import Map from "../components/StationsMap";

function Bikes() {
  return (
    <main className="flex flex-col lg:flex-row gap-6 p-10 bg-orange-50 mt-5 window border-base-300 mt-40">
      {/* Left Side */}
      <div className="flex-1 space-y-4 mt-5">
        <h1 className="text-3xl font-bold text-primary">Rent a Bike</h1>

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
