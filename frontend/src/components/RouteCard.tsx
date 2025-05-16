import React from 'react';

interface RouteCardProps {
  title: string;
  description: string;
  location: string;
  distance: string;
  estimatedTime: string;
  spots: string[];
  image: string;
}

function RouteCard({ title, description, location, distance, estimatedTime, spots, image }: RouteCardProps) {
  return (
    <main className="flex flex-col items-center p-4">
      <div className="card card-side bg-blue-50 shadow-sm flex-row-reverse w-full max-w-4xl">
        <figure className="w-1/2">
          <img src={image} alt={title} className="w-full h-full object-cover rounded-l-lg" />
        </figure>
        <div className="card-body w-1/2">
          <h2 className="card-title">{title}</h2>
          <p className="leading-relaxed">
            <strong>Description:</strong> {description}
            <br />
            <strong>Location:</strong> {location}
            <br />
            <strong>Distance:</strong> {distance}
            <br />
            <strong>Estimated Time:</strong> {estimatedTime}
            <br />
            <strong>Spots to Visit:</strong>
            <ul className="list-disc list-inside">
              {spots.map((spot, index) => (
                <li key={index}>{spot}</li>
              ))}
            </ul>
          </p>
          <div className="card-actions justify-end">
            <a href="route" className="btn btn-primary">Open</a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RouteCard;
