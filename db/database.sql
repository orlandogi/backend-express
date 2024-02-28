create database SistemaPeliculas;
use SistemaPeliculas;

CREATE TABLE usu_cat_tipo_usuario(
idTipoUsuario INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
strNombre VARCHAR(20) NOT NULL ,
strDescripcion VARCHAR(50) NOT NULL
);
SELECT * FROM usu_cat_tipo_usuario;
INSERT INTO usu_cat_tipo_usuario (strNombre,strDescripcion) VALUES ('Normal','Tiene acceso limitado al sistema'),
('Administrador','Tiene control total del sistema');

CREATE TABLE usu_cat_estado_usuario(
idEstadoUsuario INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
strEstado VARCHAR (10) NOT NULL
);
SELECT * FROM usu_cat_estado_usuario;
INSERT INTO usu_cat_estado_usuario (strEstado) VALUES ('Activo'), ('Inactivo');

CREATE TABLE usu_usuario(
idUsuario INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
strNombreUsuario VARCHAR(20) NOT NULL UNIQUE,
strContraseña VARCHAR(10) NOT NULL UNIQUE,
idTipoUsuario INT NOT NULL,
idTipoEstado INT NOT NULL DEFAULT (0),
FOREIGN KEY (idTipoUsuario) REFERENCES usu_cat_tipo_usuario(idTipoUsuario) ON DELETE CASCADE,
FOREIGN KEY (idTipoEstado) REFERENCES usu_cat_estado_usuario(idEstadoUsuario) ON DELETE CASCADE
);
SELECT * FROM usu_usuario;
INSERT INTO usu_usuario(strNombreUsuario,strContraseña,idTipoUsuario,idTipoEstado) 
VALUES('Juan','12345678',1,1),('Pedro','asdfjklñ',2,1);

CREATE TABLE peli_cat_genero(
idGeneroPelicula INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
strGenero VARCHAR(20) NOT NULL
);
SELECT * FROM peli_cat_genero;
INSERT INTO peli_cat_genero (strGenero) VALUES ('Acción'),('Aventura'),('Comedia'),('Drama'),
('Fantasía'),('Misterio'),('Romance'),('Terror'),('Ciencia ficción');

CREATE TABLE peli_cat_estados(
idEstadoPelicula INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
strEstado VARCHAR(10) NOT NULL
);
SELECT * FROM peli_cat_estados;
INSERT INTO peli_cat_estados (strEstado) VALUES ('Disponible'), ('Retirada');

CREATE TABLE peli_peliculas(
idPelicula INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
strNombre VARCHAR(20) NOT NULL,
strSinopsis VARCHAR(200) NOT NULL,
intDuracion INT NOT NULL,
curPrecio  DECIMAL(13,2) NOT NULL,
bloImagen LONGBLOB NOT NULL,
idGeneroPelicula INT NOT NULL,
idEstadoPelicula INT NOT NULL DEFAULT (0),
FOREIGN KEY (idGeneroPelicula) REFERENCES peli_cat_genero(idGeneroPelicula) ON DELETE CASCADE,
FOREIGN KEY (idEstadoPelicula) REFERENCES peli_cat_estados(idEstadoPelicula) ON DELETE CASCADE
);
SELECT * FROM peli_peliculas;

CREATE TABLE peli_generos( 
idPelicula INT NOT NULL,
idGeneroPelicula INT NOT NULL,
FOREIGN KEY (idPelicula) REFERENCES peli_peliculas(idPelicula) ON DELETE CASCADE,
FOREIGN KEY (idGeneroPelicula) REFERENCES peli_cat_genero(idGeneroPelicula) ON DELETE CASCADE
);
INSERT INTO peli_peliculas (strNombre,strSinopsis,intDuracion,curPrecio,bloImagen,idGeneroPelicula,idEstadoPelicula)
VALUES ('The Flash','Flash viaja a través del tiempo para evitar el asesinato de su madre, pero, sin saberlo, provoca una serie de cambios que originan la creación de un multiverso.',
200, 70.10,'afdsadfdsaads',1,1);
INSERT INTO peli_generos(idPelicula,idGeneroPelicula) 
VALUES (LAST_INSERT_ID(),2), (LAST_INSERT_ID(),3);
INSERT INTO peli_peliculas (strNombre,strSinopsis,intDuracion,curPrecio,bloImagen,idGeneroPelicula,idEstadoPelicula)
VALUES('Aquaman 2','Arthur se ve obligado a sacar de prisión a su hermanastro, Orm, para que lo ayude a detener a Kane.',
210, 80.10,'afdsadfdsaads',1,1);
INSERT INTO peli_generos(idPelicula,idGeneroPelicula) 
VALUES (LAST_INSERT_ID(),2), (LAST_INSERT_ID(),3);
SELECT * FROM peli_generos;

