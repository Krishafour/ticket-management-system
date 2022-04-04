import { QueryResult} from "pg";
import { pool } from "./db";

export let databaseOperation=async(Query: string, array?:((string | Date | undefined|boolean) [] )| string ): Promise<QueryResult>=>{
        try{
            const ans:QueryResult = await pool.query(Query, array);
            return ans;
         }
        catch(err:unknown)
        {
            throw err;
        }
    
}
