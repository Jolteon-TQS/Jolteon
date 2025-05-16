import Map from '../components/Map';
import ebike from '../assets/ebike.png';
import MyMap from '../components/MyMap';

function Home() {
  return (
    <main className="flex flex-col items-center p-4 mt-30">
      <div className="card card-side bg-blue-50 shadow-sm flex-row-reverse w-full max-w-4xl">
        <figure className="w-1/2">
          <MyMap />
        </figure>
        <div className="card-body w-1/2">
          <h2 className="card-title">Route</h2>
          <p>
            <strong>Start Location:</strong> Bairro de Santiago, Aveiro, Portugal
            <br />
            <strong>End Location:</strong> Costa Nova, Aveiro, Portugal
            <br />
            <strong>Distance:</strong> 5 kilometers
            <br />
            <strong>Estimated Time:</strong> 1 hour
            <br />
            <strong>Spots to Visit:</strong>
            <ul className="list-disc list-inside">
              <li>Park of Santiago</li>
              <li>Costa Nova Beach</li>
              <li>Moliceiro Boats</li>
              <li>Fish Market</li>
            </ul>
            <br />
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
