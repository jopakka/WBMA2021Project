const parse = (data, fieldName) => {
  try {
    const otherData = JSON.parse(data[fieldName]);
    delete data[fieldName];
    data = {
      ...data,
      ...otherData,
    };
  } catch (e) {
    // console.warn('parse', e.message);
  }
  return data;
};

export {parse};
