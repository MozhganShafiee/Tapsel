import React, { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button, Grid } from "@mui/material";

function Slider() {
  const [artWorks, setArtworks] = useState([]);
  const [departments, setDepartments] = useState([]);

  //get number of objects which has details and set it in a state
  const makeCollection = async () => {
    let artWork = [];
    for (let i = 100; i < 110; i++) {
      const responses = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${i}`
      );
      await responses.json().then((data) => {
        console.log(data);
        artWork.push(data);
      });
    }
    setArtworks(artWork);
  };

  //fetch apis while page loading
  useEffect(() => {
    //fetch depertments
    fetch(
      "https://collectionapi.metmuseum.org/public/collection/v1/departments"
    )
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data.departments);
      });

    makeCollection();
  }, []);

  console.log(artWorks);

  //make each slide for 4 arts
  let items = [];
  for (let i = 0; i < artWorks.length; i += 4) {
    items.push(
      <Grid container spacing={0} className="cardLayout" key={i}>
        {artWorks.slice(i, i + 4).map((item, i) => {
          return (
            <div className="card">
              <Paper key={i.toString()}>
                <img src={item.primaryImageSmall} />
                <h3>{item.objectID}</h3>
              </Paper>
              <Button>{item.title}</Button>
            </div>
          );
        })}
      </Grid>
    );
  }
  return (
    <React.Fragment>
      {departments.map((department) => {
        return (
          <div key={department.departmentId}>
            <div className="title">{department.displayName}</div>
            <Carousel autoPlay={false} navButtonsAlwaysVisible>
              {items}
            </Carousel>
          </div>
        );
      })}
    </React.Fragment>
  );
}
export default Slider;
