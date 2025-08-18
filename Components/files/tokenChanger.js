const tokenObj = {
  1: 'Token 1a86eedfc8da905b34669e441476d13d8ccc4691',
  2: 'Token 0d5ab8f4aabc1cc02c29b2d759e0ebde7254a4b7',
  3: 'Token 431c3958f002f6f546afe128257059d372093aa2',  // Nyaks
  4: 'Token 3ed91c052b049be7c81567f637a421153fd2a893',
  5: 'Token 70b8dda637580dd14625d9296f24945f2a6fc4f9',
  6: 'Token cc6c5060a102fea6d7e9fca62b723140b71fe26d',
  7: 'Token b34e052b0d7e9ee8ee4bed6e9b6c37f65c6bf19d',  // Lira
  8: 'Token d96100ae95f29bf1e836953ab1d8806f699b32bd'   // evgenzolotoff
};

const countChange = () => {
  const hour = new Date().getHours();
  let count
  if (hour < 3) {
    count = 1;
  } else if (hour < 6) {
    count = 2;
  } else if (hour < 9) {
    count = 3;
  } else if (hour <= 12) {
    count = 4;
  } else if (hour <= 15) {
    count = 5;
  } else if (hour <= 18) {
    count = 6;
  } else if (hour <= 21) {
    count = 7;
  } else {
    count = 8;
  }
  return count
}

const tokenChange = () => {
  const token = tokenObj[countChange()];
  return token;
}

export default tokenChange