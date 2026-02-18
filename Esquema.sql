--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2026-02-14 17:01:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 98446)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 4990 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 887 (class 1247 OID 98480)
-- Name: EstadoCliente; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EstadoCliente" AS ENUM (
    'Habilitado',
    'Deshabilitado'
);


ALTER TYPE public."EstadoCliente" OWNER TO postgres;

--
-- TOC entry 899 (class 1247 OID 98518)
-- Name: EstadoReserva; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EstadoReserva" AS ENUM (
    'Realizada',
    'Asistida',
    'No Asistida',
    'Cancelada'
);


ALTER TYPE public."EstadoReserva" OWNER TO postgres;

--
-- TOC entry 884 (class 1247 OID 98470)
-- Name: TipoUsuario_Type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TipoUsuario_Type" AS ENUM (
    'Administrador',
    'SectorCocina',
    'Mozo',
    'Cliente'
);


ALTER TYPE public."TipoUsuario_Type" OWNER TO postgres;

--
-- TOC entry 875 (class 1247 OID 98448)
-- Name: estado; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado AS ENUM (
    'Disponible',
    'No Disponible'
);


ALTER TYPE public.estado OWNER TO postgres;

--
-- TOC entry 890 (class 1247 OID 98486)
-- Name: estadoLP; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."estadoLP" AS ENUM (
    'Pendiente',
    'En Preparacion',
    'Terminada'
);


ALTER TYPE public."estadoLP" OWNER TO postgres;

--
-- TOC entry 881 (class 1247 OID 98464)
-- Name: estadoMesa; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."estadoMesa" AS ENUM (
    'Libre',
    'Ocupada'
);


ALTER TYPE public."estadoMesa" OWNER TO postgres;

--
-- TOC entry 893 (class 1247 OID 98494)
-- Name: estadoPedido; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."estadoPedido" AS ENUM (
    'Solicitado',
    'En Preparacion',
    'Completado',
    'Pendiente De Pago',
    'Pagado',
    'Pendiente De Cobro'
);


ALTER TYPE public."estadoPedido" OWNER TO postgres;

--
-- TOC entry 896 (class 1247 OID 98508)
-- Name: metodosPago; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."metodosPago" AS ENUM (
    'MercadoPago',
    'Efectivo',
    'Debito',
    'Credito'
);


ALTER TYPE public."metodosPago" OWNER TO postgres;

--
-- TOC entry 878 (class 1247 OID 98454)
-- Name: tipo; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo AS ENUM (
    'Plato Principal',
    'Entrada',
    'Postre',
    ''
);


ALTER TYPE public.tipo OWNER TO postgres;

--
-- TOC entry 246 (class 1255 OID 98785)
-- Name: asignar_nro_linea(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.asignar_nro_linea() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Si nroLinea es NULL o 0, calculamos el siguiente número
  IF NEW."nroLinea" IS NULL OR NEW."nroLinea" = 0 THEN
    SELECT COALESCE(MAX("nroLinea"), 0) + 1 -- Esta expresión calcula el siguiente número de línea disponible dentro de un pedido, empezando en 1 cuando no hay ninguna
    INTO NEW."nroLinea"
    FROM "Linea De Pedido"
    WHERE "idPedido" = NEW."idPedido";
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.asignar_nro_linea() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 231 (class 1259 OID 98592)
-- Name: Administrador; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Administrador" (
    "idAdmin" uuid NOT NULL,
    nombre character varying(255) NOT NULL,
    apellido character varying(255) NOT NULL,
    dni character varying(10) NOT NULL,
    telefono character varying(20) NOT NULL
);


ALTER TABLE public."Administrador" OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 98599)
-- Name: Clientes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Clientes" (
    "idCliente" uuid NOT NULL,
    nombre character varying(255) NOT NULL,
    apellido character varying(255) NOT NULL,
    telefono character varying(20) NOT NULL,
    "fechaNacimiento" date NOT NULL,
    "emailVerificado" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Clientes" OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 98621)
-- Name: EstadosCliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EstadosCliente" (
    "fechaActualizacion" date NOT NULL,
    "idCliente" uuid NOT NULL,
    estado public."EstadoCliente" NOT NULL
);


ALTER TABLE public."EstadosCliente" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 98560)
-- Name: Horarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Horarios" (
    "diaSemana" integer NOT NULL,
    "horaApertura" time(6) without time zone NOT NULL,
    "horaCierre" time(6) without time zone NOT NULL
);


