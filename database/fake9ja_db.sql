-- Fake9ja MySQL Database Dump for phpMyAdmin
-- Generated on 2026-09-28 22:56:09
-- Host: 127.0.0.1:3306
-- Database: fake9ja_db

CREATE DATABASE IF NOT EXISTS `fake9ja_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `fake9ja_db`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `reference_id` varchar(32) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `category` varchar(64) NOT NULL,
  `state` varchar(64) NOT NULL,
  `market_address` varchar(255) NOT NULL,
  `issue_type` varchar(255) NOT NULL,
  `details` text DEFAULT NULL,
  `purchase_price` varchar(64) DEFAULT NULL,
  `reporter_contact` varchar(255) DEFAULT NULL,
  `is_anonymous` tinyint(1) NOT NULL DEFAULT 1,
  `status` varchar(32) NOT NULL DEFAULT 'received',
  `risk_level` varchar(16) NOT NULL DEFAULT 'medium',
  `is_priority` tinyint(1) NOT NULL DEFAULT 0,
  `reviewer_note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reports_reference_id_unique` (`reference_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `reports` VALUES 
('1', 'EIE-NG-248193', 'Amatem Forte Softgel / Tablets', 'Amatem', 'Medicines', 'Kano', 'Sabon Gari Market, Kano', 'Fake NAFDAC & Blurred Batch Code', 'Purchased blister pack with missing hologram seal and unverifiable scratch PIN.', '₦2,400', NULL, '1', 'verified_fake', 'high', '1', 'Confirmed clone batch. Chemical inspection confirmed adulterated active pharmaceutical ingredient (API).', '2026-09-25 14:07:00', '2026-09-25 14:07:00'),
('2', 'EIE-NG-248192', 'FloraPure Radiance Body Lotion', 'FloraPure', 'Cosmetics', 'Lagos', 'Balogun Market, Lagos Island', 'Tampered Cap & Chemical Odour', 'The inner seal looked re-glued with hot glue and caused severe rash after one test patch.', '₦4,800', NULL, '1', 'under_review', 'medium', '0', 'Sample collected for pH and mercury screening.', '2026-09-25 14:07:00', '2026-09-25 14:07:00'),
('3', 'EIE-NG-248191', 'Total Quartz 9000 Engine Oil (5L)', 'TotalEnergies', 'Automotive', 'Lagos', 'Ladipo Auto Spare Parts Market, Mushin', 'Cloned QR Code & Thin Viscosity', 'QR code redirected to a deceptive lookalike website instead of totalenergies.ng.', '₦22,000', 'auto-mech@lagos.ng', '0', 'verified_fake', 'high', '1', 'Recycled motor oil packaged in counterfeit branded plastic containers.', '2026-09-25 14:07:00', '2026-09-25 14:07:00'),
('4', 'EIE-NG-248190', 'Golden Penny Semovita 10kg', 'Golden Penny', 'Food & drinks', 'FCT Abuja', 'Wuse Market, Abuja', 'Discolored Grains & Chalky Smell', 'Bag stitching was single-thread instead of standard factory twin-stitch.', '₦7,200', NULL, '1', 'received', 'low', '0', NULL, '2026-09-25 14:07:00', '2026-09-25 14:07:00'),
('5', 'EIE-NG-248189', 'Oraimo 20000mAh Power Bank', 'Oraimo', 'Electronics', 'Lagos', 'Computer Village, Ikeja', 'Counterfeit Hologram & Overheating', 'Weighed 140g less than original unit and battery swelled on initial charge.', '₦14,500', 'ikeja-shopper@gmail.com', '0', 'under_review', 'medium', '0', 'Serial number matched duplicate sequence flagged in Ikeja.', '2026-09-25 14:07:00', '2026-09-25 14:07:00'),
('6', 'EIE-NG-248188', 'Hollandia Evaporated Milk (Carton)', 'CHI Limited', 'Food & drinks', 'Rivers', 'Mile 3 Market, Port Harcourt', 'Altered Expiry Stamp', 'Expiry date had double laser printing over faded original 2024 date.', '₦16,000', NULL, '1', 'received', 'low', '0', NULL, '2026-09-25 14:07:00', '2026-09-25 14:07:00'),
('7', 'EIE-NG-841730', 'Cloned Panadol Extra 500mg', 'GSK Cloned', 'Pharmaceuticals & Drugs', 'Kano', 'Sabon Gari Medicine Market, Block C', 'Missing NAFDAC Green Scratch-and-Pin (MAS) code', 'Purchased 2 packs. Tablets are soft and crumble on light touch. No batch date stamped.', '₦1,200', 'citizen.kano@gmail.com', '0', 'received', 'high', '1', NULL, '2026-09-25 14:55:04', '2026-09-25 14:55:04'),
('8', 'EIE-NG-506988', 'Sprite', 'Coca-Cola', 'Packaged Foods & Drinks', 'Rivers', 'No NAFDAC / SONCAP Number', 'Lorem Ipsume', '#500', NULL, '1', 'under_review', 'high', '1', 'Advanced to Stage 2 (Forensic Triage): Active forensic triage underway. Suspected printing and chemical variances under analysis.', '2026-09-27 01:10:06', '2026-09-27 12:08:06'),
('9', 'EIE-NG-567637', 'Idumota Panadol', NULL, 'Medicines', 'Lagos', 'Idumota Drug Market', 'Counterfeit Foil Packaging', NULL, 'N1800', NULL, '1', 'escalated', 'high', '0', 'High public health hazard flagged. Forwarded to regulatory desk.', '2026-09-27 01:29:09', '2026-09-27 02:21:21'),
('10', 'EIE-NG-924436', 'Cosmetics & Skincare', NULL, 'Cosmetics & Skincare', 'Lagos', 'Alaba International Market, Ojo', 'Suspected Counterfeit / Price Discrepancy', NULL, '4500', NULL, '1', 'under_review', 'medium', '0', 'Transferred to active forensic examination queue.', '2026-09-27 01:29:28', '2026-09-27 12:53:35');

