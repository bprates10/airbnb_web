// import React, { Component } from "react";
// Fragment que serve apenas para encapsular outros elementos
import React, { Component, Fragment } from "react";
import Dimensions from "react-dimensions";
// import { Container } from "./styles";
import MapGL from "react-map-gl";
import PropTypes from "prop-types";
// função que retarda a execução de outra função
// usada para que, quando o mapa for movimentado (função updatePropertiesLocalization)
// o debounce pega a última chamada dela,
// se em um 500 milissegundos não existir nenhuma outra chamada, ela busca na API as properties de acordo com a nova localização
import debounce from "lodash/debounce";
import api from "../../services/api";

import Properties from "./components/Properties";
// cuidar da navegação
import { withRouter } from "react-router-dom";
// será responsável por remover o token
import { logout } from "../../services/auth";
// componente Button customizado e o ButtonContainer para deixar o Button no canto inferior da tela
import Button from "./components/Button";
// import { Container, ButtonContainer } from "./styles";
import { Container, ButtonContainer, PointReference } from "./styles";
// faz o papel do route na chamada do modal
import { ModalRoute } from "react-router-modal";
import AddProperty from "../AddProperty";
import Property from "../Property";

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
    properties: [],
    addActivate: false
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

  // chama o logout e redireciona para pagina principal
  handleLogout = e => {
    logout();
    this.props.history.push("/");
  };

  // quando add, redirecionar para nova pagina com latitude e longitude presentes para add demais informações
  handleAddProperty = () => {
    const { match, history } = this.props;
    const { latitude, longitude } = this.state.viewport;
    history.push(
      `${match.url}/properties/add?latitude=${latitude}&longitude=${longitude}`
    );

    this.setState({ addActivate: false });
  };

  // contem os buttons
  renderActions() {
    return (
      <ButtonContainer>
        <Button
          color="#fc6963"
          onClick={() => this.setState({ addActivate: true })}
        >
          <i className="fa fa-plus" />
        </Button>
        <Button color="#222" onClick={this.handleLogout}>
          <i className="fa fa-times" />
        </Button>
      </ButtonContainer>
    );
  }

  renderButtonAdd() {
    return (
      this.state.addActivate && (
        <PointReference>
          <i className="fa fa-map-marker" />
          <div>
            <button onClick={this.handleAddProperty} type="button">
              Adicionar
            </button>
            <button
              onClick={() => this.setState({ addActivate: false })}
              className="cancel"
            >
              Cancelar
            </button>
          </div>
        </PointReference>
      )
    );
  }

  // Repare que só aparecerá as Properties quando o addActivate for false,
  // e para não poluir o render foi criada um novo método que adiciona o PointReference caso o addActivate seja true.

  render() {
    // const { containerWidth: width, containerHeight: height } = this.props;
    const {
      containerWidth: width,
      containerHeight: height,
      match
    } = this.props;
    // pega as properties do state do componente
    // const { properties } = this.state;
    const { properties, addActivate } = this.state;
    // console.log("ETCHA", properties);
    return (
      <Fragment>
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
          {!addActivate && <Properties match={match} properties={properties} />}
          {/* <Properties properties={properties} /> */}
        </MapGL>
        {this.renderActions()}
        {this.renderButtonAdd() /* Esse aqui será adicionado */}

        <ModalRoute
          path={`${match.url}/properties/add`}
          parentPath={match.url}
          component={AddProperty}
        />
        <ModalRoute
          path={`${match.url}/property/:id`}
          parentPath={match.url}
          component={Property}
        />
      </Fragment>
    );
    // );
  }
}

// const DimensionedMap = Dimensions()(Map);
const DimensionedMap = withRouter(Dimensions()(Map));
const App = () => (
  <Container>
    <DimensionedMap />
  </Container>
);

export default App;
