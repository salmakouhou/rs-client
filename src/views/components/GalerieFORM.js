import React, { Fragment, useState, useContext } from "react";
import "../../assets/css/form.css";

const GalerieFORM = ({ inputs, setInputs, handleSubmit, inputsSkeleton, cancelEdit, action, twoColumns }) => {

  const handleInputsChange = (event) => {
    event.persist();
    if (event.target.name == "file") {
      var keys = Object.keys(event.target.files);
      var files = event.target.files
      keys.forEach((key) => {
        setInputs((inputs) => ({
          ...inputs,
          [files[key].lastModified]: files[key],
        }));
      })

    } else {
      setInputs((inputs) => ({
        ...inputs,
        [event.target.name]: event.target.value,
      }));
    }
  };


  return (
    <div className="card">
      <form method="POST" onSubmit={handleSubmit}>
        <div className="card-header">
          <h3 className="card-title">Ajouter une photo</h3>
        </div>
        <div className={`card-body form `}>
          <ul className={twoColumns || "none"}>
            {inputsSkeleton.map((input, index) => (
              <li className={twoColumns || ""} key={index}>
                <Fragment>
                  
                  {input.type === "file" && input.label === "Joidre la photo" && (

                    <div className="form-group mt-2 ">
                      <label className="form-label">{input.label}</label>
                      <input type="file" className="" accept=".jpg, .jpeg, .png"
                        onChange={handleInputsChange} multiple name={input.name} required />
                    </div>
                  )}

                  {input.type === "file" && input.label === "Joindre la photo" && (

                    <div className="form-group mt-2 ">
                      <label className="form-label">{input.label}</label>
                      <input type="file" className="" accept=".jpg, .jpeg, .png"
                        onChange={handleInputsChange}  name={input.name} required />
                    </div>
                  )}
                </Fragment>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-footer text-right">
          <button onClick={cancelEdit} className="mr-2 btn btn-outline-danger">
            Annuler
          </button>
          <button type="submit" className="btn btn-primary">
            Soumettre
          </button>
        </div>
      </form>
    </div>
  );
};

export default GalerieFORM;