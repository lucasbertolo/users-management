export function getValidationError(err) {
  const validationErrors = {};

  err.inner.forEach((error) => {
    const setPath = error.path.replace('.Value', '');

    validationErrors[setPath] = error.message;
  });

  return validationErrors;
}
