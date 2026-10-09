test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json(); 

  //tem um problema que é assim:
  // se a gente enviar null no updated at, a função to isostring converte para um horário valido
  // entao testar se é um horário abte brechas
  // por isso, comparamos se a string parseada é essencialmente igual a ela depos de converter com o isostring
  // dessa fomra, se vier um null o seu valor convertido será diferente do valor valido convertido
  const parseUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parseUpdatedAt);
  expect(responseBody.dependencies.database.version).toEqual("16.0");
  expect(responseBody.dependencies.database.max_connections).toEqual(100);
  expect(responseBody.dependencies.database.opened_connections).toEqual(1);
});

