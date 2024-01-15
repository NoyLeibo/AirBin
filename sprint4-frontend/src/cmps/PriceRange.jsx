import * as React from "react";
import{ useEffect, useState } from "react"
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useSelector } from "react-redux";

function valuetext(value) {
  return `${value}`;
}

export function PriceRange({ handlePriceRangeChange ,selectedPriceMin ,selectedPriceMax}) {
  // const [value, setValue] = React.useState(
  //   useSelector((storeState) => storeState.stayModule.filterBy).priceRange
  //   );
  useEffect(() => {
    setValue([selectedPriceMin,selectedPriceMax]);
  }, [selectedPriceMin,selectedPriceMax]);
  const [value, setValue] = useState(
    [selectedPriceMin,selectedPriceMax]
    );

  const handleChange = (event, newValue) => {
    setValue(newValue);
    handlePriceRangeChange(newValue);
  };
  return (
    <Box sx={{ width: 300 }}>
      <Slider
      className="slider-color"
        getAriaLabel={() => "Temperature range"}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        min={0}
        max={2000}
      />
    </Box>
  );
}
