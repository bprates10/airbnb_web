import React from "react";
import PropTypes from "prop-types";

import { Button } from "./styles";

const CustomButton = ({ children, color, ...props }) => (
  <Button type="button" color={color} {...props}>
    {children}
  </Button>
);

// CustomButton.PropTypes
