function Map() {
  return (
    <div className="mockup-window border border-base-300 w-full">
      <div className="border-t border-base-300 h-120">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3666.184379253479!2d-8.65702504689972!3d40.631237678041714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-PT!2spt!4v1747151267548!5m2!1spt-PT!2spt"
          className="w-full h-full"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}

export default Map;
