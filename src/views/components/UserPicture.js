import React from "react";

const UserPicture = ({ user, size, badge }) => {
  return (
    <div className="col-auto">
      {user.profilePicture != null && (
        <span
          className={`avatar avatar-${size}`}
          style={{
            backgroundImage: `url(${process.env.REACT_APP_BACKEND_URL}/pictures/${user.profilePicture})`,
          }}
        >
          {badge && <span className="badge bg-green"></span>}
        </span>
      )}
      {user.profilePicture == null && (
        <span className={`bg-blue-lt avatar avatar-${size}`}>
          {user.firstName ? user.firstName[0] : ""}
          {user.lastName ? user.lastName[0] : ""}
        </span>
      )}
    </div>
  );
};

export default UserPicture;
