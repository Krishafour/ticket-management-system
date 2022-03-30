import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from "uuid";
import { userOutputs, ticketInfoOutput, tokenData, tickets, user,register } from '../returnTypes';
import { RESPONSE_STATUS, ROLE, TICKET_STATUS } from '../constants';
import{  TICKETS_TABLE_QUERIES,USER_TABLE_QUERIES } from "../database/queries"
import { QueryResult } from 'pg';
import { databaseOperation } from "../database/queryfunctions";
const jwt = require('jsonwebtoken');


/**
* This is registration function
*
* @param {user} body is of user which include user_name,password,role of user
* @returns {Promis<userOutputs>}  this function is return promise of userOutputs which include user_id of successfully registered user
*/
export  const registration:Function=async(body: user):Promise<register>=>{

        try {   //check if data already exist
            //fucntion add
            const user: QueryResult = await databaseOperation(USER_TABLE_QUERIES.USERNAME_USING_USERNAME, [body.user_name]);
            if (user.rowCount != 0) {
                return ({status:RESPONSE_STATUS.BAD_REQUEST, message: { error: "user already exist" } });
            }
            //creating unique id
            const uniqueId: string = uuidv4();
            body.user_id = uniqueId;
            //add data if not exist already
            const hashedPassword: string = await bcryptjs.hash(body.password, 10);
            const response: QueryResult = await databaseOperation(USER_TABLE_QUERIES.INSERT_USER, [body.user_id, body.user_name, hashedPassword, body.role.toLowerCase()]);
            if (response)
          
            return ({ status: RESPONSE_STATUS.SUCCESS, message: { succsses_message: " user registered successfully" }});
        }
        
        catch (error) {
            throw error;
        }      
}


/**
* This is login function.
* 
* @param {user} body is of user which include user_name and password of user
* @returns {Promis<userOutputs>}  this function is return promise of userOutputs which include jwt token of user logged in successfully 
*/
export function login(body: user): Promise<userOutputs> {
    return new Promise(async (resolve, reject) => {
        try {
            //check username is present or NOT
            const user: QueryResult = await databaseOperation(USER_TABLE_QUERIES.USERNAME_USING_USERNAME, [body.user_name]);
            if (user.rowCount == 0) {
                return resolve({ status: RESPONSE_STATUS.BAD_REQUEST, message: { error: "User name invalid" } });
            }
            //get password using user_name
            const passwordlog: QueryResult = await databaseOperation(USER_TABLE_QUERIES.PASSWORD_USER_ID_ROLE_USING_USERNAME, [body.user_name]);

            if (await bcryptjs.compare(body.password, passwordlog.rows[0].password)) {
                var token: string = jwt.sign({ user_id: passwordlog.rows[0].user_id, user_name: body.user_name, role: passwordlog.rows[0].role }, process.env.SECRET_KEY, { expiresIn: "7200 seconds" });
                return resolve({ status: RESPONSE_STATUS.SUCCESS, message: { token: token } });
            }
            else {
                return resolve({ status: RESPONSE_STATUS.BAD_REQUEST, message: { error: "Invalid password" } });
            }
        }
        catch (error: unknown) {

            return reject(error);
        }
    })
}



/**
* This is raising ticket function
*
* @param {tickets} body is of tickets which include ticket_description of user
* @param {tokenData} token is of tokenData which includes user login information
* @returns {Promis<ticketInfoOutput>}  this function is return promise of ticketInfoOutput which include raised ticket ticket_id
*/
export function raise_A_Ticket(body: tickets, token: tokenData): Promise<ticketInfoOutput> {
    return new Promise(async (resolve, reject) => {
        try {
            //create unique id
            const uniqueId: string = uuidv4();
            var dateTime: Date = new Date();
            body.ticket_id = uniqueId;
            //default status progress
            body.ticket_status = "new";
            if (token.role == ROLE.ADMIN) {
                return resolve({ status: RESPONSE_STATUS.UNAUTHORIZED, message: { error: "Admin cannot raise a ticket" } });
            }
            //set created_by as user_name of user
            body.created_by = token.user_name;
            //set foreign key user_id 
            body.user_id = token.user_id;
            //set date and time 
            body.modified_at = dateTime;
            body.created_at = dateTime;
            //set ticket_status_changed_by default
            body.ticket_status_changed_by = "null";
            const response: QueryResult = await databaseOperation(TICKETS_TABLE_QUERIES.INSERT_TICKET, [body.ticket_id, body.user_id, body.ticket_description.toLocaleLowerCase(), body.ticket_status, body.created_at, body.modified_at, body.created_by, body.ticket_status_changed_by]);
            if (response)
                return resolve({ status: RESPONSE_STATUS.SUCCESS, message: { succsses_message: "Ticket raised succssfully" } });
        }
        catch (error: any | unknown) {
            return reject(error);
        }
    })
}



