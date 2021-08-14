import React from "react";
import "./App.css";
import "./index.css";

const SearchBar = React.lazy(() => import("./Components/SearchBar"));

function App() {
  return (
    <div className="App">
      <React.Suspense fallback="loading...">
        <header className="App-header">
          <h2> Google Places Autocomplete</h2>
          <SearchBar />
        </header>
      </React.Suspense>
    </div>
  );
}

export default App;
