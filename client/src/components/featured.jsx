import React from "react";
import FeaturedProducts from "./featuredProducts";

const Featured = () => {
  return (
    <>
      <div id="gallery-head">
        <h1> Featured Products </h1>
      </div>
      <div id="card-container">
        <FeaturedProducts limit={5} />
      </div>
    </>
  );
};

export default Featured;
