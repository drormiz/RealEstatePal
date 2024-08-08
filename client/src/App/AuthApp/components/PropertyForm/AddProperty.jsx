import React from 'react';
import { getClient } from '../../../../axios';
import PropertyBaseForm from './PropertyBaseForm';

const AddProperty = () => {
  const onSubmitHandler = async (newValue) => {
      await getClient().post(`api/properties`, newValue);
  };

  return (
    <PropertyBaseForm onSubmitHandler={onSubmitHandler}></PropertyBaseForm>
  );
};

export default AddProperty;
