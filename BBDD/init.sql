-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 26-02-2026 a las 15:35:22
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `miopia_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citas`
--

CREATE TABLE `citas` (
  `id` bigint(20) NOT NULL,
  `estado` varchar(50) NOT NULL,
  `fecha_hora` datetime(6) NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `notas` varchar(1000) DEFAULT NULL,
  `clinica_id` bigint(20) NOT NULL,
  `optometrista_id` bigint(20) DEFAULT NULL,
  `paciente_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `citas`
--

INSERT INTO `citas` (`id`, `estado`, `fecha_hora`, `motivo`, `notas`, `clinica_id`, `optometrista_id`, `paciente_id`) VALUES
(1, 'PENDIENTE', '2026-02-20 12:31:00.000000', 'Revisión de Control', NULL, 2, NULL, 23),
(2, 'PENDIENTE', '0002-02-21 19:00:00.000000', 'Revisión de Control', 'Control de miopControl de miopia', 5, NULL, 25),
(3, 'PENDIENTE', '2026-02-18 14:38:00.000000', 'Revisión de Control', NULL, 2, NULL, 24),
(4, 'PENDIENTE', '2026-02-20 12:50:00.000000', 'Revisión de Control', NULL, 2, NULL, 24),
(5, 'PENDIENTE', '2026-02-20 17:59:00.000000', 'Revisión de Control', NULL, 2, NULL, 24),
(6, 'PENDIENTE', '2026-02-20 13:06:00.000000', 'Revisión de Control', NULL, 2, NULL, 24),
(7, 'PENDIENTE', '2026-02-21 13:13:00.000000', 'Revisión de Control', NULL, 2, NULL, 24),
(8, 'PENDIENTE', '2026-02-23 15:48:00.000000', 'Revisión de Control', NULL, 2, NULL, 24),
(10, 'PENDIENTE', '2026-02-23 18:00:00.000000', 'Revisión de Control', NULL, 2, NULL, 24),
(14, 'PENDIENTE', '2026-04-29 14:36:00.000000', 'Revisión de Control', NULL, 2, NULL, 23);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clinicas`
--

CREATE TABLE `clinicas` (
  `id` bigint(20) NOT NULL,
  `cif` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `nombre_comercial` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clinicas`
--

INSERT INTO `clinicas` (`id`, `cif`, `direccion`, `nombre_comercial`, `password`, `telefono`, `username`) VALUES
(1, 'B99999999', 'Calle Test', 'Óptica Demo', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQiy38J', NULL, 'optica1'),
(2, 'B222222', NULL, 'Mi Optica Real', '$2a$10$7efRinhg7by0JmRNlj7hr.MNJgAcz5oqDaHpqqvS6fCLcY6emX4li', NULL, 'optica2'),
(3, 'DEV123', NULL, 'Dev Clinic', '$2a$10$tdyiHa2AuEfCExw1Yvb8aOuTe05JfPmPXKuEzUwgrig5ZhRQDo1Iq', NULL, 'dev'),
(4, 'b2342344', NULL, 'OpticaPrueba', '$2a$10$YxXFtXxj0BlWAd3p.kiHBeehmOPkt2m31C4pN3X5NrHDba6HVFA8i', NULL, 'opticap'),
(5, 'B12345678', NULL, 'Test Clinic', '$2a$10$3JH/.bNgNPo/8Sut4gqOS.2rNelU2G99peyaQYR8Vrv18F7R0qeK6', NULL, 'test'),
(6, '12132545', NULL, 'optica demo', '$2a$10$W12a93LUjA7LcL9DT6SKw.tkHAdOt2c7w41h6PEj2N2nGi/l1zY56', NULL, 'optica demo'),
(7, '1231354', NULL, 'opticademo', '$2a$10$hxGC1anlcaeNr9h1UPQzG.0C.bgTbdXhPNHyqlOnZGkL7k40nvNJC', NULL, 'opticademo'),
(8, '1235456', NULL, 'demo', '$2a$10$ho98VQnJAfvQLpkOPqVd2OdWMLW.XIrV81Wj0HQqCMwC.ehlUMKFS', NULL, 'demo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `optometristas`
--

CREATE TABLE `optometristas` (
  `id` bigint(20) NOT NULL,
  `nombre_completo` varchar(255) DEFAULT NULL,
  `numero_colegiado` varchar(255) DEFAULT NULL,
  `clinica_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `optometristas`
--

INSERT INTO `optometristas` (`id`, `nombre_completo`, `numero_colegiado`, `clinica_id`) VALUES
(1, 'Laura Optometrista', 'COL-12345', 2),
(2, 'Carlos Visión', 'COL-99887', 2),
(3, 'Ana Ortoqueratología', 'COL-33445', 2),
(5, 'lidia fernandez', '21802', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id` bigint(20) NOT NULL,
  `apellidos` varchar(255) DEFAULT NULL,
  `email_tutor` varchar(255) DEFAULT NULL,
  `fecha_alta` date DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `nombre_tutor` varchar(255) DEFAULT NULL,
  `sexo` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `clinica_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id`, `apellidos`, `email_tutor`, `fecha_alta`, `fecha_nacimiento`, `nombre`, `nombre_tutor`, `sexo`, `telefono`, `clinica_id`) VALUES
(11, 'López Convergencia', NULL, '2023-02-01', '2015-08-20', 'Hugo', NULL, 'M', NULL, 2),
(12, 'Ruiz Acomodación', NULL, '2023-03-15', '2014-03-10', 'Carla', NULL, 'F', NULL, 2),
(13, 'Gómez Estable', NULL, '2023-06-01', '2016-01-20', 'Pedro', NULL, 'M', NULL, 2),
(14, 'Magna Fuerte', NULL, '2022-01-15', '2012-09-10', 'Luis', NULL, 'M', NULL, 2),
(15, 'Cilindro Alto', NULL, '2023-03-20', '2015-12-05', 'Marta', NULL, 'F', NULL, 2),
(17, 'Test Sin Ignore', NULL, '2024-02-09', '2018-05-20', 'Borja jose', 'Tutor', 'M', '600000000', 2),
(18, 'fernandez lopez', 'ejemplo@email.com', '2026-02-12', '2020-04-02', 'juan', 'juana garcia', 'Hombre', '669000310', 2),
(19, 'prueba tratamiento VERDE', 'prueba@prueba.com', '2026-02-13', '2014-01-01', 'Paciente', 'madre prueba ', 'Mujer', '612312312', 2),
(22, 'prueba', 'prueba@email.com', '2026-02-13', '2011-05-04', 'prueba', 'prueba padre', 'Mujer', '66454655', 4),
(23, 'sin tratamiento ROJO', 'prueba@email.com', '2026-02-20', '2015-01-15', 'Paciente', 'padre prueba', 'Mujer', '698765432', 2),
(24, 'prueba tratamiento AMARILLO', 'prueba@email.es', '2026-02-20', '2015-06-05', 'Paciente', 'madre prueba', 'Hombre', '645678454', 2),
(25, 'Perez', NULL, '2026-02-20', '2015-01-01', 'Juan', NULL, 'Hombre', '123456789', 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `revisiones`
--

CREATE TABLE `revisiones` (
  `id` bigint(20) NOT NULL,
  `fecha_revision` date DEFAULT NULL,
  `anamnesis` varchar(500) DEFAULT NULL,
  `od_esfera` double DEFAULT NULL,
  `od_cilindro` double DEFAULT NULL,
  `od_eje` int(11) DEFAULT NULL,
  `od_agudeza_visual` double DEFAULT NULL,
  `oi_esfera` double DEFAULT NULL,
  `oi_cilindro` double DEFAULT NULL,
  `oi_eje` int(11) DEFAULT NULL,
  `oi_agudeza_visual` double DEFAULT NULL,
  `od_k1` double DEFAULT NULL,
  `od_k2` double DEFAULT NULL,
  `od_longitud_axial` double DEFAULT NULL,
  `oi_k1` double DEFAULT NULL,
  `oi_k2` double DEFAULT NULL,
  `oi_longitud_axial` double DEFAULT NULL,
  `foria_lejos` varchar(255) DEFAULT NULL,
  `foria_cerca` varchar(255) DEFAULT NULL,
  `ppc` double DEFAULT NULL,
  `mem` double DEFAULT NULL,
  `ac_a` double DEFAULT NULL,
  `stereopsis` int(11) DEFAULT NULL,
  `tratamiento_actual` varchar(255) DEFAULT NULL,
  `alertas_sistema` varchar(255) DEFAULT NULL,
  `paciente_id` bigint(20) NOT NULL,
  `optometrista_id` bigint(20) NOT NULL,
  `odk1` double DEFAULT NULL,
  `odk2` double DEFAULT NULL,
  `oik1` double DEFAULT NULL,
  `oik2` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `revisiones`
--

INSERT INTO `revisiones` (`id`, `fecha_revision`, `anamnesis`, `od_esfera`, `od_cilindro`, `od_eje`, `od_agudeza_visual`, `oi_esfera`, `oi_cilindro`, `oi_eje`, `oi_agudeza_visual`, `od_k1`, `od_k2`, `od_longitud_axial`, `oi_k1`, `oi_k2`, `oi_longitud_axial`, `foria_lejos`, `foria_cerca`, `ppc`, `mem`, `ac_a`, `stereopsis`, `tratamiento_actual`, `alertas_sistema`, `paciente_id`, `optometrista_id`, `odk1`, `odk2`, `oik1`, `oik2`) VALUES
(4, '2024-02-10', 'Problemas leer.', 0.5, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Orto', '10 Exo', 18, 0.5, NULL, 60, NULL, 'Posible Insuficiencia', 11, 1, NULL, NULL, NULL, NULL),
(5, '2024-04-05', 'Dolor cabeza.', -0.75, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2 Endo', 6, -0.5, NULL, NULL, NULL, 'Sospecha Exceso', 12, 1, NULL, NULL, NULL, NULL),
(7, '2023-06-01', 'Primera visita.', -0.5, NULL, NULL, 1, NULL, NULL, NULL, NULL, 42, 42.5, 23.1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'NORMAL', 13, 2, NULL, NULL, NULL, NULL),
(8, '2024-06-01', 'Revisión anual.', -0.75, NULL, NULL, 1, NULL, NULL, NULL, NULL, 42, 42.5, 23.2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'NORMAL', 13, 2, NULL, NULL, NULL, NULL),
(9, '2024-05-15', 'Mejoría en lectura tras ejercicios.', 0.5, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Orto', '6 Exo', 10, 0.5, NULL, 40, NULL, 'Mejoría Binocular', 11, 1, NULL, NULL, NULL, NULL),
(10, '2022-02-01', 'Primera visita. Miopía alta familiar.', -6, -0.5, 180, 0.8, NULL, NULL, NULL, NULL, 43, 43.5, 26.1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'NINGUNO', 'ALERTA: Miopía Magna', 14, 3, NULL, NULL, NULL, NULL),
(11, '2023-02-01', 'Revisión anual. Empeoramiento notable.', -6.75, -0.75, 175, 0.9, NULL, NULL, NULL, NULL, 43, 43.5, 26.5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ATROPINA_001', 'ALERTA: Progresión Rápida', 14, 3, NULL, NULL, NULL, NULL),
(12, '2024-02-01', 'Control Atropina. Estable.', -6.75, -0.75, 175, 1, NULL, NULL, NULL, NULL, 43, 43.5, 26.55, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ATROPINA_001', 'Miopía Estabilizada', 14, 3, NULL, NULL, NULL, NULL),
(13, '2024-01-15', 'Ve mal de lejos y cerca.', 0.5, -3.5, 180, 0.7, -4, NULL, NULL, NULL, 41, 45, 23, NULL, NULL, 24, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'NORMAL', 15, 1, NULL, NULL, NULL, NULL),
(14, '2024-06-15', 'Ya no tiene dolor de cabeza.', -0.75, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Orto', 8, 0.5, NULL, NULL, NULL, 'Visualmente Eficaz', 12, 1, NULL, NULL, NULL, NULL),
(22, '2026-03-13', 'control miopia', -3.25, NULL, NULL, NULL, -3, NULL, NULL, NULL, NULL, NULL, 24.35, NULL, NULL, 24.25, '', '', 7, 0.75, NULL, 0, 'GAFAS_MIYOSMART', 'Miopía Simple', 19, 2, NULL, NULL, NULL, NULL),
(23, '2021-01-20', 'dolor de cabeza', -1, NULL, NULL, NULL, -0.75, NULL, NULL, NULL, NULL, NULL, 22.8, NULL, NULL, 22.75, '', '', 7, 0.5, NULL, NULL, 'NINGUNO', 'Miopía Simple', 19, 2, NULL, NULL, NULL, NULL),
(24, '2022-03-20', 'dolor de ojos', -2.25, NULL, NULL, NULL, -2, NULL, NULL, NULL, NULL, NULL, 23.6, NULL, NULL, 23.4, '', '', 9, 1.25, NULL, NULL, 'GAFAS_MIYOSMART', 'Miopía Simple | Lag Acomodativo Alto', 19, 3, NULL, NULL, NULL, NULL),
(25, '2024-03-15', 'revision miyosmart', -2.75, NULL, NULL, NULL, -2.5, NULL, NULL, NULL, NULL, NULL, 24.05, NULL, NULL, 23.9, '', '', 7, 0.75, NULL, NULL, 'GAFAS_MIYOSMART', 'Miopía Simple', 19, 3, NULL, NULL, NULL, NULL),
(26, '2025-02-18', 'revision control miopia', -3, NULL, NULL, NULL, -2.75, NULL, NULL, NULL, NULL, NULL, 24.25, NULL, NULL, 24.15, '', '', 7, 0.75, NULL, NULL, 'GAFAS_MIYOSMART', 'Miopía Simple', 19, 2, NULL, NULL, NULL, NULL),
(27, '2023-03-12', 'revision control de miopia', -2.5, NULL, NULL, NULL, -2.25, NULL, NULL, NULL, NULL, NULL, 23.8, NULL, NULL, 23.65, '', '', 8, 1, NULL, NULL, 'GAFAS_MIYOSMART', 'Miopía Simple | Lag Acomodativo Alto', 19, 3, NULL, NULL, NULL, NULL),
(28, '2027-03-15', 'control miopia', -3.25, NULL, NULL, NULL, -3, NULL, NULL, NULL, NULL, NULL, 24.45, NULL, NULL, 24.35, '', '', 7, 0.5, NULL, NULL, 'GAFAS_MIYOSMART', 'Miopía Simple', 19, 2, NULL, NULL, NULL, NULL),
(29, '2021-01-20', 'revision, no ve bien', -1, NULL, NULL, NULL, -0.75, NULL, NULL, NULL, NULL, NULL, 22.8, NULL, NULL, 22.75, '', '', 8, 0.5, NULL, NULL, 'NINGUNO', 'Miopía Simple', 23, 5, NULL, NULL, NULL, NULL),
(30, '2022-01-22', 'control ', -2.25, NULL, NULL, NULL, -2, NULL, NULL, NULL, NULL, NULL, 23.6, NULL, NULL, 23.4, '', '', 10, 1.25, NULL, NULL, 'GAFAS', 'Miopía Simple | Lag Acomodativo Alto', 23, 5, NULL, NULL, NULL, NULL),
(31, '2023-01-18', 'control revision', -3.75, NULL, NULL, NULL, -3.5, NULL, NULL, NULL, NULL, NULL, 24.5, NULL, NULL, 24.2, '', '', 12, 1.75, NULL, NULL, 'GAFAS', 'Miopía Simple | PPC Alejado | Lag Acomodativo Alto', 23, 3, NULL, NULL, NULL, NULL),
(32, '2024-01-25', 'revision', -5.25, NULL, NULL, NULL, -4.75, NULL, NULL, NULL, NULL, NULL, 25.5, NULL, NULL, 25.1, '', '', 14, 2, NULL, NULL, 'GAFAS', 'Miopía Simple | PPC Alejado | Lag Acomodativo Alto', 23, 5, NULL, NULL, NULL, NULL),
(33, '2025-02-10', 'revision', -6.75, NULL, NULL, NULL, -6.25, NULL, NULL, NULL, NULL, NULL, 26.3, NULL, NULL, 25.9, '', '', 15, 2.25, NULL, NULL, 'NINGUNO', '⚠️ ALERTA: Miopía Magna (Alto Riesgo Patológico) | ⚠️ Riesgo Maculopatía (LA > 26mm) | PPC Alejado | Lag Acomodativo Alto', 23, 3, NULL, NULL, NULL, NULL),
(34, '2021-06-10', 'revision', -1.25, NULL, NULL, NULL, -1, NULL, NULL, NULL, NULL, NULL, 23, NULL, NULL, 22.95, '', '', 8, 0.75, NULL, NULL, 'NINGUNO', 'Miopía Simple', 24, 5, NULL, NULL, NULL, NULL),
(35, '2022-06-15', 'revision', -2, NULL, NULL, NULL, -1.75, NULL, NULL, NULL, NULL, NULL, 23.9, NULL, NULL, 23.8, '', '', 9, 1, NULL, NULL, 'GAFAS', 'Miopía Simple | Lag Acomodativo Alto', 24, 3, NULL, NULL, NULL, NULL),
(36, '2023-06-12', 'revision', -2.75, NULL, NULL, NULL, -2.5, NULL, NULL, NULL, NULL, NULL, 24.6, NULL, NULL, 24.5, '', '', 10, 1.25, NULL, NULL, 'GAFAS', 'Miopía Simple | Lag Acomodativo Alto', 24, 5, NULL, NULL, NULL, NULL),
(37, '2024-06-20', 'revision', -3.5, NULL, NULL, NULL, -3.25, NULL, NULL, NULL, NULL, NULL, 25, NULL, NULL, 24.9, '', '', 10, 1.25, NULL, NULL, 'GAFAS', 'Miopía Simple | Lag Acomodativo Alto', 24, 5, NULL, NULL, NULL, NULL),
(38, '2026-02-23', 'no ve bien de lejos', -1, NULL, NULL, NULL, -1.5, NULL, NULL, NULL, NULL, NULL, 24.05, NULL, NULL, 24.25, '', '', 15, 0.5, NULL, NULL, 'NINGUNO', 'Miopía Simple | PPC Alejado', 17, 5, 42, 43, 42, 43);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK854vqe67dp3374wfnpe551adx` (`clinica_id`),
  ADD KEY `FK99g9ac17qqoafd9q94yybsx0e` (`optometrista_id`),
  ADD KEY `FKnqrsxxcuysfcxiekvixm7h8r1` (`paciente_id`);

--
-- Indices de la tabla `clinicas`
--
ALTER TABLE `clinicas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `cif` (`cif`);

--
-- Indices de la tabla `optometristas`
--
ALTER TABLE `optometristas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `clinica_id` (`clinica_id`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `clinica_id` (`clinica_id`);

--
-- Indices de la tabla `revisiones`
--
ALTER TABLE `revisiones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paciente_id` (`paciente_id`),
  ADD KEY `optometrista_id` (`optometrista_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `citas`
--
ALTER TABLE `citas`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `clinicas`
--
ALTER TABLE `clinicas`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `optometristas`
--
ALTER TABLE `optometristas`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `revisiones`
--
ALTER TABLE `revisiones`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `citas`
--
ALTER TABLE `citas`
  ADD CONSTRAINT `FK854vqe67dp3374wfnpe551adx` FOREIGN KEY (`clinica_id`) REFERENCES `clinicas` (`id`),
  ADD CONSTRAINT `FK99g9ac17qqoafd9q94yybsx0e` FOREIGN KEY (`optometrista_id`) REFERENCES `optometristas` (`id`),
  ADD CONSTRAINT `FKnqrsxxcuysfcxiekvixm7h8r1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`);

--
-- Filtros para la tabla `optometristas`
--
ALTER TABLE `optometristas`
  ADD CONSTRAINT `fk_optometrista_clinica` FOREIGN KEY (`clinica_id`) REFERENCES `clinicas` (`id`);

--
-- Filtros para la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD CONSTRAINT `fk_paciente_clinica` FOREIGN KEY (`clinica_id`) REFERENCES `clinicas` (`id`);

--
-- Filtros para la tabla `revisiones`
--
ALTER TABLE `revisiones`
  ADD CONSTRAINT `fk_revision_optometrista` FOREIGN KEY (`optometrista_id`) REFERENCES `optometristas` (`id`),
  ADD CONSTRAINT `fk_revision_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