/**
* This is all ticket info function
*
* @param {tokenData} token is of tokenData which includes user login information
* @returns {Promis<ticketInfoOutput>}  this function is return promise of ticketInfoOutput which include ticket informaton
*/
export function all_Ticket_Info(token: tokenData): Promise<ticketInfoOutput> {
    return new Promise(async (resolve, reject) => {
        try {


            if (token.role == ROLE.USER) {
                const ticketInfo: QueryResult = await databaseOperation(TICKETS_TABLE_QUERIES.TICKET_INFORMATION_OF_USER, [token.user_id, false]);
                return resolve({ status: RESPONSE_STATUS.SUCCESS, ticket: ticketInfo.rows });
            }
            else {
                const ticketInfo: QueryResult = await databaseOperation(TICKETS_TABLE_QUERIES.TICKET_INFORMATION, [false]);
                return resolve({ status: RESPONSE_STATUS.SUCCESS, ticket: ticketInfo.rows });
            }
        }
        catch (err: any | unknown) {
            return reject(err);
        }
    })
}



/**
* This is delete ticket function
*
* @param {tickets} param is of tickets which include ticket_id of user
* @param {tokenData} token is of tokenData which includes user login information
* @returns {Promis<ticketInfoOutput>}  this function is return promise of ticketInfoOutput which include deleted ticket ticket_id
*/
export function deleteTicket(param: tickets, token: tokenData): Promise<ticketInfoOutput> {
    return new Promise(async (resolve, reject) => {
        try {

            const userId: QueryResult = await databaseOperation(TICKETS_TABLE_QUERIES.USER_ID_USING_TICKET_ID, [param.ticket_id]);
            if (userId.rows[0].user_id != token.user_id && token.role == ROLE.USER) {

                return resolve({ status: RESPONSE_STATUS.UNAUTHORIZED, message: { error: "User is not allow to delete this ticket" } });
            }
            const deleteStatus: QueryResult = await databaseOperation(TICKETS_TABLE_QUERIES.IS_DELETED_USING_TICKET_ID, [param.ticket_id])
            if (deleteStatus.rows[0].is_deleted) {
                return resolve({ status: RESPONSE_STATUS.FORBIDDEN, message: { error: "User is not allowed delete deleted ticket" } });
            }

            const dateTime: Date = new Date();
            const del: QueryResult = await databaseOperation(TICKETS_TABLE_QUERIES.DELETE_TICKET_USING_TICKETID, [true, dateTime, "withdraw", param.ticket_id]);
            if (del.rowCount != 0) {
                return resolve({ status: RESPONSE_STATUS.SUCCESS, message: { succsses_message: "Your ticket deleted successfully" } });
            }
        }
        catch (error: any | unknown) {

            return reject(error);
        }
    })
}

