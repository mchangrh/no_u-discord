class SchemaException extends Error {
  constructor(message) {
    super(`Invalid schema: ${message}`)
    this.name = 'SchemaException'
  }
}

class TypeValidationException extends Error {
  constructor(argType, schemaType) {
    super(`Invalid argument: expected type ${schemaType}; received type ${argType}`)
    this.name = 'TypeValidationException'
  }
}

function validate(toValidate, schema) {
  if (!schema || !schema.type) {
    throw new SchemaException('expecting schema type')
  }

  if (schema.required && schema.type !== 'any') {
    if (toValidate === undefined || toValidate === null) {
      throw new TypeValidationException(typeof toValidate, schema.type)
    }
  }
  
  if ((toValidate === undefined || toValidate === null) && schema.type !== 'any') {
    if (schema.required) {
      throw new TypeValidationException(typeof toValidate, schema.type)
    }

    return;
  }

  switch (schema.type) {
    case 'array':
      if (!schema.itemSchema || typeof schema.itemSchema !== 'object') {
        throw new SchemaException('expecting itemSchema for type array')
      }
      if (!Array.isArray(toValidate)) {
        throw new TypeValidationException(typeof toValidate, schema.type)
      }
      const minLength = schema.minLength || 0
      const maxLength = schema.maxLength || Infinity;
      if (toValidate.length < minLength || toValidate.length > maxLength) {
        throw new Error(`Invalid length: expected ${minLength} to ${maxLength} arguments; received ${toValidate.length}`)
      }
      toValidate.forEach((itemToValidate) => {
        validate(itemToValidate, schema.itemSchema);
      });

      break;
    case 'integer':
      if (isNaN(toValidate)) {
        throw new TypeValidationException(typeof toValidate, schema.type)
      }

      if (parseFloat(toValidate) % 1 !== 0) {
        throw new TypeValidationException('float', schema.type)
      }
    case 'number':
      if (isNaN(toValidate)) {
        throw new TypeValidationException(typeof toValidate, schema.type)
      }
      const argValue = parseFloat(toValidate);
      const minValue = schema.minValue === undefined ? -Infinity : schema.minValue;
      const maxValue = schema.maxValue === undefined ? Infinity : schema.maxValue;
      if (argValue < minValue || argValue > maxValue) {
        throw new Error(`Invalid value: expected value between ${minValue} and ${maxValue}; received ${argValue}`);
      }
      break;
    case 'string':
      break;
    default:
  }
}

module.exports = {
  SchemaException,
  TypeValidationException,
  validate
};