DROP TABLE IF EXISTS `report_media`;
CREATE TABLE `report_media` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `report_id` bigint(20) unsigned NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(16) NOT NULL DEFAULT 'image',
  `file_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `report_media_report_id_foreign` (`report_id`),
  CONSTRAINT `report_media_report_id_foreign` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `report_media` VALUES 
('1', '8', 'evidence/weVtrKybAyeZbZBbQDaslkLEOQWWbmsh4cWg2MTL.png', 'image', 'pass_certificate.png', '2026-09-27 01:10:06', '2026-09-27 01:10:06'),
('2', '8', 'evidence/f3yx7bcX0szl02sdNfxeNaFD9KTvGNHQBgxtqTPY.png', 'image', 'win-loss-card (3).png', '2026-09-27 01:10:06', '2026-09-27 01:10:06');

DROP TABLE IF EXISTS `brand_watches`;
CREATE TABLE `brand_watches` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(255) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `monitored_skus` varchar(255) DEFAULT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `brand_watches` VALUES 
('1', 'Amatem Pharmaceuticals', 'Amatem Health Nigeria Ltd', 'compliance@amatem.ng', '08021234567', 'Amatem Softgel, Amatem Forte, Amatem Susp.', 'active', '2026-09-25 14:07:00', '2026-09-25 14:07:00');

DROP TABLE IF EXISTS `market_hotspots`;
CREATE TABLE `market_hotspots` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `state` varchar(64) NOT NULL,
  `incident_count` int(11) NOT NULL DEFAULT 0,
  `risk_level` varchar(16) NOT NULL DEFAULT 'medium',
  `trend` varchar(16) NOT NULL DEFAULT 'up',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `market_hotspots` VALUES 
('1', 'Balogun Market, Lagos Island', 'Lagos', '184', 'high', 'up', '2026-09-25 14:07:00', '2026-09-25 14:07:00'),
('2', 'Sabon Gari Market, Kano', 'Kano', '142', 'high', 'up', '2026-09-25 14:07:00', '2026-09-25 14:07:00'),
('3', 'Computer Village, Ikeja', 'Lagos', '119', 'medium', 'stable', '2026-09-25 14:07:00', '2026-09-25 14:07:00'),
('4', 'Ariaria International Market, Aba', 'Abia', '97', 'high', 'up', '2026-09-25 14:07:00', '2026-09-25 14:07:00'),
('5', 'Onitsha Main Market', 'Anambra', '163', 'high', 'up', '2026-09-25 14:07:00', '2026-09-25 14:07:00'),
('6', 'Wuse Market, Abuja', 'FCT Abuja', '68', 'medium', 'down', '2026-09-25 14:07:00', '2026-09-25 14:07:00'),
('7', 'Ladipo Auto Spare Parts Market', 'Lagos', '88', 'high', 'up', '2026-09-25 14:07:00', '2026-09-25 14:07:00'),
('8', 'Mile 3 Market, Port Harcourt', 'Rivers', '52', 'medium', 'stable', '2026-09-25 14:07:00', '2026-09-25 14:07:00');

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `migrations` VALUES 
('1', '0001_01_01_000000_create_users_table', '1'),
('2', '0001_01_01_000001_create_cache_table', '1'),
('3', '0001_01_01_000002_create_jobs_table', '1'),
('4', '2026_09_25_000001_create_fake9ja_tables', '1');

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `sessions` VALUES 
('1jOPUKkjJuMzcyETVhQUmiNUPYIsafZoquwQlh0w', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQTBQZlNsc3I0RjJDZGFvYTh2UEZRMWlsaVVDT0xzTkxFSm5NdW5LSSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', '1790348125'),
('4OnA4YhxeUoj3GDIoL43vzqauxFf7YMm6deg8pSR', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoidFdnbGMwUlNRcUNjOGk2d0dndTFKVDNocUh3MnhJQ2tWZW5tOE9FeSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', '1790347906'),
('5syGXte1XvPlH8I6J7BDQcLQ0Igajx16NOyqj7nN', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiU2x0a1g3S1EyYWRtVmM4WG1HZFFRMGtjNkVHTFJweUhBR2RWNElUcSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', '1790347896'),
('9dLDvjib7EFQDFNTqJogzlvrvVPyCxpiQl0BuA1y', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib2NNSlNCTnlCQlZVRWo1T3UzTUlVUmxaWVcydGk5U2FDNWtPSEw2YyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDU6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS90cmFjaz9yZWY9RUlFLU5HLTg0MTczMCI7czo1OiJyb3V0ZSI7czoxMToidHJhY2suaW5kZXgiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', '1790348126'),
('AHRuv2dGn2kdGgo8qfTiW4hfMvdAW8chk5ggXfiZ', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiejRVajh2NVJVUFZXZ2RlV1FtQ0F5d1d2cU9UdVhOR0ZjczBTbXYzVCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', '1790347821'),
('C57DRuuZ7pdWMv9PMI3pJsOkRNmIEov4Bb4anLtt', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib0hFcHB4UkJ4S1FDbG5McHJDWVdVM3B1SEpDcVl5cG04bFJXSU0yZCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9hZG1pbiI7czo1OiJyb3V0ZSI7czoxMToiYWRtaW4uaW5kZXgiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', '1790347906'),
('caOYB5xdG9aq7wA4Abiz6Hr6RziDi2jL8k0l15rZ', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQ2g2SW94ZExJOW9ZNmdpbXFGYmk3OTQ3aEU1VGdGZ3hHcDFzZGRVcSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzg6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9icmFuZC1wcm90ZWN0aW9uIjtzOjU6InJvdXRlIjtzOjIyOiJicmFuZC1wcm90ZWN0aW9uLmluZGV4Ijt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', '1790347896'),
('efYOz0bx0xbbMvlRIvPHqP5dnnrP3jZZLkUIa2vi', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiSHcyTjFEZ3poRzBCOGZNRU5zckZOUXJnWVVtVG56VlZxcEpaOGpjYyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS90cmFjayI7czo1OiJyb3V0ZSI7czoxMToidHJhY2suaW5kZXgiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', '1790347876'),
('grCiln2OyM8mYTb73XYi5iIVytPYMYNoKGTyF2i0', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiaVdpckVaWWNsSUcwS2UxRWp4U2h4UEhiMGI5clhTeWdJMzZpQU1PbyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMSI7czo1OiJyb3V0ZSI7czo0OiJob21lIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', '1790347796'),
('MyMspquWCwqCs6vBbntbRiR13PdPqIvGwTKF38RQ', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidjlRQUJaSjY3TURmck9lU1ZwWW9DUUtvMjRHYkt0azZEaUt6U08xaCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9jb21tdW5pdHkiO3M6NToicm91dGUiO3M6MTU6ImNvbW11bml0eS5pbmRleCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', '1790347855'),
('n8BZ1dRC4LaOT8NuQXZBHbcxkfMR3wXboNKiz53b', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiQmRGZVlCZVhTdE42eTZYa2NMSHFBWEVWdmFVZ3pGZmRmN3NrbmxPYiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', '1790347795'),
('oXpGolN0Od6dkHQsiH1ldrHEt5PEW5xx9KGj1keE', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36 Edg/153.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiM1pnVVBxakxMVGFJQVpBeVkyeGM1dDRMYW5SamFZN2NYNHFRdmhuQiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7czo0OiJob21lIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', '1790470617'),
('Pqxxdpct1eUMsNygSIcf66QFOMh9l3Fv6kmYBBYc', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWFBkcTBqSWUwNDEycG9WNW9SSHRQOXV1ZnhFV2s0WERIRUdYSXFTcyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjg6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMS9yZXBvcnQiO3M6NToicm91dGUiO3M6MTM6InJlcG9ydC5jcmVhdGUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', '1790347822'),
('TV86ed6udoKRzDbdHNaMyJoEbpk4gDLVxRFx6xQL', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36 Edg/153.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMXNRYlNpNU9BWDZuMldTTGtVSGlWT2dsUjZKaFRaMGdqWnlZWjU1VSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7czo1OiJyb3V0ZSI7czo0OiJob21lIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', '1790348274'),
('tvz9vS6cpYzP4RwPDqYqingHOuzcIDds2FtWAqxQ', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoiTGpmaXV4NHFFclZ0YUxqTUR2MzlScm9JZGdvbUozYVVQSTFFWFFocCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', '1790347855'),
('uFjXTo7HIoA3n5a1HP6CbpTvCPSAZd6xkI7YewWW', NULL, '127.0.0.1', 'Go-http-client/1.1', 'YToyOntzOjY6Il90b2tlbiI7czo0MDoibEIySHl4YUk5VTFzRE1TRmpJSElhSUZza1MycWZjWnRHVWVHZk9IciI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', '1790347876');

DROP TABLE IF EXISTS `cache`;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
