import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../../context/auth-ctx";
import Model from "../../../../../UIs/Model/Model";
import Loader from "../../../../../UIs/loader/Loader";
import Notification from "../../../../../UIs/notification/Notification";
import StandardBtn from "../../../../../UIs/StandardBtn/StandardBtn";
import UserForm from "../../../userForm/UserForm";
import style from "./ManageUsers.module.scss";
import NoDataFound from "../../../../../UIs/noDataFound/NoDataFound";
import Users from "./Users";
import LoadingPage from "../../../../../UIs/LoadingPage/LoadingPage";

export default function ManageUsers() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_DOMAIN_NAME}/api/v1/users`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
        const data = await response.json();
        setUsers(data.data.data);
      } catch (err) {
        setNotification({ status: "fail", message: err.message });
        setTimeout(() => setNotification(null), 3000);
      }
      setIsLoading(false);
    };
    fetchAllUsers();
  }, [token]);

  const userFormCancelHandler = () => {
    setUserForm(false);
    setUpdateData(null);
    setUpdating(false);
  };

  const userDeleteHandler = async (userId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_DOMAIN_NAME}/api/v1/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      setUsers((prevUsers) => {
        const newUsers = prevUsers.filter((user) => user._id !== userId);
        return newUsers;
      });
      setNotification({ status: "success", message: "User Deleted" });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({ status: "fail", message: err.message });
      setTimeout(() => setNotification(null), 3000);
    }
    setIsLoading(false);
  };

  const userFormSubmitHandler = (user) => {
    setUsers((prevUsers) => {
      let newUsers = [...prevUsers];
      const index = newUsers.findIndex((newUser) => newUser._id === user._id);
      if (index !== -1) {
        newUsers[index] = { ...user };
      } else {
        newUsers.push(user);
      }
      return newUsers;
    });
  };

  if (isLoading) {
    return (
      <>
      <Model>
        <Loader />
      </Model>
      <LoadingPage/>
      </>
    );
  }

  return (
    <>
      {notification && <Notification notification={notification} />}
      {userForm && (
        <Model>
          <UserForm
            onCancel={userFormCancelHandler}
            updating={updating}
            updateData={updateData}
            setIsLoading={(value) => setIsLoading(value)}
            setNotification={(value) => setNotification(value)}
            onFormSubmit={(user) => userFormSubmitHandler(user)}
          />
        </Model>
      )}
      <StandardBtn
        className={style["add-user-controller"]}
        onClick={() => {
          setUserForm(true);
          setUpdating(null);
          setUpdateData(null);
        }}
      >
        Add New User
      </StandardBtn>
      {users.length === 0 && <NoDataFound />}
      <Users
        users={users}
        onEditing={(updateData) => {
          setUserForm(true);
          setUpdating(true);
          setUpdateData(updateData);
        }}
        onDeleting={(userId) => userDeleteHandler(userId)}
      />
    </>
  );
}
