import React, {useState, useEffect} from 'react';
import {getClient} from '../../../../axios'; 
import PropertyBaseForm from './PropertyBaseForm';
import { useParams } from 'react-router-dom';

const EditProperty = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState();

  console.log("dsdsd", propertyId);
  const onSubmitHandler = async(updatedValue) => {
    await getClient().put(`api/properties/${updatedValue._id}`, updatedValue);
  };

  useEffect(() => {
    (async () => {
      const {data} = await getClient().get(`api/properties/${propertyId}`);
      setProperty(data);
    })();
  }, []);

  return (
         <>
         {!!property && <PropertyBaseForm property={property} onSubmitHandler={onSubmitHandler}></PropertyBaseForm>}
         </>
          
      );
};

export default EditProperty;
