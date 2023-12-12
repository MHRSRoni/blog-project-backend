/**
 * @category Readlist
 * @module Validation
 * @author MHRoni
 */


//=============Imports===============//
const Joi = require('joi')

//================================//



//=============Types================//
/**
 * @typedef ObjectID 
 * @property {Boolean} trim=true - The ObjectID is trimmed
 * @property {Number} length=24 - The length of the ObjectId
 * @property {Boolean} required=true - The ObjectID is required
 */
//================================//



//===========Functions=================//

/**
 * Function to validating objectID with [Joi]{@link https://joi.dev/api/}
 * @function validateObjectID
 * @param {String|ObjectID} objectID - The objectID to validate 
 * @async
 */
const validateObjectID = async(objectID) => await Joi.string().trim().length(24).required().validateAsync(objectID)

//====================================//



//============Exports================//
module.exports = {validateObjectID}

//===================================//