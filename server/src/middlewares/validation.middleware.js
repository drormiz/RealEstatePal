const validate = schema => ({ body, query, params }, res, next) => {
    try {
        schema.parse({ body, query, params })
        next();
    } catch (error) {
        next(error)
    }
};

export default validate;