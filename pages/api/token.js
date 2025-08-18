import axios from "axios"
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

export default async function token(req, res) {
  const tokenList = [
    'Token 431c3958f002f6f546afe128257059d372093aa2',
    'Token 1a86eedfc8da905b34669e441476d13d8ccc4691',
    'Token 0d5ab8f4aabc1cc02c29b2d759e0ebde7254a4b7',
    'Token 3ed91c052b049be7c81567f637a421153fd2a893',
    'Token 70b8dda637580dd14625d9296f24945f2a6fc4f9',
    'Token cc6c5060a102fea6d7e9fca62b723140b71fe26d',
    'Token b34e052b0d7e9ee8ee4bed6e9b6c37f65c6bf19d',
    'Token d96100ae95f29bf1e836953ab1d8806f699b32bd',
    'Token 6a291d83c8ed3c8281aaafee31a428d2f940a71d',
    'Token 49980e6be947cdfe80036a77db0f66b77dd96ae7',
    'Token 52ef1d5d1b954edb1af7a2a3eae8161c9bd264df',
    'Token 05c00220a7232bd094fadc0b5a1ab6af62f4e41a',
    'Token 70d3df4ad16cae0cb6f0f7225761828a8a3ba64a',
    'Token a1117552cb0595ebdd01e46d5837cd1a59511111',
    'Token d84ce9eb14ad022fb65fd7a9906e97f1b3df72ab',
    'Token a37b9e2ef7a399570f1b656fb956a4fe2ad2e2d5',
    'Token 0344544a6b13dc4f0b4881e88cb984bb42e46201',
    'Token 99d85664544086556e48e31d6e67e6408b8a4890',
    'Token 47b5c71bc9319061d6ddbc82c1c1075abd03fb13',
    'Token 6b3b68c32a6a4b600de441ac7805b4fabcd9a82c',
    'Token 8d73c2037cae5fb6bb4b43f859fb03951078896b',
    'Token 7d97b3a80f0cfd528e02a49e8ab2b39e1773bad2',
    'Token be5dcd66a0314293f7a01e5dfdc25b00c6e33810',
    'Token d082d648fecf7a4c3bae43e28b7be74d887dfe48',
    'Token f9591c1f867a957941f6efb1ca397b56749a1add',
    'Token 753d1163dac51545737dd90a80d87e6464b844c5',
    'Token ff79b9085c2e90bd25ff143815bef8ef67677212',
    'Token 9789ca1e5389337a5c29ac91b0f5ac75a48e54b0',
    'Token d0709fc93bcee153a5dc58ec7f46eadc03a45e20',
    'Token a97c4c33be2a69cdd251a473b7beda77f3349cd1',
    'Token ace0f9445a4e997c57efb5b8e88baacb2b5681bf',
    'Token 7fe6af06c147026b067d591d41f4d7017249fc7e',
    'Token 2137ff943ecd4323d3372a860ef68016eca23bb8',
    'Token c8a4e3e4ab49f9d2fdbb3d7205d60da7341a8aec',
    'Token 37d9a76c0c7274876c6b313ee8fcc29d9fb191c7',
    'Token e59e4e2c1cb5e1db2dcfe755fde9a8be9a67ddab',
    'Token c3a171c84503ffb490b63d101c96bc3ab6e659a9',
    'Token 49679018ceb951cea68735016e944c33ae057cd8',
    'Token d6067f90bf1f41be35d65b93094d9d4686fa09a1',
    'Token 2485efe273219dc5a3e0f4a2a6851675f2371df1',
    'Token fe4c105a62b057d8529e2bd63c09187e43b21243',
    'Token f3e9e79b58d01a161fda1eb986adf7c497d471c8',
    'Token 76de9c35bdd842eaaec1abdaf6eed81b437a6fd7',
    'Token 59fdc62e98f96782296f0c65a068d636c5f2e54a',
    'Token 1f37543c1aaa9b0347a61c4d61acee85bd90f6ff',
    'Token 399bbcc15e2c74fdf6ddd53c045c6f944d0e9409',
    'Token 0d64f315d6eb60493107df9c40d58ece7b1d29b7',
   ]

   let dadataToken = tokenList[0];
   async function checkTokenLimit(token) {
    const response = await fetch("https://dadata.ru/api/v2/findById", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
     console.log('token', token, 'response.status', response.status)
    if (response.status === 403) {
      // Токен исчерпал лимит запросов
      const tokenIndex = tokenList.indexOf(token);
      dadataToken = tokenList[tokenIndex + 1];

      if (dadataToken) {
        // Вызываем функцию с новым токеном
        return await checkTokenLimit(dadataToken);
      }
    }

    return token; // Возвращаем рабочий токен
  }

  try {
    const workingToken = await checkTokenLimit(dadataToken)
    return res.json(workingToken)
  }
   catch {
    return res.json([])
  }
}
