connection staring
const url = "mongodb+srv://rakeshaug2022:UR62JY5pL4UXWyTM@namastenode.kcnhr.mongodb.net"

db shel
db.["users"].find()

NOTES -->
Pagination theory
this other api use in mongodb use 2 methods skip() and limit()
feed?page=1&limit=10 --->1-10 ----> .skip(0) & limit(10)
feed?page=2&limit=20 --->2-20 ----> .skip(10) & limit(20)
feed?page=3&limit=30 --->3-30 ----> .skip(20) & limit(30)

skip formula
skip = (page - 1)\*limit;

"Never trust req.body" always keep validation in side schema level and api level
