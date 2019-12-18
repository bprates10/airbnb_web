import React from "react";
import { Marker } from "react-map-gl";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { Pin } from "./styles";

// lib para trabalhar com moedas - REAL
const intlMonetary = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2
});

// Marker sera usado para fixar o preço no mapa (quando este for movimentado)
const Properties = ({ properties }) =>
  properties.map(property => (
    <Marker
      key={property.id}
      longitude={Number(property.longitude)}
      latitude={Number(property.latitude)}
    >
      <Pin>
        <Link to="">{intlMonetary.format(Number(property.price))}</Link>
      </Pin>
    </Marker>
  ));
// propType: ArrayOF define propriedade como array
// propType: Shape define as keys mais importantes de um object
Properties.propTypes = {
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      price: PropTypes.number,
      longitude: PropTypes.number,
      latitude: PropTypes.number
    })
  ).isRequired
};

export default Properties;
