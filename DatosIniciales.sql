SET client_encoding = 'UTF8';
SELECT pg_catalog.set_config('search_path', 'public', false);

TRUNCATE TABLE 
    public."Pagos", public."Linea De Pedido", public."Pedido", public."QRToken", 
    public."RefreshTokens", public."Mesas_Reservas", public."Reserva", 
    public."EstadosCliente", public."Clientes", public."Mozos", 
    public."Administrador", public."Usuarios", public."Precios", 
    public."Sugerencias", public."Producto", public."Novedad", 
    public."Mesa", public."Horarios", public."InformacionRestaurante", 
    public."PoliticasRestaurante"
RESTART IDENTITY CASCADE;

INSERT INTO public."Usuarios" ("idUsuario", "nombreUsuario", "email", "contrasenia", "tipoUsuario") VALUES
('0a7fea9e-8554-4242-9c97-a5bfbe2c0d51', 'Administrador', 'admin@gmail.com', '$2b$10$IrhqH7f5.jgIIzvASEVwAe9IW1yaSZU4t80qkdoxja2UjaSBu3WuC', 'Administrador'),
('0dc8d5cf-8e29-436b-95a5-f552a0536748', 'Mozo1', 'franconicolassussi@gmail.com', '$2b$10$IrhqH7f5.jgIIzvASEVwAe9IW1yaSZU4t80qkdoxja2UjaSBu3WuC', 'Mozo'),
('1f8c7221-450a-4556-b163-3678e4b67f6f', 'Mozo2', 'barraganseba@gmail.com', '$2b$10$IrhqH7f5.jgIIzvASEVwAe9IW1yaSZU4t80qkdoxja2UjaSBu3WuC', 'Mozo'),
('210f882e-8f88-485e-98ec-48e516b169b3', 'ShakirChaya', 'shakirchaya2005@gmail.com', '$2b$10$IrhqH7f5.jgIIzvASEVwAe9IW1yaSZU4t80qkdoxja2UjaSBu3WuC', 'Cliente'),
('26287d99-5c80-463d-9d6f-d6a865a1eb50', 'NicolasMazzaglia', 'nicolasmazzaglia.nm@gmail.com', '$2b$10$IrhqH7f5.jgIIzvASEVwAe9IW1yaSZU4t80qkdoxja2UjaSBu3WuC', 'Cliente'),
('3b163150-276b-4855-8806-909d6b6b3392', 'Cocina', 'santikellemberger@gmail.com', '$2b$10$IrhqH7f5.jgIIzvASEVwAe9IW1yaSZU4t80qkdoxja2UjaSBu3WuC', 'SectorCocina');

INSERT INTO public."Administrador" ("idAdmin", "nombre", "apellido", "dni", "telefono") VALUES 
('0a7fea9e-8554-4242-9c97-a5bfbe2c0d51', 'Administrador', 'General', '21173333', '3415324720');

INSERT INTO public."Mozos" ("idMozo", "nombre", "apellido", "dni", "telefono") VALUES 
('0dc8d5cf-8e29-436b-95a5-f552a0536748', 'Franco', 'Sussi', '45804817', '3413779903'),
('1f8c7221-450a-4556-b163-3678e4b67f6f', 'Jose', 'Barragan', '46495171', '3415052791');

INSERT INTO public."Clientes" ("idCliente", "nombre", "apellido", "telefono", "fechaNacimiento", "emailVerificado") VALUES 
('210f882e-8f88-485e-98ec-48e516b169b3', 'Shakir', 'Chaya', '3415324728', '2005-04-01', true),
('26287d99-5c80-463d-9d6f-d6a865a1eb50', 'Nicolas', 'Mazzaglia', '3412294120', '2005-05-24', true);

INSERT INTO public."EstadosCliente" ("fechaActualizacion", "idCliente", "estado") VALUES
(CURRENT_DATE, '210f882e-8f88-485e-98ec-48e516b169b3', 'Habilitado'),
(CURRENT_DATE, '26287d99-5c80-463d-9d6f-d6a865a1eb50', 'Habilitado');

INSERT INTO public."Horarios" ("diaSemana", "horaApertura", "horaCierre") VALUES
(0, '12:00:00', '00:00:00'),
(1, '19:00:00', '00:00:00'),
(2, '19:00:00', '00:00:00'),
(3, '19:00:00', '00:00:00'),
(4, '19:00:00', '00:00:00'),
(5, '12:00:00', '01:00:00'),
(6, '12:00:00', '02:00:00');