ALTER TABLE public."Horarios" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 98559)
-- Name: Horarios_diaSemana_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Horarios_diaSemana_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Horarios_diaSemana_seq" OWNER TO postgres;

--
-- TOC entry 4992 (class 0 OID 0)
-- Dependencies: 223
-- Name: Horarios_diaSemana_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Horarios_diaSemana_seq" OWNED BY public."Horarios"."diaSemana";


--
-- TOC entry 222 (class 1259 OID 98551)
-- Name: InformacionRestaurante; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InformacionRestaurante" (
    "idInformacion" integer NOT NULL,
    "nombreRestaurante" character varying NOT NULL,
    "direccionRestaurante" character varying NOT NULL,
    "razonSocial" character varying NOT NULL,
    "telefonoContacto" character varying NOT NULL
);


ALTER TABLE public."InformacionRestaurante" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 98550)
-- Name: InformacionRestaurante_idInformacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."InformacionRestaurante_idInformacion_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."InformacionRestaurante_idInformacion_seq" OWNER TO postgres;

--
-- TOC entry 4993 (class 0 OID 0)
-- Dependencies: 221
-- Name: InformacionRestaurante_idInformacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."InformacionRestaurante_idInformacion_seq" OWNED BY public."InformacionRestaurante"."idInformacion";


--
-- TOC entry 236 (class 1259 OID 98627)
-- Name: Linea De Pedido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Linea De Pedido" (
    "nroLinea" integer NOT NULL,
    "idPedido" integer NOT NULL,
    cantidad integer NOT NULL,
    estado public."estadoLP" NOT NULL,
    "nombreProducto" character varying NOT NULL,
    monto numeric NOT NULL,
    "tipoComida" public.tipo
);


ALTER TABLE public."Linea De Pedido" OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 98567)
-- Name: Mesa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Mesa" (
    "nroMesa" integer NOT NULL,
    capacidad integer NOT NULL,
    estado public."estadoMesa" NOT NULL
);


ALTER TABLE public."Mesa" OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 98566)
-- Name: Mesa_nroMesa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Mesa_nroMesa_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Mesa_nroMesa_seq" OWNER TO postgres;

--
-- TOC entry 4994 (class 0 OID 0)
-- Dependencies: 225
-- Name: Mesa_nroMesa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Mesa_nroMesa_seq" OWNED BY public."Mesa"."nroMesa";


--
-- TOC entry 243 (class 1259 OID 98670)
-- Name: Mesas_Reservas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Mesas_Reservas" (
    "idReserva" integer NOT NULL,
    "nroMesa" integer NOT NULL
);


ALTER TABLE public."Mesas_Reservas" OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 98606)
-- Name: Mozos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Mozos" (
    nombre character varying(255) NOT NULL,
    apellido character varying(255) NOT NULL,
    telefono character varying(20) NOT NULL,
    "idMozo" uuid NOT NULL,
    dni character varying(10) NOT NULL
);


ALTER TABLE public."Mozos" OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 98579)
-- Name: Novedad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Novedad" (
    "idNovedad" integer NOT NULL,
    titulo character varying NOT NULL,
    descripcion character varying NOT NULL,
    "fechaInicio" date NOT NULL,
    "fechaFin" date NOT NULL
);


ALTER TABLE public."Novedad" OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 98578)
-- Name: Novedad_idNovedad_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Novedad_idNovedad_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Novedad_idNovedad_seq" OWNER TO postgres;

--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 228
-- Name: Novedad_idNovedad_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Novedad_idNovedad_seq" OWNED BY public."Novedad"."idNovedad";


--
-- TOC entry 240 (class 1259 OID 98645)
-- Name: Pagos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Pagos" (
    "idPago" integer NOT NULL,
    "idPedido" integer NOT NULL,
    "metodoPago" public."metodosPago" NOT NULL,
    "fechaPago" date NOT NULL,
    "idTransaccionMP" character varying
);


ALTER TABLE public."Pagos" OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 98644)
-- Name: Pagos_idPago_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Pagos_idPago_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Pagos_idPago_seq" OWNER TO postgres;

--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 239
-- Name: Pagos_idPago_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Pagos_idPago_seq" OWNED BY public."Pagos"."idPago";


--
-- TOC entry 238 (class 1259 OID 98636)
-- Name: Pedido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Pedido" (
    "idPedido" integer NOT NULL,
    "horaInicio" time(6) without time zone NOT NULL,
    estado public."estadoPedido" NOT NULL,
    "cantCubiertos" integer NOT NULL,
    observaciones character varying NOT NULL,
    "nroMesa" integer,
    "idMozo" uuid
);


