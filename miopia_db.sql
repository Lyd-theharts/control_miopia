-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 11-02-2026 a las 20:39:31
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
(2, 'B222222', NULL, 'Mi Optica Real', '$2a$10$7efRinhg7by0JmRNlj7hr.MNJgAcz5oqDaHpqqvS6fCLcY6emX4li', NULL, 'optica2');

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
(3, 'Ana Ortoqueratología', 'COL-33445', 2);

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
(10, 'Martínez Progresión', NULL, '2023-01-10', '2017-05-15', 'Sofía', NULL, 'F', NULL, 2),
(11, 'López Convergencia', NULL, '2023-02-01', '2015-08-20', 'Hugo', NULL, 'M', NULL, 2),
(12, 'Ruiz Acomodación', NULL, '2023-03-15', '2014-03-10', 'Carla', NULL, 'F', NULL, 2),
(13, 'Gómez Estable', NULL, '2023-06-01', '2016-01-20', 'Pedro', NULL, 'M', NULL, 2),
(14, 'Magna Fuerte', NULL, '2022-01-15', '2012-09-10', 'Luis', NULL, 'M', NULL, 2),
(15, 'Cilindro Alto', NULL, '2023-03-20', '2015-12-05', 'Marta', NULL, 'F', NULL, 2),
(17, 'Test Sin Ignore', NULL, '2024-02-09', '2018-05-20', 'Borja jose', 'Tutor', 'M', '600000000', 2);

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
(1, '2023-05-15', 'Primera visita.', -1, 0, 0, 1, NULL, NULL, NULL, NULL, 43, 43.5, 23.5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'NORMAL', 10, 1, NULL, NULL, NULL, NULL),
(2, '2023-11-20', 'Revisión control.', -1.75, -0.5, 180, 1, NULL, NULL, NULL, NULL, 43, 43.5, 23.9, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ALERTA: Crecimiento Axial Rápido', 10, 1, NULL, NULL, NULL, NULL),
(3, '2024-05-20', 'Cambio urgente.', -2.5, -0.5, 180, 1, NULL, NULL, NULL, NULL, 43, 43.5, 24.3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'GAFAS_MIYOSMART', 'ALERTA: Riesgo Alto Miopía Magna', 10, 1, NULL, NULL, NULL, NULL),
(4, '2024-02-10', 'Problemas leer.', 0.5, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Orto', '10 Exo', 18, 0.5, NULL, 60, NULL, 'Posible Insuficiencia', 11, 1, NULL, NULL, NULL, NULL),
(5, '2024-04-05', 'Dolor cabeza.', -0.75, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2 Endo', 6, -0.5, NULL, NULL, NULL, 'Sospecha Exceso', 12, 1, NULL, NULL, NULL, NULL),
(6, '2024-11-20', 'Revisión de control tras 6 meses con Miyosmart.', -2.5, -0.5, 180, 1, NULL, NULL, NULL, NULL, 43, 43.5, 24.35, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'GAFAS_MIYOSMART', 'Miopía Estabilizada', 10, 2, NULL, NULL, NULL, NULL),
(7, '2023-06-01', 'Primera visita.', -0.5, NULL, NULL, 1, NULL, NULL, NULL, NULL, 42, 42.5, 23.1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'NORMAL', 13, 2, NULL, NULL, NULL, NULL),
(8, '2024-06-01', 'Revisión anual.', -0.75, NULL, NULL, 1, NULL, NULL, NULL, NULL, 42, 42.5, 23.2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'NORMAL', 13, 2, NULL, NULL, NULL, NULL),
(9, '2024-05-15', 'Mejoría en lectura tras ejercicios.', 0.5, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Orto', '6 Exo', 10, 0.5, NULL, 40, NULL, 'Mejoría Binocular', 11, 1, NULL, NULL, NULL, NULL),
(10, '2022-02-01', 'Primera visita. Miopía alta familiar.', -6, -0.5, 180, 0.8, NULL, NULL, NULL, NULL, 43, 43.5, 26.1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'NINGUNO', 'ALERTA: Miopía Magna', 14, 3, NULL, NULL, NULL, NULL),
(11, '2023-02-01', 'Revisión anual. Empeoramiento notable.', -6.75, -0.75, 175, 0.9, NULL, NULL, NULL, NULL, 43, 43.5, 26.5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ATROPINA_001', 'ALERTA: Progresión Rápida', 14, 3, NULL, NULL, NULL, NULL),
(12, '2024-02-01', 'Control Atropina. Estable.', -6.75, -0.75, 175, 1, NULL, NULL, NULL, NULL, 43, 43.5, 26.55, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'ATROPINA_001', 'Miopía Estabilizada', 14, 3, NULL, NULL, NULL, NULL),
(13, '2024-01-15', 'Ve mal de lejos y cerca.', 0.5, -3.5, 180, 0.7, NULL, NULL, NULL, NULL, 41, 45, 23, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Astigmatismo Alto', 15, 1, NULL, NULL, NULL, NULL),
(14, '2024-06-15', 'Ya no tiene dolor de cabeza.', -0.75, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Orto', 8, 0.5, NULL, NULL, NULL, 'Visualmente Eficaz', 12, 1, NULL, NULL, NULL, NULL),
(17, '2024-02-10', 'Prueba de error corregido modif.', 0, NULL, NULL, 1, 0, NULL, NULL, 1, NULL, NULL, 23, NULL, NULL, 23, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 10, 1, 43, 43.5, 43, 43.5),
(18, '2024-02-10', 'CORRECCIÓN: Error al introducir datos. Se observa miopía magna.', -7, NULL, NULL, 0.6, -7, NULL, NULL, 0.6, NULL, NULL, 26.5, NULL, NULL, 26.5, NULL, NULL, NULL, NULL, NULL, NULL, 'ATROPINA_005', NULL, 10, 1, 43, 43.5, 43, 43.5),
(20, '2024-02-10', ' Se observa miopía magna.', -8, NULL, NULL, 0.6, -7, NULL, NULL, 0.6, NULL, NULL, 26.5, NULL, NULL, 26.5, NULL, NULL, NULL, NULL, NULL, NULL, 'ATROPINA_005', '⚠️ ALERTA: Miopía Magna (Alto Riesgo Patológico) | ⚠️ Riesgo Maculopatía (LA > 26mm)', 10, 1, 43, 43.5, 43, 43.5),
(21, '2024-02-10', ' Se observa miopía magna.', -8, NULL, NULL, 0.6, -7, NULL, NULL, 0.6, NULL, NULL, 26.5, NULL, NULL, 26.5, NULL, NULL, NULL, NULL, NULL, NULL, 'ATROPINA_005', '⚠️ ALERTA: Miopía Magna (Alto Riesgo Patológico) | ⚠️ Riesgo Maculopatía (LA > 26mm)', 10, 1, 43, 43.5, 43, 43.5);

--
-- Índices para tablas volcadas
--

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
-- AUTO_INCREMENT de la tabla `clinicas`
--
ALTER TABLE `clinicas`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `optometristas`
--
ALTER TABLE `optometristas`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `revisiones`
--
ALTER TABLE `revisiones`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Restricciones para tablas volcadas
--

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
