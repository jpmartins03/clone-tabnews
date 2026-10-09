import database from "infra/database.js"

//sempre a variavel com nome em  lowerCamelCase é a variavel em código
//e a variavel em snake_case é a variavel retornada no body do json da resposa da requisição 

//retornart no json:
// 1 - versão do postgres
// 2 - conexões maximas do banco
// 3 - quantas conexoes estão sendo cobridas
async function status (request, response) {
  const updatedAt = new Date().toISOString();
  const databaseName = process.env.POSTGRES_DB;
  console.log(`Banco de dados selecionado: ${databaseName}`);
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;
  const databaseMaxConnectionsResult = await database.query("SHOW max_connections;");
  const databaseMaxConnectionsValue = databaseMaxConnectionsResult.rows[0].max_connections;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int from pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  //"SELECT count(*)::int from pg_stat_activity WHERE datname = 'local_db';"
  const databaseOpenedConnectionsValue = databaseOpenedConnectionsResult.rows[0].count;


  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      }
    }
  });
}

export default status;