ALTER TABLE public."Pedido" OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 98635)
-- Name: Pedido_idPedido_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Pedido_idPedido_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Pedido_idPedido_seq" OWNER TO postgres;

--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 237
-- Name: Pedido_idPedido_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Pedido_idPedido_seq" OWNED BY public."Pedido"."idPedido";


--
-- TOC entry 220 (class 1259 OID 98535)
-- Name: PoliticasRestaurante; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PoliticasRestaurante" (
    "idPolitica" integer NOT NULL,
    "minutosTolerancia" integer DEFAULT 15 NOT NULL,
    "horarioMaximoDeReserva" character varying NOT NULL,
    "horasDeAnticipacionParaCancelar" integer DEFAULT 6 NOT NULL,
    "horasDeAnticipacionParaReservar" integer DEFAULT 6 NOT NULL,
    "limiteDeNoAsistencias" integer DEFAULT 3 NOT NULL,
    "cantDiasDeshabilitacion" integer DEFAULT 90 NOT NULL,
    "porcentajeIVA" integer DEFAULT 21 NOT NULL,
    "montoCubiertosPorPersona" integer DEFAULT 5 NOT NULL
);


ALTER TABLE public."PoliticasRestaurante" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 98534)
-- Name: PoliticasRestaurante_idPolitica_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PoliticasRestaurante_idPolitica_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PoliticasRestaurante_idPolitica_seq" OWNER TO postgres;

--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 219
-- Name: PoliticasRestaurante_idPolitica_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PoliticasRestaurante_idPolitica_seq" OWNED BY public."PoliticasRestaurante"."idPolitica";


--
-- TOC entry 230 (class 1259 OID 98587)
-- Name: Precios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Precios" (
    "idProducto" integer NOT NULL,
    "fechaActual" timestamp without time zone NOT NULL,
    monto numeric(10,2) NOT NULL
);


ALTER TABLE public."Precios" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 98528)
-- Name: Producto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Producto" (
    "idProducto" integer NOT NULL,
    nombre character varying(30) NOT NULL,
    descripcion character varying(255) NOT NULL,
    estado public.estado NOT NULL,
    "esAlcoholica" boolean,
    "esVegetariana" boolean,
    "esVegana" boolean,
    tipo public.tipo,
    "esSinGluten" boolean
);


ALTER TABLE public."Producto" OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 98527)
-- Name: Producto_idProducto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Producto_idProducto_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Producto_idProducto_seq" OWNER TO postgres;

--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 217
-- Name: Producto_idProducto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Producto_idProducto_seq" OWNED BY public."Producto"."idProducto";


--
-- TOC entry 242 (class 1259 OID 98661)
-- Name: QRToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."QRToken" (
    "nroMesa" integer NOT NULL,
    "idMozo" uuid NOT NULL,
    "tokenQR" character varying NOT NULL,
    revocado boolean DEFAULT false NOT NULL,
    "fechaCreacion" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."QRToken" OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 98653)
-- Name: RefreshTokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RefreshTokens" (
    "idToken" uuid NOT NULL,
    "idUsuario" uuid NOT NULL,
    token character varying NOT NULL,
    "fechaCreacion" timestamp(6) with time zone NOT NULL,
    "fechaExpiracion" timestamp(6) with time zone NOT NULL,
    revocado boolean DEFAULT false NOT NULL
);


ALTER TABLE public."RefreshTokens" OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 98676)
-- Name: Reserva; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Reserva" (
    "idReserva" integer NOT NULL,
    "fechaReserva" date NOT NULL,
    "horarioReserva" time(6) without time zone NOT NULL,
    "fechaCancelacion" date,
    "cantidadComensales" integer NOT NULL,
    estado public."EstadoReserva" NOT NULL,
    "idCliente" uuid NOT NULL
);


ALTER TABLE public."Reserva" OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 98675)
-- Name: Reserva_idReserva_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Reserva_idReserva_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Reserva_idReserva_seq" OWNER TO postgres;

--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 244
-- Name: Reserva_idReserva_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Reserva_idReserva_seq" OWNED BY public."Reserva"."idReserva";


--
-- TOC entry 227 (class 1259 OID 98573)
-- Name: Sugerencias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Sugerencias" (
    "fechaDesde" date NOT NULL,
    "fechaHasta" date NOT NULL,
    "idProducto" integer NOT NULL
);


