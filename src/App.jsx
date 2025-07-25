import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select, CardContent, Card } from "@mui/material";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import './App.css';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");



  //STATE = How to write a variable in react

  //https://disease.sh/v3/covid-19/countries

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) =>{
      setCountryInfo(data);
    });
  }, []); 

  //USEEFFECT = runs a piece of code based on the condition 

      {/*Header*/}
      {/*Title + Select input dropdown field */}

  useEffect(() => {
    //async -> send a request, wait for it, 

    const getCountriesData = async() =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name : country.country,
            value : country.countryInfo.iso2 //UK, USA, FR
          }));


        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };
    getCountriesData();
  }, []); 

  const onCountryChange = async (event) =>{
    const countryCode = event.target.value;
    setCountry(countryCode);


    //https://disease.sh/v3/covid-19/all
    //https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
    const url = countryCode ==='worldwide'?'https://disease.sh/v3/covid-19/all'
    :`https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);

      //All of the data from the country response...
      
      setCountryInfo(data);
    });
  };
  
  console.log("countryInfo>>>" , countryInfo) 

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID-19 TRACKER</h1>
        <FormControl className="app_dropdown">
          <Select variant ="outlined" onChange={onCountryChange}  value={country}> 
            {/*Loop through all the countries and showm the dropdown list of the options */}
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {
              countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>  
              ))
            }

            {/* <MenuItem value="worldwide">Worldwide</MenuItem>*/}
          </Select>
        </FormControl>
        </div>
      

      <div className="app_stats">
        <InfoBox 
          onClick={(e) =>setCasesType('cases')}
            title="Coronavirus cases" 
            cases={(countryInfo.todayCases)} 
            total={countryInfo.cases}/>

        <InfoBox 
          onClick={(e) =>setCasesType('recovered')}
            title="Recovered" 
            cases={countryInfo.todayRecovered} 
            total={countryInfo.recovered} />

        <InfoBox 
          onClick={(e) =>setCasesType('deaths')}
            title="Deaths" 
            cases={countryInfo.todayDeaths} 
            total={countryInfo.deaths} />

        {/*Infoboxs title="coronavirus cases"*/}
        {/*Infoboxs title="coronavirus recoveries"*/}
        {/*Infoboxs*/}
      </div>

      {/*Map*/}

      <Map countries={mapCountries} casesType={casesType} />
    </div>

      <Card className="app_right">
        <CardContent>
          <h3>Live cases by Country</h3>
            {/*Table*/}
          <Table countries={tableData} />
          <h3>Worlwide new cases</h3>
          <LineGraph />
            {/*Graph*/}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