/**
* This is all ticket function function
*
* @param {tokenData} token is of tokenData which includes user login information
* @returns {Promis<ticketInfoOutput>}  this function is return promise of ticketInfoOutput which include all ticket infromation
*/
export function allTicketHistory(token: tokenData): Promise<ticketInfoOutput> {
    return new Promise(async (resolve, reject) => {
        try {

            if (token.role == ROLE.USER) {
                const ticketInfo: QueryResult = await databaseOperation(TICKETS_TABLE_QUERIES.TICKET_INFORMATION_HISTORY_OF_USER, [token.user_id, false, TICKET_STATUS.APPROVED, TICKET_STATUS.REJECTED]);
                return resolve({ status: RESPONSE_STATUS.SUCCESS, ticket: ticketInfo.rows });
            }
            else {
                const ticketInfo: QueryResult = await databaseOperation(TICKETS_TABLE_QUERIES.TICKET_INFORMATION_HISTORY, [TICKET_STATUS.APPROVED, TICKET_STATUS.REJECTED, false]);
                return resolve({ status: RESPONSE_STATUS.SUCCESS, ticket: ticketInfo.rows });
            }
        }
        catch (err: any | unknown) {
            return reject(err);
        }
    })
}



/**
* This is update ticket function
*
* @param {tickets} param is of tickets which include ticket_id of user
* @param {tickets} body is of tickets which include ticket_description of user
* @param {tokenData} token is of tokenData which includes user login information
* @returns {Promis<ticketInfoOutput>}  this function is return promise of ticketInfoOutput which include updated ticket_description ticket_id
*/

export function updateTicket(param: tickets, body: tickets, token: tokenData): Promise<ticketInfoOutput> {
    return new Promise(async (resolve, reject) => {
        try {
            const userId: QueryResult = await databaseOperation(TICKETS_TABLE_QUERIES.USER_ID_USING_TICKET_ID, [param.ticket_id]);
            if (userId.rows[0].user_id != token.user_id) {

                return resolve({ status: RESPONSE_STATUS.FORBIDDEN, message: { error: "User is not allow to update ticket of other user" } });
            }
            const deleteStatus: QueryResult = await databaseOperation(TICKETS_TABLE_QUERIES.IS_DELETED_USING_TICKET_ID, [param.ticket_id]);
            if (deleteStatus.rows[0].is_deleted) {
                return resolve({ status: RESPONSE_STATUS.FORBIDDEN, message: { error: "You are not allowed to update ticket of deleted ticket" } });
            }
            const ticketStatus: QueryResult = await databaseOperation(TICKETS_TABLE_QUERIES.TICKET_STATUS_USING_TICKET_ID, [param.ticket_id, false]);
            if (ticketStatus.rows[0].ticket_status == TICKET_STATUS.APPROVED || ticketStatus.rows[0].ticket_status == TICKET_STATUS.REJECTED) {
                return resolve({ status: RESPONSE_STATUS.FORBIDDEN, message: { error: "User can not update ticket description of approved and rejected ticket" } });
            }
            else {
                var dateTime: Date = new Date();
                body.modified_at = dateTime;
                const ticket_Info: QueryResult = await databaseOperation(TICKETS_TABLE_QUERIES.UPDATE_TICKET_DESCRIPTION, [body.ticket_description, body.modified_at, param.ticket_id]);
                if (ticket_Info.rowCount != 0) {
                    return resolve({ status: RESPONSE_STATUS.SUCCESS, message: { succsses_message: "Ticket updated succssfully" } });
                }
            }
        }
        catch (err: any | unknown) {
            return reject(err);
        }
    })
}
/**
* This is getting ticket status function
*
* @param {tokenData} token is of tokenData which includes user login information
* @returns {Promis<ticketInfoOutput>}  this function is return promise of ticketInfoOutput which include all ticket infromation
*/
export function ticketStatus(token: tokenData): Promise<ticketInfoOutput> {
    return new Promise(async (resolve, reject) => {
        try {

            if (token.role == ROLE.USER) {
                const ticketInfo: QueryResult = await databaseOperation(TICKETS_TABLE_QUERIES.TICKET_STATUS_OF_USER, [token.user_id, false]);
                return resolve({ status: RESPONSE_STATUS.SUCCESS, ticket: ticketInfo.rows });
            }
            else {
                const ticketInfo: QueryResult = await databaseOperation(TICKETS_TABLE_QUERIES.TICKET_STATUS, [false]);
                return resolve({ status: RESPONSE_STATUS.SUCCESS, ticket: ticketInfo.rows });
            }
        }
        catch (err: any | unknown) {
            return reject(err);
        }
    })
}
