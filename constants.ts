import { userOutputs } from "./returnTypes"

export const ROLE={
  ADMIN:"admin",
  USER:"user"
}
export const TICKET_STATUS={
  APPROVED:"approved",
  REJECTED:"rejected",
  PROGRESS:"progress",
  HOLD:"hold"
}
export const RESPONSE_STATUS={
UNAUTHORIZED:401,
FORBIDDEN:403,
INTERNAL_SERVER_ERROR:500,
CONFLICT:409,
BAD_REQUEST:400,
SUCCESS:200,
NOT_FOUND:404
}



export const REGISTER_OUTPUT:string="user registered successfully";
export const REGEX:RegExp=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/