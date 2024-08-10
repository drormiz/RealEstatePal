import React, { useState, useEffect } from "react";
import { getClient } from "../../../../axios";
import PurchaseGroupForm from "./PurchaseGroupForm";

const AddPurchaseGroup = () => {
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
    <PurchaseGroupForm
      onSubmitHandler={onSubmitHandler}
      properties={properties}
    ></PurchaseGroupForm>
  );
};

export default AddPurchaseGroup;
