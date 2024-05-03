const catItems = [
    {
      cat_id: 9592,
      cat_name: "kissa",
      weight: 11,
      owner: 3609,
      filename: "abcdefg",
      birthdate: "01.01.2001",
    },
    {
      cat_id: 9590,
      cat_name: "toinenKissa",
      weight: 8,
      owner: 3602,
      filename: "abcdefg",
      birthdate: "01.02.2001",
    },
  ];
  
  const listAllCats = () => {
    return catItems;
  };
  
  const findCatById = (id) => {
    return catItems.find((item) => item.cat_id == id);
  };
  
  const addCat = (cat) => {
    const { cat_name, weight, owner, filename, birthdate } = cat;
    const newId = catItems[0].cat_id + 1;
    catItems.unshift({
      cat_id: newId,
      cat_name,
      weight,
      owner,
      filename,
      birthdate,
    });
    return { cat_id: newId };
  };
  
  export { listAllCats, findCatById, addCat };