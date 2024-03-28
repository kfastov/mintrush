import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { useBlock } from "@starknet-react/core";
import Header from "./components/Header";
import Images from "./components/Images";
import HomePage from './components/HomePage';
import CreateCollectionPage from './components/CreateCollectionPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateCollectionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
