UPDATE canyons
SET canyon_pic = ${canyon_pic}, canyon_description = ${canyon_description}
WHERE canyon_id = ${id} AND canyon_owner = ${user_id};