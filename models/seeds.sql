INSERT INTO Measurements (measurementType,createdAt,updatedAt) VALUES 
("cup",NOW(),NOW()),
("teaspoon",NOW(),NOW()),
("tablespoon",NOW(),NOW()),
("quarts",NOW(),NOW()),
("liter",NOW(),NOW()),
("pint",NOW(),NOW()),
("quart",NOW(),NOW()),
("ounce",NOW(),NOW()),
("pound",NOW(),NOW());

select * from Measurements;

INSERT INTO Ingredients (name,quantity,MeasurementId,createdAt,updatedAt) VALUES 
("bone-in chicken breasts",2,null,NOW(),NOW()),
("basmati rice",1,1,NOW(),NOW()),
("celery ribs",2,null,NOW(),NOW()),
("carrots",2,null,NOW(),NOW()),
("onion",1,null,NOW(),NOW()),
("garlic cloves",2,null,NOW(),NOW()),
("salt",1,2,NOW(),NOW()),
("black pepper",0.5,2,NOW(),NOW()),
("chicken stock",2,4,NOW(),NOW()),
("lemon juice",3,3,NOW(),NOW()),
("lemon",1,null,NOW(),NOW()),
("parsely",1,null,NOW(),NOW());

select * from Ingredients;