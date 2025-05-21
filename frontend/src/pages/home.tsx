import ebike from '../assets/ebike.png';
import BikeMap from '../components/BikeMap';

function Home() {
  return (
    <main className="flex flex-col lg:flex-row gap-6 p-6 bg-blue-50 mt-5 mockup-window border-base-300">
      {/* Left: Info Panel */}
      <div className="flex-1 space-y-6 mt-5">
        <h1 className="text-3xl font-bold text-blue-800">Active Bike</h1>

        <div className="space-y-4">
          <div className="text-lg space-y-1">
            <p><strong>Remaining Time:</strong> 30 minutes</p>
            <p><strong>Location:</strong> 123 Main St, Cityville</p>
            <p><strong>Distance Traveled:</strong> 5 kilometers</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <strong>Battery Level</strong>
              <div
                className="radial-progress text-info mt-2"
                style={{ '--value': 70 } as React.CSSProperties}
                role="progressbar"
                aria-valuenow={70}
              >
                70%
              </div>
            </div>

            <img src={ebike} alt="E-Bike" className="h-24 rounded" />
          </div>

          <div className="card-actions">
            <button className="btn btn-info">End Trip</button>
          </div>
        </div>
      </div>

      {/* Right: Map */}
      <div className="w-full lg:w-1/2">
        <BikeMap />
      </div>
    </main>
  );
}

export default Home;
