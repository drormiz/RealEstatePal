import React, { useState, useEffect } from "react";
import { getClient } from "../../../../axios";
import AddEditGroup from "./AddEditPurchaseGroup";

const AddGroup = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await getClient().get("/api/properties/");
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  const onSubmitHandler = async (newValue) => {
    if (!newValue._id) {
      await getClient().post(`api/purchaseGroups`, newValue);
    } else {
      await getClient().put(`api/purchaseGroups/${newValue._id}`, newValue);
    }
  };

  return (
    <AddEditGroup
      onSubmitHandler={onSubmitHandler}
      properties={properties}
    ></AddEditGroup>
  );
};

export default AddGroup;