ALTER TABLE public."Sugerencias" OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 98613)
-- Name: Usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Usuarios" (
    "idUsuario" uuid DEFAULT gen_random_uuid() NOT NULL,
    "nombreUsuario" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    contrasenia character varying(255) NOT NULL,
    "tipoUsuario" public."TipoUsuario_Type" NOT NULL
);


ALTER TABLE public."Usuarios" OWNER TO postgres;

--
-- TOC entry 4763 (class 2604 OID 98563)
-- Name: Horarios diaSemana; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Horarios" ALTER COLUMN "diaSemana" SET DEFAULT nextval('public."Horarios_diaSemana_seq"'::regclass);


--
-- TOC entry 4762 (class 2604 OID 98554)
-- Name: InformacionRestaurante idInformacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InformacionRestaurante" ALTER COLUMN "idInformacion" SET DEFAULT nextval('public."InformacionRestaurante_idInformacion_seq"'::regclass);


--
-- TOC entry 4764 (class 2604 OID 98570)
-- Name: Mesa nroMesa; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mesa" ALTER COLUMN "nroMesa" SET DEFAULT nextval('public."Mesa_nroMesa_seq"'::regclass);


--
-- TOC entry 4765 (class 2604 OID 98582)
-- Name: Novedad idNovedad; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Novedad" ALTER COLUMN "idNovedad" SET DEFAULT nextval('public."Novedad_idNovedad_seq"'::regclass);


--
-- TOC entry 4769 (class 2604 OID 98648)
-- Name: Pagos idPago; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pagos" ALTER COLUMN "idPago" SET DEFAULT nextval('public."Pagos_idPago_seq"'::regclass);


--
-- TOC entry 4768 (class 2604 OID 98639)
-- Name: Pedido idPedido; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pedido" ALTER COLUMN "idPedido" SET DEFAULT nextval('public."Pedido_idPedido_seq"'::regclass);


--
-- TOC entry 4754 (class 2604 OID 98538)
-- Name: PoliticasRestaurante idPolitica; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PoliticasRestaurante" ALTER COLUMN "idPolitica" SET DEFAULT nextval('public."PoliticasRestaurante_idPolitica_seq"'::regclass);


--
-- TOC entry 4753 (class 2604 OID 98531)
-- Name: Producto idProducto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Producto" ALTER COLUMN "idProducto" SET DEFAULT nextval('public."Producto_idProducto_seq"'::regclass);


--
-- TOC entry 4773 (class 2604 OID 98679)
-- Name: Reserva idReserva; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reserva" ALTER COLUMN "idReserva" SET DEFAULT nextval('public."Reserva_idReserva_seq"'::regclass);


--
-- TOC entry 4793 (class 2606 OID 98598)
-- Name: Administrador Administrador_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Administrador"
    ADD CONSTRAINT "Administrador_pkey" PRIMARY KEY ("idAdmin");


--
-- TOC entry 4796 (class 2606 OID 98605)
-- Name: Clientes Clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Clientes"
    ADD CONSTRAINT "Clientes_pkey" PRIMARY KEY ("idCliente");


--
-- TOC entry 4782 (class 2606 OID 98565)
-- Name: Horarios Horarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Horarios"
    ADD CONSTRAINT "Horarios_pkey" PRIMARY KEY ("diaSemana");


--
-- TOC entry 4780 (class 2606 OID 98558)
-- Name: InformacionRestaurante InformacionRestaurante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InformacionRestaurante"
    ADD CONSTRAINT "InformacionRestaurante_pkey" PRIMARY KEY ("idInformacion");


--
-- TOC entry 4784 (class 2606 OID 98572)
-- Name: Mesa Mesa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mesa"
    ADD CONSTRAINT "Mesa_pkey" PRIMARY KEY ("nroMesa");


--
-- TOC entry 4820 (class 2606 OID 98674)
-- Name: Mesas_Reservas Mesas_Reservas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mesas_Reservas"
    ADD CONSTRAINT "Mesas_Reservas_pkey" PRIMARY KEY ("idReserva", "nroMesa");


--
-- TOC entry 4798 (class 2606 OID 98612)
-- Name: Mozos Mozo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mozos"
    ADD CONSTRAINT "Mozo_pkey" PRIMARY KEY ("idMozo");


--
-- TOC entry 4788 (class 2606 OID 98586)
-- Name: Novedad Novedades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Novedad"
    ADD CONSTRAINT "Novedades_pkey" PRIMARY KEY ("idNovedad");