INSERT INTO public."Mesa" ("nroMesa", "capacidad", "estado") VALUES 
(1, 2, 'Libre'), (2, 2, 'Libre'), (3, 4, 'Libre'), (4, 4, 'Libre'), (5, 4, 'Libre'),
(6, 6, 'Libre'), (7, 6, 'Libre'), (8, 8, 'Libre'), (9, 2, 'Libre'), (10, 10, 'Libre');

INSERT INTO public."Producto" ("idProducto", "nombre", "descripcion", "estado", "tipo") VALUES
(1, 'Bife de Chorizo', 'Corte de 400g', 'Disponible', 'Plato Principal'),
(2, 'Ojo de Bife', 'Corte premium 450g', 'Disponible', 'Plato Principal'),
(3, 'Papas Fritas Tradicionales', 'Porción grande', 'Disponible', 'Entrada'),
(4, 'Papas con Cheddar', 'Cheddar y verdeo', 'Disponible', 'Entrada'),
(5, 'Milanesa Napolitana', 'Para compartir', 'Disponible', 'Plato Principal'),
(6, 'Pasta Penne Rigate', 'Salsa bolognesa', 'Disponible', 'Plato Principal'),
(7, 'Ensalada César', 'Pollo, croutons y aderezo', 'Disponible', 'Plato Principal'),
(8, 'Pizza Muzarella', '8 porciones', 'Disponible', 'Plato Principal'),
(9, 'Pizza Pepperoni', 'Estilo New York', 'Disponible', 'Plato Principal'),
(10, 'Hamburguesa Classic', 'Medallón 180g', 'Disponible', 'Plato Principal'),
(11, 'Hamburguesa Veggie', 'Lentejas y quínoa', 'Disponible', 'Plato Principal'),
(12, 'Empanada de Carne', 'Salteña frita', 'Disponible', 'Entrada'),
(13, 'Empanada de Jamon y Queso', 'Al horno', 'Disponible', 'Entrada'),
(14, 'Provoleta', 'A las brasas', 'Disponible', 'Entrada'),
(15, 'Rabas', 'Anillos de calamar', 'Disponible', 'Entrada'),
(16, 'Bastones de Muzarella', 'Con salsa pomodoro', 'Disponible', 'Entrada'),
(17, 'Sorrentinos de Jamon y Queso', 'Salsa mixta', 'Disponible', 'Plato Principal'),
(18, 'Ravioles de Espinaca', 'Salsa blanca', 'Disponible', 'Plato Principal'),
(19, 'Lomo al Strogonoff', 'Con arroz blanco', 'Disponible', 'Plato Principal'),
(20, 'Pollo al Verdeo', 'Con papas noisette', 'Disponible', 'Plato Principal'),
(21, 'Salmon Rosado', 'A la plancha', 'Disponible', 'Plato Principal'),
(22, 'Arroz con Mariscos', 'Paella individual', 'Disponible', 'Plato Principal'),
(23, 'Risotto de Hongos', 'Trufa blanca', 'Disponible', 'Plato Principal'),
(24, 'Taco de Carne', '3 unidades', 'Disponible', 'Entrada'),
(25, 'Nachos con Guacamole', 'Casero', 'Disponible', 'Entrada'),
(26, 'Sopa del Dia', 'Crema de calabaza', 'Disponible', 'Entrada'),
(27, 'Tarta de Verduras', 'Mix estacional', 'Disponible', 'Plato Principal'),
(28, 'Wok de Vegetales', 'Salsa de soja', 'Disponible', 'Plato Principal'),
(29, 'Flan Casero', 'Con dulce de leche', 'Disponible', 'Postre'),
(30, 'Tiramisu', 'Receta italiana', 'Disponible', 'Postre'),
(31, 'Chocotorta', 'Clásico argentino', 'Disponible', 'Postre'),
(32, 'Helado 2 bochas', 'Vainilla y chocolate', 'Disponible', 'Postre'),
(33, 'Brownie con Helado', 'Chocolate amargo', 'Disponible', 'Postre'),
(34, 'Ensalada de Frutas', 'Frutas de estación', 'Disponible', 'Postre'),
(35, 'Creme Brulee', 'Vainilla natural', 'Disponible', 'Postre'),
(36, 'Volcan de Chocolate', 'Centro líquido', 'Disponible', 'Postre'),
(37, 'Panqueque con DDL', '2 unidades', 'Disponible', 'Postre'),
(38, 'Mousse de Limon', 'Cremoso y ácido', 'Disponible', 'Postre'),
(39, 'Carpaccio de Res', 'Finas láminas', 'Disponible', 'Entrada'),
(40, 'Bruschettas Mix', '3 variedades', 'Disponible', 'Entrada');

