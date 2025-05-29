import station from "../assets/station.jpg";

function BikeList() {
  return (
    <ul className="list bg-base-100 rounded-box shadow-md">
      <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
        Charging stations in your area
      </li>

      <li className="list-row">
        <div>
          <img className="size-10 rounded-box" src={station} />
        </div>
        <div className="list-col-grow">
          <div>Bairro de Santiago</div>
          <div className="text-xs uppercase font-semibold opacity-60">
            7 bikes available
          </div>
        </div>
        <button className="btn btn-primary">Rent Here</button>
      </li>

      <li className="list-row">
        <div>
          <img className="size-10 rounded-box" src={station} />
        </div>
        <div className="list-col-grow">
          <div>Rua da Pega</div>
          <div className="text-xs uppercase font-semibold opacity-60">
            3 bikes available
          </div>
        </div>
        <button className="btn btn-primary">Rent Here</button>
      </li>

      <li className="list-row">
        <div>
          <img className="size-10 rounded-box" src={station} />
        </div>
        <div className="list-col-grow">
          <div>Vila Jovem</div>
          <div className="text-xs uppercase font-semibold opacity-60">
            No bikes available
          </div>
        </div>
        <button className="btn btn-primary">Rent Here</button>
      </li>
    </ul>
  );
}

export default BikeList;