--
-- TOC entry 4812 (class 2606 OID 98652)
-- Name: Pagos Pagos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pagos"
    ADD CONSTRAINT "Pagos_pkey" PRIMARY KEY ("idPago");


--
-- TOC entry 4810 (class 2606 OID 98643)
-- Name: Pedido Pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pedido"
    ADD CONSTRAINT "Pedido_pkey" PRIMARY KEY ("idPedido");


--
-- TOC entry 4778 (class 2606 OID 98549)
-- Name: PoliticasRestaurante PoliticasRestaurante_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PoliticasRestaurante"
    ADD CONSTRAINT "PoliticasRestaurante_pkey" PRIMARY KEY ("idPolitica");


--
-- TOC entry 4791 (class 2606 OID 98794)
-- Name: Precios Precios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Precios"
    ADD CONSTRAINT "Precios_pkey" PRIMARY KEY ("idProducto", "fechaActual");


--
-- TOC entry 4775 (class 2606 OID 98533)
-- Name: Producto Producto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Producto"
    ADD CONSTRAINT "Producto_pkey" PRIMARY KEY ("idProducto");


--
-- TOC entry 4817 (class 2606 OID 98669)
-- Name: QRToken QRToken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QRToken"
    ADD CONSTRAINT "QRToken_pkey" PRIMARY KEY ("nroMesa");


--
-- TOC entry 4814 (class 2606 OID 98660)
-- Name: RefreshTokens RefreshTokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefreshTokens"
    ADD CONSTRAINT "RefreshTokens_pkey" PRIMARY KEY ("idToken");


--
-- TOC entry 4822 (class 2606 OID 98681)
-- Name: Reserva Reserva_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reserva"
    ADD CONSTRAINT "Reserva_pkey" PRIMARY KEY ("idReserva");


--
-- TOC entry 4786 (class 2606 OID 98577)
-- Name: Sugerencias Sugerencias_PK; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sugerencias"
    ADD CONSTRAINT "Sugerencias_PK" PRIMARY KEY ("idProducto", "fechaDesde");


--
-- TOC entry 4802 (class 2606 OID 98620)
-- Name: Usuarios Usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("idUsuario");


--
-- TOC entry 4806 (class 2606 OID 98625)
-- Name: EstadosCliente estadoCliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EstadosCliente"
    ADD CONSTRAINT "estadoCliente_pkey" PRIMARY KEY ("idCliente", "fechaActualizacion");


--
-- TOC entry 4808 (class 2606 OID 98634)
-- Name: Linea De Pedido linea_pKey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Linea De Pedido"
    ADD CONSTRAINT "linea_pKey" PRIMARY KEY ("idPedido", "nroLinea");


--
-- TOC entry 4789 (class 1259 OID 98683)
-- Name: titulo_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX titulo_unique ON public."Novedad" USING btree (titulo);


--
-- TOC entry 4776 (class 1259 OID 98682)
-- Name: uniqueName; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "uniqueName" ON public."Producto" USING btree (nombre);


--
-- TOC entry 4815 (class 1259 OID 98689)
-- Name: uniqueToken; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "uniqueToken" ON public."RefreshTokens" USING btree (token);


--
-- TOC entry 4818 (class 1259 OID 98690)
-- Name: uniqueTokenQR; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "uniqueTokenQR" ON public."QRToken" USING btree ("tokenQR");


--
-- TOC entry 4794 (class 1259 OID 98684)
-- Name: unique_dni; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_dni ON public."Administrador" USING btree (dni);


--
-- TOC entry 4799 (class 1259 OID 98686)
-- Name: unique_dni_mozo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_dni_mozo ON public."Mozos" USING btree (dni);


--
-- TOC entry 4803 (class 1259 OID 98688)
-- Name: unique_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_email ON public."Usuarios" USING btree (email);


--
-- TOC entry 4800 (class 1259 OID 98685)
-- Name: unique_telefono_mozo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_telefono_mozo ON public."Mozos" USING btree (telefono);


--
-- TOC entry 4804 (class 1259 OID 98687)
-- Name: unique_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_username ON public."Usuarios" USING btree ("nombreUsuario");


--
-- TOC entry 4839 (class 2620 OID 98786)
-- Name: Linea De Pedido trigger_asignar_nro_linea; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_asignar_nro_linea BEFORE INSERT ON public."Linea De Pedido" FOR EACH ROW EXECUTE FUNCTION public.asignar_nro_linea();


