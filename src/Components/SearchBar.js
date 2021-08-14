import React, { memo, useState } from "react";
import GooglePlaceFinder, {
  geocodeByAddress,
  getDetails,
  getLatLng
} from "../GooglePlaceFinder";
import { classnames } from "../GooglePlaceFinder/helpers";

const SearchBar = memo(function SearchBar(props) {
  const [state, setState] = useState({
    address: "",
    formatted_address: "",
    selectionDetails: "",
    errorMessage: "",
    latitude: null,
    longitude: null,
    isGeocoding: false
  });

  const handleChange = (address) => {
    setState({
      address,
      latitude: null,
      longitude: null,
      errorMessage: ""
    });
  };

  const handleSelect = (selected) => {
    setState({ isGeocoding: true, address: selected });
    geocodeByAddress(selected)
      .then((res) => getLatLng(res[0]))
      .then((res) => {
        console.log(res);
        return getDetails(res);
      })
      .then(
        ({
          latLng: { lat, lng },
          name: selectedName,
          formatted_address,
          ...rest
        }) => {
          setState({
            latitude: lat,
            longitude: lng,
            isGeocoding: false,
            formatted_address: selectedName + " " + formatted_address,
            selectionDetails: rest
          });
        }
      )
      .catch((error) => {
        setState({ isGeocoding: false });
        console.log("error", error);
      });
  };

  const handleCloseClick = () => {
    setState({
      address: "",
      latitude: null,
      longitude: null
    });
  };

  const handleError = (status, clearSuggestions) => {
    console.log("Error from Google Maps API", status);
    setState({ errorMessage: status }, () => {
      clearSuggestions();
    });
  };

  const {
    address,
    errorMessage,
    latitude,
    longitude,
    isGeocoding,
    formatted_address,
    selectionDetails
  } = state;
  return (
    <div>
      <div>
        <GooglePlaceFinder
          onChange={handleChange}
          value={address}
          onSelect={handleSelect}
          onError={handleError}
          shouldFetchSuggestions={address && address.length > 2}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps }) => {
            return (
              <div className="fm_gp___search-bar-container">
                <div className="fm_gp___search-input-container">
                  <input
                    {...getInputProps({
                      placeholder: "Search Places...",
                      className: "fm_gp___search-input"
                    })}
                  />
                  {address && address.length > 0 && (
                    <button
                      className="fm_gp___clear-button"
                      onClick={handleCloseClick}
                    >
                      x
                    </button>
                  )}
                </div>
                {suggestions && suggestions.length > 0 && (
                  <div className="fm_gp___autocomplete-container">
                    {suggestions.map((suggestion) => {
                      const className = classnames("fm_gp___suggestion-item", {
                        "fm_gp___suggestion-item--active": suggestion.active
                      });

                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, { className })}
                        >
                          <strong>
                            {suggestion.formattedSuggestion.mainText}
                          </strong>{" "}
                          <small>
                            {suggestion.formattedSuggestion.secondaryText}
                          </small>
                        </div>
                      );
                    })}
                    <div className="fm_gp___dropdown-footer">
                      <div></div>
                    </div>
                  </div>
                )}
              </div>
            );
          }}
        </GooglePlaceFinder>
        {errorMessage && errorMessage.length > 0 && (
          <div className="fm_gp___error-message">{errorMessage}</div>
        )}

        {((latitude && longitude) || isGeocoding) && (
          <div>
            <h3 className="fm_gp___geocode-result-header">Geocode result</h3>
            {isGeocoding ? (
              <div>
                <i className="fa fa-spinner fa-pulse fa-3x fa-fw fm_gp___spinner" />
              </div>
            ) : (
              <div>
                <div className="fm_gp___geocode-result-item--lat">
                  <label>Name:</label>
                  <span>{formatted_address}</span>
                </div>
                <div className="fm_gp___geocode-result-item--lat">
                  <label>Latitude:</label>
                  <span>{latitude}</span>
                </div>
                <div className="fm_gp___geocode-result-item--lng">
                  <label>Longitude:</label>
                  <span>{longitude}</span>
                </div>
                <div className="fm_gp___geocode-result-item--lng">
                  <details>
                    <summary>Summary</summary>
                    <pre>{JSON.stringify(selectionDetails)}</pre>
                  </details>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default SearchBar;