INSERT INTO public."Producto" ("idProducto", "nombre", "descripcion", "estado", "esAlcoholica") VALUES
(41, 'Agua Mineral', '500ml', 'Disponible', false),
(42, 'Agua con Gas', '500ml', 'Disponible', false),
(43, 'Coca Cola', '350ml', 'Disponible', false),
(44, 'Sprite', '350ml', 'Disponible', false),
(45, 'Fanta', '350ml', 'Disponible', false),
(46, 'Cerveza Quilmes', 'Chopp 500ml', 'Disponible', true),
(47, 'Cerveza Patagonia', 'IPA 500ml', 'Disponible', true),
(48, 'Vino Malbec', 'Copa 250ml', 'Disponible', true),
(49, 'Vino Chardonnay', 'Copa 250ml', 'Disponible', true),
(50, 'Limonada', 'Con menta y jengibre', 'Disponible', false),
(51, 'Jugo de Naranja', 'Exprimido natural', 'Disponible', false),
(52, 'Fernet Branca', 'Con Coca Cola', 'Disponible', true),
(53, 'Gin Tonic', 'Con rodaja de pepino', 'Disponible', true),
(54, 'Cafe Espresso', 'Grano molido', 'Disponible', false),
(55, 'Te de Hierbas', 'Variedades', 'Disponible', false);

INSERT INTO public."Precios" ("idProducto", "fechaActual", "monto")
SELECT "idProducto", CURRENT_TIMESTAMP, 
CASE WHEN "idProducto" <= 40 THEN 8500.00 ELSE 2800.00 END FROM public."Producto";

INSERT INTO public."Novedad" ("idNovedad", "titulo", "descripcion", "fechaInicio", "fechaFin") VALUES
(1, 'Inauguración Terraza', 'Sector fumadores', '2026-02-18', '2026-02-25'),
(2, 'Noche de Jazz', 'En vivo 21hs', '2026-02-20', '2026-02-21'),
(3, 'Cata Malbec', 'Bodegas Salta', '2026-02-22', '2026-02-23'),
(4, 'Sushi Fest', 'Opciones Roll', '2026-02-24', '2026-02-26'),
(5, 'After Office', 'Tragos 2x1', '2026-02-26', '2026-02-28'),
(6, 'Menú Otoño', 'Platos calientes', '2026-02-28', '2026-03-05'),
(7, 'Clase Gin', 'Preparación', '2026-03-02', '2026-03-03'),
(8, 'San Patricio', 'Cerveza libre', '2026-03-04', '2026-03-06'),
(9, 'Show Magia', 'Familiar', '2026-03-06', '2026-03-08'),
(10, 'Brunch Dom', 'Desde 11hs', '2026-03-08', '2026-03-09'),
(11, 'Postre Day', 'Degustación', '2026-03-10', '2026-03-12'),
(12, 'Promo Amigos', '4x3 personas', '2026-03-12', '2026-03-14'),
(13, 'Tabla Quesos', 'Regional', '2026-03-14', '2026-03-16'),
(14, 'Rock Tributo', 'Acústico', '2026-03-16', '2026-03-18'),
(15, 'Sorteo Cena', 'Aniversario', '2026-03-18', '2026-03-20');

INSERT INTO public."Sugerencias" ("idProducto", "fechaDesde", "fechaHasta") VALUES
(1, '2026-02-20', '2026-02-22'), (15, '2026-02-23', '2026-02-25'),
(21, '2026-02-26', '2026-02-28'), (2, '2026-03-01', '2026-03-03'),
(23, '2026-03-04', '2026-03-06'), (30, '2026-03-07', '2026-03-09'),
(5, '2026-03-10', '2026-03-12'), (36, '2026-03-13', '2026-03-15'),
(47, '2026-03-16', '2026-03-18'), (14, '2026-03-19', '2026-03-21'),
(53, '2026-03-22', '2026-03-24'), (17, '2026-03-25', '2026-03-27'),
(22, '2026-03-28', '2026-03-30'), (33, '2026-03-31', '2026-04-02'),
(52, '2026-04-03', '2026-04-05');