CREATE TABLE sal_cat_sala(
idSala INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
strNombreSala VARCHAR(20) NOT NULL,
strDescripcion VARCHAR(50) NOT NULL,
intNumeroAsientos INT NOT NULL
);
SELECT * FROM sal_cat_sala;
INSERT INTO sal_cat_sala(strNombreSala,strDescripcion,intNumeroAsientos)
VALUES ('Sala 1', 'Sala de cine tradicional', 109),('Sala 2', 'Sala de cine tradicional', 109),
('Sala 3', 'Sala de cine tradicional', 109),('Sala 4', 'Sala de cine tradicional', 109),
('Sala 3D', 'Ofrece una experiencia en tres dimensiones', 109),
('Sala VIP', 'Ofrece butacas más amplias y reclinables', 100),
('Sala Junior', 'Ofrece butacas adaptadas para niños', 100),
('Sala 4DX', 'Ofrece una experiencia de cine inmersiva', 100);

CREATE TABLE sub_peliculas(
idCartelera INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
fecha DATE NOT NULL,
idSala INT NOT NULL,
idPelicula INT NOT NULL,
FOREIGN KEY (idSala) REFERENCES sal_cat_sala(idSala) ON DELETE CASCADE,
FOREIGN KEY (idPelicula) REFERENCES peli_peliculas(idPelicula) ON DELETE CASCADE
);
SELECT * FROM sub_peliculas;

CREATE TABLE sub_horario(
idHorario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
horario TIME NOT NULL,
idCartelera INT NOT NULL,
FOREIGN KEY (idCartelera) REFERENCES sub_peliculas(idCartelera) ON DELETE CASCADE
);
SELECT * FROM sub_horario;
INSERT INTO sub_peliculas(fecha,idSala,idPelicula) 
VALUES ('2024-01-12',2,1);
INSERT INTO sub_horario(horario,idCartelera) 
VALUES ('03:30:00',LAST_INSERT_ID()),('06:00:00',LAST_INSERT_ID());
INSERT INTO sub_peliculas(fecha,idSala,idPelicula)
VALUES('2024-01-12',2,2);
INSERT INTO sub_horario(horario,idCartelera)
VALUES('09:00:00',LAST_INSERT_ID()),('12:00:00',LAST_INSERT_ID());

CREATE TABLE tick_ticket(
idTicket INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
dteFechaCompra DATETIME NOT NULL,
strNombreCliente VARCHAR(50) NOT NULL,
strFolio VARCHAR(10) NOT NULL,
curTotal DECIMAL(13,2) NOT NULL,
strCodigoBarras VARCHAR(50) NOT NULL,
idUsuario INT NOT NULL,
idHorario INT NOT NULL,
FOREIGN KEY (idUsuario) REFERENCES usu_usuario(idUsuario) ON DELETE CASCADE,
FOREIGN KEY (idHorario) REFERENCES sub_horario(idHorario) ON DELETE CASCADE
);
SELECT * FROM tick_ticket;

CREATE TABLE tick_asientos(
idAsientos INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
strAsiento VARCHAR(5) NOT NULL,
strCliente VARCHAR(10) NOT NULL,
idTicket INT NOT NULL,
FOREIGN KEY (idTicket) REFERENCES tick_ticket(idTicket) ON DELETE CASCADE
);
SELECT * FROM tick_asientos;
INSERT INTO tick_ticket (dteFechaCompra,strNombreCliente,strFolio,curTotal,strCodigoBarras,idUsuario,idHorario)
VALUES('2014-01-13 03:00:00','Alfredo','23sdf',200.10,'sddfdsdf',1,1);
INSERT INTO tick_asientos (strAsiento,strCliente,idTicket)
VALUES ('G-1','Adulto',LAST_INSERT_ID()),
('G-2','Adulto',LAST_INSERT_ID());
INSERT INTO tick_ticket (dteFechaCompra,strNombreCliente,strFolio,curTotal,strCodigoBarras,idUsuario,idHorario)
VALUES('2014-01-13 05:00:00','Manuel','54sdf',170.00,'fdssa',1,2);
INSERT INTO tick_asientos (strAsiento,strCliente,idTicket)
VALUES ('H-1','Adulto',LAST_INSERT_ID()),
('H-2','Niño',LAST_INSERT_ID());


