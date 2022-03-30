import { QueryResult} from "pg";
import { pool } from "./db";

export function databaseOperation(Query: string, array?:((string | Date | undefined|boolean) [] )| string ): Promise<QueryResult>{
    // const ans:QueryResult = await client1.query(Query, array);
    // return ans;
    return new Promise(async(resolve,reject)=>{
        try{
            
            const ans:QueryResult = await pool.query(Query, array);
            resolve(ans);
         }
        catch(err:any|unknown)
        {
            return reject(err);
        }
    })
}
// export function allTicketHistory(token:tokenData):Promise<ticketInfoOutput>{
//     return new Promise(async(resolve,reject)=>{
//         try{
            
//             if(token.role==ROLE.USER)
//             {
//                 const ticketInfo:QueryResult= await databaseOperation(TICKETS_TABLE_QUERIES.TICKET_INFORMATION_HISTORY_OF_USER,[token.user_id,false,TICKET_STATUS.APPROVED,TICKET_STATUS.REJECTED]);
//                 return resolve({status:RESPONSE_STATUS.SUCCESS,ticket:ticketInfo.rows});
//             }
//             else
//             {
//                 const ticketInfo:QueryResult=await databaseOperation(TICKETS_TABLE_QUERIES.TICKET_INFORMATION_HISTORY,[TICKET_STATUS.APPROVED,TICKET_STATUS.REJECTED,false]);
//                 return resolve({status:RESPONSE_STATUS.SUCCESS,ticket:ticketInfo.rows});
//             }
//          }
//         catch(err:any|unknown)
//         {
//             return reject(err);
//         }
//     })
// }