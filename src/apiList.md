# DevTinder API's

authRouter
-POST /signup
-POST /login
-POST /logout

profileRouter
-GET /profile/view
-PATCH /profile/edit
-PATCH /profile//password

connnectionRequestRouter
-POST /request/send/interested/:userId
-POST /request/send/ignored/:userId
-POST /request/send/accepted/:requestId
-POST /request/send/rejected/:requestId

uerRouter
-GET /user/connections
-GET /user/request/received
-GET /user/feed - Get you the profiles of other users on platforms

Status: ignore, interested, accepted, rejected
