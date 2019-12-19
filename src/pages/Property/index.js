import React, { Component, Fragment } from "react";
import { Container, Images } from "./styles";
import PropTypes from "prop-types";

import api from "../../services/api";

const intlMonetary = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2
});

export default class Property extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string
      })
    }).isRequired
  };
  state = {
    property: null,
    loading: false
  };

  // busca da url o ID do imovel, usado para pegar as informações dele
  async componentDidMount() {
    try {
      const { id } = this.props.match.params;
      // loading setado para true
      this.setState({ loading: true });

      const { data } = await api.get(`/properties/${id}`);
      // console.log(data);
      this.setState({ property: data });
      // console.log(this.state);
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  }

  renderProperty() {
    // console.log(this.state);
    const { property } = this.state;

    if (!property) {
      return "Imóvel não encontrado!";
    }
    // console.log(property.images);
    return (
      <Fragment>
        <h1>{property.title}</h1>
        <hr />
        <p>{property.address}</p>
        <Images>
          {property.images.map(image => (
            <img src={image.url} alt={image.path} />
          ))}
        </Images>
        <span>{intlMonetary.format(property.price)}</span>
      </Fragment>
    );
  }

  render() {
    const { loading } = this.state;
    return (
      <Container>
        {loading ? <p>Carregando</p> : this.renderProperty()}
      </Container>
    );
  }
}