--
-- TOC entry 4825 (class 2606 OID 98701)
-- Name: Administrador Admin_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Administrador"
    ADD CONSTRAINT "Admin_fkey" FOREIGN KEY ("idAdmin") REFERENCES public."Usuarios"("idUsuario");


--
-- TOC entry 4826 (class 2606 OID 98706)
-- Name: Clientes Cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Clientes"
    ADD CONSTRAINT "Cliente_fkey" FOREIGN KEY ("idCliente") REFERENCES public."Usuarios"("idUsuario");


--
-- TOC entry 4836 (class 2606 OID 98772)
-- Name: Mesas_Reservas Mesa_fKey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mesas_Reservas"
    ADD CONSTRAINT "Mesa_fKey" FOREIGN KEY ("nroMesa") REFERENCES public."Mesa"("nroMesa") ON DELETE CASCADE;


--
-- TOC entry 4827 (class 2606 OID 98711)
-- Name: Mozos Mozo_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mozos"
    ADD CONSTRAINT "Mozo_fkey" FOREIGN KEY ("idMozo") REFERENCES public."Usuarios"("idUsuario") ON DELETE CASCADE;


--
-- TOC entry 4837 (class 2606 OID 98761)
-- Name: Mesas_Reservas Reserva_fKey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Mesas_Reservas"
    ADD CONSTRAINT "Reserva_fKey" FOREIGN KEY ("idReserva") REFERENCES public."Reserva"("idReserva");


--
-- TOC entry 4828 (class 2606 OID 98716)
-- Name: EstadosCliente idCliente; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EstadosCliente"
    ADD CONSTRAINT "idCliente" FOREIGN KEY ("idCliente") REFERENCES public."Clientes"("idCliente");


--
-- TOC entry 4838 (class 2606 OID 98766)
-- Name: Reserva idCliente_fKey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Reserva"
    ADD CONSTRAINT "idCliente_fKey" FOREIGN KEY ("idCliente") REFERENCES public."Clientes"("idCliente");


--
-- TOC entry 4830 (class 2606 OID 98726)
-- Name: Pedido idMozo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pedido"
    ADD CONSTRAINT "idMozo" FOREIGN KEY ("idMozo") REFERENCES public."Mozos"("idMozo") ON DELETE SET NULL;


--
-- TOC entry 4834 (class 2606 OID 98746)
-- Name: QRToken idMozo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QRToken"
    ADD CONSTRAINT "idMozo" FOREIGN KEY ("idMozo") REFERENCES public."Mozos"("idMozo") ON DELETE CASCADE;


--
-- TOC entry 4829 (class 2606 OID 98721)
-- Name: Linea De Pedido idPedido; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Linea De Pedido"
    ADD CONSTRAINT "idPedido" FOREIGN KEY ("idPedido") REFERENCES public."Pedido"("idPedido");


--
-- TOC entry 4831 (class 2606 OID 98731)
-- Name: Pedido nroMesa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pedido"
    ADD CONSTRAINT "nroMesa" FOREIGN KEY ("nroMesa") REFERENCES public."Mesa"("nroMesa") ON DELETE SET NULL;


--
-- TOC entry 4835 (class 2606 OID 98751)
-- Name: QRToken nroMesa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QRToken"
    ADD CONSTRAINT "nroMesa" FOREIGN KEY ("nroMesa") REFERENCES public."Mesa"("nroMesa") ON DELETE CASCADE;


--
-- TOC entry 4832 (class 2606 OID 98736)
-- Name: Pagos pedidos_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Pagos"
    ADD CONSTRAINT pedidos_fk FOREIGN KEY ("idPedido") REFERENCES public."Pedido"("idPedido") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4824 (class 2606 OID 98696)
-- Name: Precios producto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Precios"
    ADD CONSTRAINT producto_fkey FOREIGN KEY ("idProducto") REFERENCES public."Producto"("idProducto") ON DELETE CASCADE;


--
-- TOC entry 4823 (class 2606 OID 98691)
-- Name: Sugerencias producto_sugerencia; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sugerencias"
    ADD CONSTRAINT producto_sugerencia FOREIGN KEY ("idProducto") REFERENCES public."Producto"("idProducto");


--
-- TOC entry 4833 (class 2606 OID 98741)
-- Name: RefreshTokens userFK; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefreshTokens"
    ADD CONSTRAINT "userFK" FOREIGN KEY ("idUsuario") REFERENCES public."Usuarios"("idUsuario") ON DELETE CASCADE;


--
-- TOC entry 4991 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2026-02-14 17:01:48

--
-- PostgreSQL database dump complete
--

