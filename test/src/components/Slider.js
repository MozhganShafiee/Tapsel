import React, { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button, Grid, Box, Modal } from "@mui/material";

function Slider() {
  const [testDepartments, setTestDepartments] = useState([]);
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

  //fetch apis while page loading
  useEffect(async () => {
    let info = [];
    let dep = {};
    let departmentsData = [];

    //fetch all depertments
    const response = await fetch(
      "https://collectionapi.metmuseum.org/public/collection/v1/departments"
    );
    await response.json().then((data) => {
      console.log(data.departments);
      data.departments.map(async (department) => {
        //fetch all objects depend on every depertment
        const responses = await fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${department.departmentId}`
        );
        await responses.json().then(async (data) => {
          console.log(data);
          let ids;
          //pick limited number of objects based on departments
          for (let i = 1; i < 5; i++) {
            ids = data.objectIDs[i];
            //fetch more details about objects
            const responsess = await fetch(
              `https://collectionapi.metmuseum.org/public/collection/v1/objects/${ids}`
            );
            await responsess.json().then((data) => {
              info.push(data);
            });
          }
          // data.objectIDs.map(async (id) => {
          //   const responsess = await fetch(
          //     `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
          //   );
          //   await responsess.json().then((data) => {
          //     info.push(data);
          //   });
          // });

          //create new object consist of it's depertment title, some object id depend on department, object detail
          dep = {
            id: data.objectIDs,
            title: department.displayName,
            details: info,
          };
          // console.log(dep);
          // departmentsData.push(dep);
          // departmentsData = [...departmentsData, dep];
        });
      });
    });
    //create new state of all deps for map in ui
    setTestDepartments(departmentsData);
  }, []);
  // console.log(testDepartments);

  //make each slide for 4 arts
  let items = [];
  for (let i = 0; i < 11; i += 4) {
    items.push(
      <Grid container spacing={0} className="cardLayout" key={i}>
        {testDepartments.slice(i, i + 4).map((dep, i) => {
          return (
            <div className="card">
              <Paper key={i.toString()}>
                <img src={dep.details.primaryImageSmall} />
                <h3>{dep.id}</h3>
              </Paper>
              <Button className="modalButton" onClick={() => handleOpen(dep)}>
                {dep.title}
              </Button>
            </div>
          );
        })}
      </Grid>
    );
  }
  return (
    <React.Fragment>
      {testDepartments.map((department) => {
        return (
          <div key={department.id}>
            <div className="title">{department.title}</div>
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
