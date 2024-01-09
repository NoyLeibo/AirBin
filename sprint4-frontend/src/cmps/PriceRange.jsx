import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useSelector } from "react-redux";

function valuetext(value) {
  return `${value}°C`;
}

export function PriceRange({ handlePriceRangeChange }) {
  const [value, setValue] = React.useState(
    useSelector((storeState) => storeState.stayModule.filterBy).priceRange
  );
  const handleChange = (event, newValue) => {
    setValue(newValue);
    handlePriceRangeChange(newValue);
  };

  return (
    <Box sx={{ width: 300 }}>
      <Slider
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
