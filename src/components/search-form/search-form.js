import React from 'react';
import './search-form.css';

function ErrorDisplay(props) {
  if (!props.validation && !props.empty) {
    return null;
  }

  const message = props.validation ? "The input provided was empty or invalid." : "There were no search results";

  return (
    <div className="alert alert-danger">
      {message}
    </div>
  );
}

function SearchResultItem(props) {
  return (
    <div className="search-result-item">
      <img className="flag" src={props.data.flagUrl} alt="Flag" />
      <div className="name">
        {props.data.countryName}
      </div>
      <div className="alpha-code-2">
        {props.data.alphaCode2}
      </div>
      <div className="alpha-code-3">
        {props.data.alpha3Code3}
      </div>
      <div className="region">
        {props.data.region}
      </div>
      <div className="subregion">
        {props.data.subregion}
      </div>
      <div className="population">
        {props.data.population}
      </div>
      <div className="languages">
        <ul>
          {props.data.languages.map(lang => <li>{lang}</li>)}
        </ul>
      </div>
    </div>
  );
}

function SearchResultSummary(props) {
  if (props.data.length < 1) {
    return null;
  }

  const regionSummary = {};
  const subregionSummary = {};

  props.data.forEach(function(country) {
    if (regionSummary.hasOwnProperty(country.region)) {
      regionSummary[country.region]++;
    } else {
      regionSummary[country.region] = 1;
    }

    if (subregionSummary.hasOwnProperty(country.subregion)) {
      subregionSummary[country.subregion]++;
    } else {
      subregionSummary[country.subregion] = 1;
    }
  });

  return (
    <div className="result-summary">
      <div className="country-count">
        Total countries found: {props.data.length}
      </div>
      <div className="region-summary">
        <ul>
          <li className="list-header">Regions</li>
          {Object.keys(regionSummary).map(region => <li>{region}: {regionSummary[region]}</li>)}
        </ul>
      </div>
      <div className="subregion-summary">
        <ul>
          <li className="list-header">Subregions</li>
          {Object.keys(subregionSummary).map(subregion => <li>{subregion}: {subregionSummary[subregion]}</li>)}
        </ul>
      </div>
    </div>
  );
}

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: 'Please enter the name of a country you would like to search for',
      value: '',
      invalidInput: false,
      emptyResult: false,
      countries: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  fetchCountryData(query) {
    var xhr = new XMLHttpRequest()

    xhr.addEventListener('load', () => {
      const response = JSON.parse(xhr.responseText);
      this.setState({
        countries: response.data,
        emptyResult: (response.data.length === 0)
      })
    })

    xhr.open('GET', 'https://countrysearchtest.azurewebsites.net/?country='+query);
    xhr.send();
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.value.length > 0) {
      this.fetchCountryData(this.state.value);
    }

    this.setState({
      invalidInput: (this.state.value.length < 1)
    });
  }

  render() {
    return (
      <div className="country-search-form">
        <ErrorDisplay validation={this.state.invalidInput} empty={this.state.emptyResult} />
        <h4>Please enter a country code or name to search for</h4>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input type="text" id="countrySearch" placeholder="Search for a country" value={this.state.value} onChange={this.handleChange} />
          </div>
          <div className="form-group">
            <input type="submit" value="Search" />
          </div>
        </form>
        <div className="country-search-result">
          {this.state.countries.map(country => <SearchResultItem data={country} />)}
        </div>
        <SearchResultSummary data={this.state.countries} />
      </div>
    );
  }
}

export default SearchForm;