import React, { useState, useEffect } from "react";
import axios from "../../axios";
import Item from "../Project/Item";
import PlotsTable from "../Plot/PlotsTable"


export default function ProjectDetails({ base_url, match }) {
  const project_id = match.params.project_id;
  const endpoint = base_url + "projects/" + project_id + "/";

  const [project_details, setProjectDetails] = useState({ plots: {} });
  const [aggregates, setAggregates] = useState({
    plots_sold: 0,
    area_sold: 0,
    plots_left: 0,
    area_left: 0,
  })

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    axios
      .get(endpoint)
      .then((response) => {
        setIsLoaded(true);
        setProjectDetails(response.data);
        console.log(response.data);
      })
      .catch((errors) => {
        setIsLoaded(true);
        setError(errors);
        console.log(errors);
      });
  }, [endpoint]);

  
  React.useEffect(()=>{
    let plot_list = Object.values(project_details.plots)
    let new_agg = {
      plots_sold: 0,
      area_sold: 0,
      plots_left: 0,
      area_left: 0,
    }
    plot_list.forEach((plot)=>{
      if (plot.deal){
        new_agg.plots_sold += 1
        new_agg.area_sold += plot.area
      }
    })
    new_agg.plots_left = project_details.total_plots - new_agg.plots_sold
    new_agg.area_left = project_details.total_area - new_agg.area_sold
    setAggregates(new_agg)
  }, [project_details])


  // PUT
  const updateItem = (id, index, new_obj) => {
    return axios
      .put(endpoint, new_obj)
      .then((response) => {
        console.log(response);
        const new_project_details = { ...project_details };
        Object.keys(response.data).forEach((field) => {
          new_project_details[field] = response.data[field];
        });
        setProjectDetails(new_project_details);
        return true;
      })
      .catch((error) => {
        console.log(error.response);
        if (error.response && error.response.data.detail === "Authentication credentials were not provided.") {
            alert("Please Login First!");
        }
        else {
            alert("Some Error Occured while making request")
        }
        return false;
      });
  };

  //DELETE
  const deleteItem = (id, index) => {}; // will not be called because we cannot delete a Project, therefore not implemented

  const displayProjectDetails = () => {
    if (error) {
      return (
        <tr>
          <td> Error: {error.message} </td>
        </tr>
      );
    } else if (!isLoaded) {
      return (
        <tr>
          <td> Loading... </td>
        </tr>
      );
    } else {
      return (
        <Item
          title="Projects"
          obj={{...project_details, ...aggregates}}
          index={project_details.id}
          updateItem={updateItem}
          deleteItem={deleteItem}
        />
      );
    }
  };

  return (
    <div className="my-4 px-3">
      <div>
        <div style={{ paddingBottom: "10px" }}>
          <h1 className="d-inline"> {project_details.name} </h1>
        </div>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Address</th>
                <th scope="col">No. of Plots</th>
                <th scope="col">Total Area</th>
                <th scope="col">Plots Sold</th>
                <th scope="col">Area Sold</th>
                <th scope="col">Plots Left</th>
                <th scope="col">Area Left</th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>{displayProjectDetails()}</tbody>
          </table>
        </div>
      </div>
	  <PlotsTable
	  title="Plots"
	  base_url={endpoint}
	  project_details={project_details}
	  setProjectDetails={setProjectDetails}
	  />
    </div>
  );
}
