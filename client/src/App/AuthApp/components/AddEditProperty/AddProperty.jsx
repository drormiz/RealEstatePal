import React from 'react';
import { getClient } from '../../../../axios';
import AddEditProperty from './AddEditProperty';

const AddProperty = () => {
  const onSubmitHandler = async (newValue) => {
      await getClient().post(`api/properties`, newValue);
  };

  return (
    <AddEditProperty onSubmitHandler={onSubmitHandler}></AddEditProperty>
  );
};

export default AddProperty;
