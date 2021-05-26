/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState, useCallback, Fragment } from "react";
import PageHeader from "../components/PageHeader";
import { AppContext } from "../../context/AppContext";
import { encode, decode } from 'uint8-to-base64';
import ArchiveTable from "../components/ArchiveTable";
import ArchiveTree from "../components/ArchiveTree";

const GenralAssembly = () => {
    const { ApiServices } = useContext(AppContext);
    const { pvUploadService, teamService } = ApiServices;
    const [pvs, setPvs] = useState([])


    const updatePvData = useCallback(async () => {
        const teamId = JSON.parse(localStorage.getItem("user")).teamsMemberships[0].team_id;

        try {
            const teamsResponse = await teamService.findTeam(teamId);
            const response = await pvUploadService.findAllPvs(teamsResponse.data.laboratory_id);
            //const filtredPvs = response.data.filter(pv => pv.laboratory_id === teamsResponse.data.laboratory_id);
            //console.log(filtredPvs)
            if (response.data) {
                console.log(response.data)
                setPvs(
                    response.data.map((pv) => ({
                        ...pv,
                        pv: pv,
                    }))
                );

            }
            else throw Error();
        } catch (error) {
            console.log(error)
        }
    }, []);



    const downloadRapport = async (pv) => {
        try {
            console.log(pv.split("/")[0])
            const response = await pvUploadService.findPv(pv.split("/")[0], pv.split("/")[1]);

            if (response.data) {
                const encoded = encode(response.data.data);
                var byteCharacters = atob(encoded);
                var byteNumbers = new Array(byteCharacters.length);
                for (var i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                var byteArray = new Uint8Array(byteNumbers);
                var file = new Blob([byteArray], { type: response.data.mimetype });
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
            }


        } catch (error) {

            console.log(error)
        }
    }



    useEffect(() => {
        updatePvData();
    }, [updatePvData]);

    return (
        <Fragment>
            <div className="page-header">
                <PageHeader
                    title={`Consultation des PVs `}
                    subTitle={`${pvs.length} procédés verbaux`}
                />
            </div>
            <div className="row row-cards row-deck">
                <div className="col-md-12">
                    <div className="card">
                      
                        <div className={`card-body form `}>
                            <ArchiveTree data={pvs}
                                downloadRapport={downloadRapport} />

                        </div>
                    </div>
                </div>

            </div>
        </Fragment>
    );
};


export default GenralAssembly;
