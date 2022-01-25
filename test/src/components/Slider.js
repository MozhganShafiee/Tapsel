import React, { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button, Grid, Box, Modal } from "@mui/material";

function Slider() {
  const [artWorks, setArtworks] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [detail, setDetail] = useState([]);
  const [open, setOpen] = useState(false);

  //modal openning & closing
  const handleOpen = (e) => {
    setOpen(true);
    setDetail(e);
  };
  const handleClose = () => {
    setOpen(false);
    setDetail([]);
  };
  
  

  //get number of objects which has details and set it in a state
  const makeCollection = async () => {
    let artWork = [];
    for (let i = 100; i < 110; i++) {
      const responses = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${i}`
      );
      await responses.json().then((data) => {
        // console.log(data);
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

  // console.log(artWorks);

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
              <Button className="modalButton" onClick={() => handleOpen(item)}>{item.title}</Button>
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="detailBox">
          <h2>More details...</h2>
          <img src={detail.primaryImage} />
          <div className="detailLayout">
            <div className="detailRow">
              <div className="detailCell">
                <label>Country Name:</label>
                <p>{detail.country}</p>
              </div>
              <div className="detailCell">
                <label>Accession Name:</label>
                <p>{detail.accessionNumber}</p>
              </div>
            </div>
            <div className="detailRow">
              <div className="detailCell">
                <label>Credit Line:</label>
                <p>{detail.creditLine}</p>
              </div>
              <div className="detailCell">
                <label>Medium:</label>
                <p>{detail.medium}</p>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}
export default Slider;
