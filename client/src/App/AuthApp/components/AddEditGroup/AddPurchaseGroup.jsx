import React from 'react';
import { getClient } from '../../../../axios';
import AddEditGroup from './AddEditPurchaseGroup';

const AddGroup = () => {

  const onSubmitHandler = async (newValue) => {
    if (!newValue._id) {
      await getClient().post(`api/purchaseGroups`, newValue);
    }
    else {
      await getClient().put(`api/purchaseGroups/${newValue._id}`, newValue);
    }

  };

  return (
    <AddEditGroup onSubmitHandler={onSubmitHandler}></AddEditGroup>
  );
};

export default AddGroup;
