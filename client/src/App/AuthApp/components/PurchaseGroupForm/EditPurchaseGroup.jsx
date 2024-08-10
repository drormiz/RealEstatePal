import React from "react";
import PurchaseGroupForm from "./PurchaseGroupForm";
import { useLocation } from "react-router-dom";

const EditGroup = () => {
  const location = useLocation();
  const onSubmitHandler = async (updatedValue) => {};

  return (
    <PurchaseGroupForm
      value={location.state ? location.state.group : null}
      onSubmitHandler={onSubmitHandler}
    ></PurchaseGroupForm>
  );
};

export default EditGroup;
