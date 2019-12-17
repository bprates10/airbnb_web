import React, { Component } from "react";
import Dimensions from "react-dimensions";
import { Container } from "./styles";
import MapGL from "react-map-gl";
import PropTypes from "prop-types";
// função que retarda a execução de outra função
// usada para que, quando o mapa for movimentado (função updatePropertiesLocalization)
// o debounce pega a última chamada dela,
// se em um 500 milissegundos não existir nenhuma outra chamada, ela busca na API as properties de acordo com a nova localização
import debounce from "lodash/debounce";
import api from "../../services/api";

import Properties from "./components/Properties";

const TOKEN =
  "pk.eyJ1IjoiYnByYXRlczEwIiwiYSI6ImNrNDl3NmF0dDA4ZHczbW4yZW1rdWJrOTQifQ.UzKv3rtnA1Su1GWa0cuctQ";

class Map extends Component {
  static propTypes = {
    containerWidth: PropTypes.number.isRequired,
    containerHeight: PropTypes.number.isRequired
  };

  constructor() {
    super();
    this.updatePropertiesLocalization = debounce(
      this.updatePropertiesLocalization,
      500
    );
  }

  state = {
    viewport: {
      latitude: -27.2108001,
      longitude: -49.6446024,
      zoom: 12.8,
      bearing: 0,
      pitch: 0
    },
    properties: []
  };

  //
  componentDidMount() {
    // carrega as properties da API
    this.loadProperties();
  }

  // tambem carrega as properties da API
  updatePropertiesLocalization() {
    // resgata latitude e longitude do estado do componente
    this.loadProperties();
  }

  loadProperties = async () => {
    const { latitude, longitude } = this.state.viewport;
    try {
      const response = await api.get("/properties", {
        params: { latitude, longitude }
      });
      // console.log(response.data);
      this.setState({ properties: response.data });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { containerWidth: width, containerHeight: height } = this.props;
    // pega as properties do state do componente
    const { properties } = this.state;
    console.log("ETCHA", properties);
    return (
      // properties && (
      <MapGL
        width={width}
        height={height}
        {...this.state.viewport}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxApiAccessToken={TOKEN}
        onViewportChange={viewport => this.setState({ viewport })}
        // chama a função responsavel por resgatar novas properties quando o mapa mudar
        onViewStateChange={this.updatePropertiesLocalization.bind(this)}
      >
        <Properties properties={properties} />
      </MapGL>
    );
    // );
  }
}

const DimensionedMap = Dimensions()(Map);
const App = () => (
  <Container>
    <DimensionedMap />
  </Container>
);

export default App;
