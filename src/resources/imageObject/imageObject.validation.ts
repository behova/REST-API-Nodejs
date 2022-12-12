import Joi from 'joi';

/**
 * change to object for easy access per function
 */
const getMany = {
    params: Joi.object({
        amount: Joi.string().min(1).max(2).truncate().regex(/^\d+$/).required(),
    }),
};

const getByPage = {
    params: Joi.object({
        page: Joi.string().min(1).max(3).truncate().regex(/^\d+$/).required(),
    }),
};

export default { getMany, getByPage };