DO $$
DECLARE
    cliente_id UUID;
    mozo_id UUID;
BEGIN
    FOR i IN 1..10 LOOP
        IF i % 2 = 0 THEN cliente_id := '210f882e-8f88-485e-98ec-48e516b169b3';
        ELSE cliente_id := '26287d99-5c80-463d-9d6f-d6a865a1eb50';
        END IF;
        IF i % 2 = 0 THEN mozo_id := '0dc8d5cf-8e29-436b-95a5-f552a0536748';
        ELSE mozo_id := '1f8c7221-450a-4556-b163-3678e4b67f6f';
        END IF;

        INSERT INTO public."Reserva" ("idReserva", "fechaReserva", "horarioReserva", "cantidadComensales", "estado", "idCliente")
        VALUES (i, CURRENT_DATE - (i || ' days')::interval, '20:00:00', 2, 'Asistida', cliente_id);

        INSERT INTO public."Mesas_Reservas" ("idReserva", "nroMesa") VALUES (i, i);

        INSERT INTO public."Pedido" ("idPedido", "horaInicio", "estado", "cantCubiertos", "observaciones", "nroMesa", "idMozo")
        VALUES (i, '20:15:00', 'Pagado', 2, '', i, mozo_id);

        INSERT INTO public."Linea De Pedido" ("nroLinea", "idPedido", "cantidad", "estado", "nombreProducto", "monto", "tipoComida")
        VALUES (1, i, 1, 'Terminada', 'Bife de Chorizo', 8500, 'Plato Principal');

        INSERT INTO public."Pagos" ("idPago", "idPedido", "metodoPago", "fechaPago")
        VALUES (i, i, 'Efectivo', CURRENT_DATE - (i || ' days')::interval);
    END LOOP;

    INSERT INTO public."Reserva" ("idReserva", "fechaReserva", "horarioReserva", "cantidadComensales", "estado", "idCliente") VALUES
    (11, '2026-02-25', '20:30:00', 2, 'Realizada', '210f882e-8f88-485e-98ec-48e516b169b3'),
    (12, '2026-02-25', '21:00:00', 4, 'Realizada', '26287d99-5c80-463d-9d6f-d6a865a1eb50'),
    (13, '2026-02-27', '22:00:00', 2, 'Realizada', '210f882e-8f88-485e-98ec-48e516b169b3'),
    (14, '2026-02-26', '20:00:00', 2, 'Realizada', '26287d99-5c80-463d-9d6f-d6a865a1eb50'),
    (15, '2026-02-26', '21:30:00', 3, 'Realizada', '210f882e-8f88-485e-98ec-48e516b169b3'),
    (16, '2026-02-27', '22:15:00', 2, 'Realizada', '26287d99-5c80-463d-9d6f-d6a865a1eb50');
END $$;

INSERT INTO public."InformacionRestaurante" ("idInformacion", "nombreRestaurante", "direccionRestaurante", "razonSocial", "telefonoContacto") 
VALUES (1, 'Sabores Deluxe', 'Av. Pellegrini 1500', 'Resto Bar SRL', '3415324728');

INSERT INTO public."PoliticasRestaurante" ("idPolitica", "minutosTolerancia", "horarioMaximoDeReserva", "horasDeAnticipacionParaCancelar", "horasDeAnticipacionParaReservar", "limiteDeNoAsistencias", "cantDiasDeshabilitacion", "porcentajeIVA", "montoCubiertosPorPersona") 
VALUES (1, 15, '23:00', 12, 6, 3, 7, 21, 1200);

SELECT setval(pg_get_serial_sequence('public."Mesa"', 'nroMesa'), 10);
SELECT setval(pg_get_serial_sequence('public."Producto"', 'idProducto'), 55);
SELECT setval(pg_get_serial_sequence('public."Reserva"', 'idReserva'), 16);
SELECT setval(pg_get_serial_sequence('public."Pedido"', 'idPedido'), 10);
SELECT setval(pg_get_serial_sequence('public."Pagos"', 'idPago'), 10);
SELECT setval(pg_get_serial_sequence('public."Novedad"', 'idNovedad'), 15);