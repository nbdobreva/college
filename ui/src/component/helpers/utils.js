export const prepareBody = (wholeObject) => {
    const modifiedObject = { ...wholeObject }
    Object.keys(modifiedObject).forEach((key) => modifiedObject[key] === null && delete modifiedObject[key]);
    return modifiedObject;
}
