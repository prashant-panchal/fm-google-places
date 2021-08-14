export const geocodeByAddress = (address) => {
  const geocoder = new window.google.maps.Geocoder();
  const OK = window.google.maps.GeocoderStatus.OK;

  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status !== OK) {
        reject(status);
      }
      resolve(results);
    });
  });
};

export const getLatLng = (result) => {
  return new Promise((resolve, reject) => {
    try {
      const latLng = {
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng()
      };
      resolve({ ...result, latLng, placeId: result.place_id });
    } catch (e) {
      reject(e);
    }
  });
};

export const geocodeByPlaceId = (placeId) => {
  const geocoder = new window.google.maps.Geocoder();
  const OK = window.google.maps.GeocoderStatus.OK;

  return new Promise((resolve, reject) => {
    geocoder.geocode({ placeId }, (results, status) => {
      if (status !== OK) {
        reject(status);
      }
      resolve(results);
    });
  });
};

export const getDetails = (args) => {
  const PlacesService = new window.google.maps.places.PlacesService(
    document.createElement("div")
  );

  if (!args.place_id) {
    console.error("placeId is missing");
    return Promise.reject("placeId is missing");
  }

  return new Promise((resolve, reject) => {
    PlacesService.getDetails(args, (results, status) => {
      if (status !== "OK") reject(status);
      resolve({ ...args, results });
    });
  });
  return {};
};
