import Map from '../components/StationsMap';
import ebike from '../assets/ebike.png';
import BikeMap from '../components/BikeMap';

function Home() {
  return (
    <main className="flex flex-col items-center p-4 mt-15">
      <div className="card card-side bg-blue-50 shadow-sm flex-row-reverse w-full max-w-4xl">
        <figure className="w-1/2">
          <BikeMap />
        </figure>
        <div className="card-body w-1/2">
          <h2 className="card-title">Active Bike</h2>
          <p>
            <strong>Remaining Time:</strong> 30 minutes 
            <br />
            <strong>Location:</strong> 123 Main St, Cityville
            <br />
            <strong>Distance Traveled:</strong> 5 kilometers
            <br />
            <strong>Battery Level:</strong>
            <br />
            <div className="radial-progress text-primary" style={{ '--value': 70 } as React.CSSProperties} aria-valuenow={70} role="progressbar">70%</div>
            <br />
            <img src={ebike} className='h-20' alt="Bike Image" />
          </p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">End Trip</button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
