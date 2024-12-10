-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 30-11-2024 a las 13:49:51
-- Versión del servidor: 8.0.40-0ubuntu0.22.04.1
-- Versión de PHP: 8.1.2-1ubuntu2.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `streamsonic`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `active_sessions`
--

CREATE TABLE `active_sessions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `device_info` varchar(255) DEFAULT NULL,
  `session_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `active_sessions`
--

INSERT INTO `active_sessions` (`id`, `user_id`, `device_info`, `session_token`, `created_at`) VALUES
(31, 7, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiaWF0IjoxNzMyOTU4ODU0fQ.eQYnIrNyMfVaBCTK-RtRF3UeZPrP9j-mKvSb9YKVFeQ', '2024-11-30 09:27:34'),
(35, 8, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzMyOTcwNzAxfQ.AD8sS2NrVaFVFvNkyye4ZwzSKqzZVkfcjqOXOGE9-dE', '2024-11-30 12:45:01'),
(36, 9, NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiaWF0IjoxNzMyOTczOTA3fQ.Mxas3OLWMYCAnE1Eb3Qj1vsQjv8Y2WKI-C06nAYTZmE', '2024-11-30 13:38:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `channels`
--

CREATE TABLE `channels` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `video_url` text NOT NULL,
  `logo_url` text NOT NULL,
  `category` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `location` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `channels`
--

INSERT INTO `channels` (`id`, `name`, `video_url`, `logo_url`, `category`, `location`, `created_at`, `updated_at`) VALUES
(5, 'Canal 9 Televida', 'https://unlimited1-buenosaires.dps.live/televidaar/televidaar.smil/televidaar/livestream3/chunks.m3u8', 'https://i.imgur.com/JUtAzg4.png', 'Mendoza', 'Mendoza', '2024-11-24 02:06:55', '2024-11-24 02:07:14'),
(6, 'Kingdom Tv', 'https://play.nexolife.com:443/mendozaTV/7b7a53e239400a13bd6be6c91c4f6c4e.sdp/chunks.m3u8', 'https://www.hectorbonarrico.com/wp-content/uploads/2020/06/gg-1.png', 'Religión', 'Mendoza', '2024-11-24 02:09:36', '2024-11-24 02:09:36');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `radios`
--

CREATE TABLE `radios` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `logo_url` varchar(255) NOT NULL,
  `stream_url` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `radios`
--

INSERT INTO `radios` (`id`, `name`, `logo_url`, `stream_url`, `category`, `location`) VALUES
(2, 'Fm Television Alternativa', 'https://i.ibb.co/Qd6tcHf/istockphoto-1472060253-612x612.jpg', 'http://stream.zeno.fm/b6428upqws8uv', 'Entretenimiento', 'Mendoza'),
(3, 'Del sol retro', 'https://static-media.streema.com/media/cache/43/cc/43cca63d514c17a583a7b7833a20942d.jpg', 'https://streamserver-1.xyz/listen/del_sol_retro/radio.aac?1714659982737', 'Entretenimiento', 'Mendoza'),
(4, 'Del sol lentos', 'https://static-media.streema.com/media/cache/43/cc/43cca63d514c17a583a7b7833a20942d.jpg', 'https://streamserver-1.xyz/listen/del_sol_lentos/radio.aac?1732459787380', 'Música', 'Mendoza');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `user` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `zipcode` varchar(20) DEFAULT NULL,
  `sessions` int DEFAULT '3'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `user`, `name`, `pass`, `email`, `phone`, `department`, `address`, `province`, `zipcode`, `sessions`) VALUES
(7, 'lautaro', 'Lautaro Ledesma', '$2a$08$VbPsEncYZDOGKxAe5MDPWO7wWbJ1NbztcjL/A1DtzjvbHGHzoilom', 'lautaroledesma2021@gmail.com', '2634723533', 'Santa Rosa', 'ruta 50 km 998', 'Mendoza', '5596', 3),
(8, 'admin', 'admin', '$2a$08$3vESDcaSD4Iw0Zb5xUF9dumOBPxIKc87twI4AiIZ3kgKh0ANweA/G', 'admin@admin.com', '1234', 'Santa Rosa', '1234', 'Mendoza', '5596', 1),
(9, 'demo', 'Lautaro Ledesma', '$2a$08$kkqB0c4jvfNrTEBp9lTkl.gzV9uep1Bn0W44Vfy5xA7fZfjKG1svC', 'lautaroledesma2021@gmail.com', '2634723533', 'Santa Rosa', 'ruta 50 km 998', 'Mendoza', '5596', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `active_sessions`
--
ALTER TABLE `active_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `channels`
--
ALTER TABLE `channels`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `radios`
--
ALTER TABLE `radios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `active_sessions`
--
ALTER TABLE `active_sessions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT de la tabla `channels`
--
ALTER TABLE `channels`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `radios`
--
ALTER TABLE `radios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `active_sessions`
--
ALTER TABLE `active_sessions`
  ADD CONSTRAINT `active_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
