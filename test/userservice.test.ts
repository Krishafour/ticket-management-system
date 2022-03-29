import * as getUserFunctions from '../services/userService'

jest.spyOn(getUserFunctions,'all_Ticket_Info').mockResolvedValue({status:200,ticket:[ {
  "ticket_id": "67055b93-3ebd-4aeb-ba91-2eed152b206c",
  "ticket_description": "Ticket for getting  medical payment",
  "ticket_status": "hold",
  "created_at": "2022-03-11T08:36:20.969Z",
  "modified_at": "2022-03-15T05:37:52.621Z",
  "created_by": "shivdutjakore@gmail.com",
  "ticket_status_changed_by": "aniketkale@gmail.com"
},
{
  "ticket_id": "86acf0c5-c183-4558-8d7d-1f4821a89cc6",
  "ticket_description": "ticket for getting laptop for education",
  "ticket_status": "approved",
  "created_at": "2022-03-14T10:45:38.626Z",
  "modified_at": "2022-03-17T11:54:39.292Z",
  "created_by": "shivdutjakore@gmail.com",
  "ticket_status_changed_by": "aniketkale@gmail.com"
}
]});
jest.spyOn(getUserFunctions,'raise_A_Ticket').mockResolvedValue({status:200,message:{succsses_message:"Ticket raised succssfully"}})
//jest.spyOn(getUserFunctions,'raise_A_Ticket').mockResolvedValue({status:401,message:{error:"Admin cannot raise a ticket"}})

test('function exists', ()=>{
  expect(getUserFunctions.raise_A_Ticket).toBeDefined();
  expect(getUserFunctions.allTicketHistory).toBeDefined();
});
describe('Getting tickets',()=>{
test('User all tickets', async () =>{
  const role:any='user'
   const res=[
    {
      "ticket_id": "67055b93-3ebd-4aeb-ba91-2eed152b206c",
      "ticket_description": "Ticket for getting  medical payment",
      "ticket_status": "hold",
      "created_at": "2022-03-11T08:36:20.969Z",
      "modified_at": "2022-03-15T05:37:52.621Z",
      "created_by": "shivdutjakore@gmail.com",
      "ticket_status_changed_by": "aniketkale@gmail.com"
    },
    {
      "ticket_id": "86acf0c5-c183-4558-8d7d-1f4821a89cc6",
      "ticket_description": "ticket for getting laptop for education",
      "ticket_status": "approved",
      "created_at": "2022-03-14T10:45:38.626Z",
      "modified_at": "2022-03-17T11:54:39.292Z",
      "created_by": "shivdutjakore@gmail.com",
      "ticket_status_changed_by": "aniketkale@gmail.com"
    }
  ];
    
    const data = await getUserFunctions.all_Ticket_Info(role);
    expect(data.ticket).toEqual(res);
});
})
describe('Raising a ticket',()=>{
  test('user raise ticket', async () =>{
    const role:any='user';
    const ticket_description:any="ticket for pc";
     const res={succsses_message:"Ticket raised succssfully"};
      
      const data = await getUserFunctions.raise_A_Ticket(ticket_description,role);
      expect(data.message).toEqual(res);
  });
})
