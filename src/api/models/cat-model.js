const catItems = [
  {
    cat_id: 111,
    cat_name: "Lumi",
    weight: 10,
    owner: 1000,
    filename: "abc123",
    birthdate: "01.01.2003",
  },
  {
    cat_id: 222,
    cat_name: "Pamuk",
    weight: 15,
    owner: 2000,
    filename: "abc1234",
    birthdate: "01.01.2004",
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
