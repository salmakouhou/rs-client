/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect,
  useContext,
  useState,
  Fragment,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Publications from "../Author/components/Publications";
import AuthorCitations from "../Author/components/AuthorCitations";
import Coauthors from "../Author/components/Coauthors";
import ProfileHeader from "./components/ProfileHeader";

const Profile = () => {
  const { id } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [correspondingFollowedUser, setCorrespondingFollowedUser] = useState(
    null
  );
  const [correspondingFollowedUserCitation, setCorrespondingFollowedUserCitation] = useState(
    null
  );
  const { ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { userService,scraperService } = ApiServices;

  useEffect(() => {
    getProfile();
    updateCitation();
  }, [id]);

  const getProfile = useCallback(async () => {
    try {
      const response = await userService.findUser(id);
      if (response.data) {
        setProfileUser(response.data);
        setCorrespondingFollowedUser(response.data.correspondingFollowedUser);
        setCorrespondingFollowedUserCitation(response.data.correspondingFollowedUser);
      } else throw Error();
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir les données de profil" });
    }
  }, [id]);


  const updateCitation = useCallback(async () => {
    try {
      const response = await userService.findUser(id);
      const responseScrap = await scraperService.getAuthorData(response.data.correspondingFollowedUser.platform, response.data.correspondingFollowedUser.authorId);
      if (responseScrap.data.author) {
        console.log(responseScrap.data.author.citationsPerYear.length);
        console.log(response.data.correspondingFollowedUser.citationsPerYear.length);

        if(responseScrap.data.author.citationsPerYear.length!==response.data.correspondingFollowedUser.citationsPerYear.length){
          userService.updateCitation(responseScrap.data.author);
          setCorrespondingFollowedUserCitation(responseScrap.data.author);

        }else if(responseScrap.data.author.citationsPerYear[responseScrap.data.author.citationsPerYear.length-1]!=response.data.correspondingFollowedUser.citationsPerYear[responseScrap.data.author.citationsPerYear.length-1]){
          userService.updateCitation(responseScrap.data.author);
          setCorrespondingFollowedUserCitation(responseScrap.data.author);
        }
       
      } 
    } catch (error) {
      pushAlert({ message: "Incapable d'obtenir les données de profil" });
    }
  }, [id]);

  return (
    <div className="container">
      {profileUser !== null && (
        <Fragment>
          {correspondingFollowedUser != null && correspondingFollowedUserCitation != null && (
            <div className="row">
              <div className="col-md-8">
                {correspondingFollowedUser != null && correspondingFollowedUserCitation != null && (
                  <Fragment>
                    <ProfileHeader
                      profile={{
                        ...correspondingFollowedUser,
                        ...profileUser,
                      }}
                    />
                    <Publications
                      author={correspondingFollowedUser}
                      setAuthor={setCorrespondingFollowedUser}
                      getProfile={getProfile}
                    />
                  </Fragment>
                )}
              </div>
              <div className="col-md-4">
                <AuthorCitations author={correspondingFollowedUserCitation} />
                <Coauthors author={correspondingFollowedUser} />
              </div>
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default Profile;
