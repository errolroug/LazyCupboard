INSERT INTO measurements (measurementType) VALUES 
("cup"),
("teaspoon"),
("tablespoon"),
("quarts"),
("liter"),
("pint"),
("quart"),
("ounce"),
("pound");

select * from measurements;

INSERT INTO ingredients (name,quantity,measurementId) VALUES 
("bone-in chicken breasts",2,null),
("basmati rice",1,1),
("celery ribs",2,null),
("carrots",2,null),
("onion",1,null),
("garlic cloves",2,null),
("salt",1,2),
("black pepper",0.5,2),
("chicken stock",2,4),
("lemon juice",3,3),
("lemon",1,null),
("parsely",1,null);

select * from ingredients;