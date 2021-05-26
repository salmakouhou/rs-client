/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect, useCallback } from "react";

import { AppContext } from "../../context/AppContext";
import PageHeader from "../components/PageHeader";
import { Link } from "react-router-dom";
import UserListItem from "../Author/components/UserListItem";

const LaboratoryHeads = (props) => {
  const [laboratoryHeads, setLaboratoryHeads] = useState([]);
  const [newEmail, setNewEmail] = useState("");

  const { user, ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { userService } = ApiServices;

  const updateData = useCallback(async () => {
    try {
      const response = await userService.getLaboratoryHeads();
      if (response.data) setLaboratoryHeads(response.data);
      else throw Error();
    } catch (error) {
      pushAlert({
        message: "Incapable d'obtenir les donnees des chefs de laboratoire",
      });
    }
  }, []);

  const handleEmailChange = (event) => {
    event.persist();
    setNewEmail(event.target.value);
  };

  useEffect(() => {
    updateData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const password = Math.random().toString(36).slice(-8);

    try {
      const response = await userService.createUser({
        email: newEmail,
        password,
        roles: "LABORATORY_HEAD",
        creatorId: user._id,
      });
      if (response.data) updateData();
      else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable de créer l'utilisateur" });
    }
  };

  return (
    <div className="container">
      <PageHeader title="Géstion des comptes des chefs des laboratoires" />
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Creation</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 col-xl-12">
                  <div className="mb-3">
                    <label className="form-label">
                      Email de chef de laboratoire
                    </label>
                    <form onSubmit={handleSubmit}>
                      <div className="input-group mb-2">
                        <input
                          required
                          type="email"
                          className="form-control"
                          placeholder="example@domaine.com"
                          onChange={handleEmailChange}
                          value={newEmail.email}
                          name="email"
                        />
                        <span className="input-group-append">
                          <button className="btn btn-secondary" type="submit">
                            Créer
                          </button>
                        </span>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card ">
            <div className="card-header">
              <h3 className="card-title">Comptes invités</h3>
            </div>
            <div className="card-body p-0">
              <div
                style={{ height: "300px", maxHeight: "300px" }}
                className="list overflow-auto list-row list-hoverable"
              >
                {laboratoryHeads
                  .filter(
                    (laboratoryHead) =>
                      laboratoryHead && !laboratoryHead.hasConfirmed
                  )
                  .map((laboratoryHead, index) => (
                    <div className="list-item" key={index}>
                      <Link
                        to={"/profile/" + laboratoryHead._id}
                        className="text-body d-block"
                      >
                        {laboratoryHead.email}
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card ">
            <div className="card-header">
              <h3 className="card-title">Comptes confirmés</h3>
            </div>
            <div className="card-body p-0">
              <div
                style={{ height: "300px", maxHeight: "300px" }}
                className="list  overflow-auto list-row list-hoverable"
              >
                {laboratoryHeads
                  .filter((user) => user && user.hasConfirmed)
                  .map(({ email, ...laboratoryHead }, index) => (
                    <UserListItem
                      key={index}
                      user={laboratoryHead}
                      subTitle={email}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaboratoryHeads;
