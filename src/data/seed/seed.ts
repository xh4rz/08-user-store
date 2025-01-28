import { envs } from '../../config';
import { MongoDatabase } from '../mongo/mongo-database';

(async () => {
	MongoDatabase.connect({
		dbName: envs.MONGO_DB_NAME,
		mongoUrl: envs.MONGO_URL
	});

	await main();

	await MongoDatabase.disconnect();
})();

async function main() {
	// 1. crear usuarios
	// 2. crear categorias
	// 3. crear productos
}
