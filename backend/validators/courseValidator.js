import Joi from 'joi';

// Create course validation schema
export const createCourseSchema = Joi.object({
  courseName: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Course name must be at least 3 characters',
      'string.max': 'Course name must not exceed 100 characters',
      'any.required': 'Course name is required'
    }),
  
  courseCode: Joi.string()
    .pattern(/^[A-Z]{2,4}[0-9]{3}$/)
    .required()
    .messages({
      'string.pattern.base': 'Course code must be in format like CS101 or MATH201',
      'any.required': 'Course code is required'
    }),
  
  description: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Description must not exceed 500 characters'
    }),
  
  credits: Joi.number()
    .integer()
    .min(1)
    .max(6)
    .default(3)
    .messages({
      'number.min': 'Credits must be at least 1',
      'number.max': 'Credits must not exceed 6'
    }),
  
  teacherId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid teacher ID format'
    }),
  
  semester: Joi.string()
    .optional()
    .default('Fall 2024'),
  
  status: Joi.string()
    .valid('active', 'inactive', 'completed')
    .default('active')
});

// Update course validation schema
export const updateCourseSchema = Joi.object({
  courseName: Joi.string().min(3).max(100).optional(),
  courseCode: Joi.string().pattern(/^[A-Z]{2,4}[0-9]{3}$/).optional(),
  description: Joi.string().max(500).optional(),
  credits: Joi.number().integer().min(1).max(6).optional(),
  teacherId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
  semester: Joi.string().optional(),
  status: Joi.string().valid('active', 'inactive', 'completed').optional()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

// Validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    req.body = value;
    next();
  };
};
