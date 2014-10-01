-- phpMyAdmin SQL Dump
-- version 4.2.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 01, 2014 at 06:50 PM
-- Server version: 5.5.38-0+wheezy1
-- PHP Version: 5.4.4-14+deb7u14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `newbabar`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE IF NOT EXISTS `customers` (
	`id` int(11) NOT NULL COMMENT 'ID du client',
	  `status_id` int(11) NOT NULL,
	  `firstname` varchar(255) NOT NULL,
	  `lastname` varchar(255) NOT NULL,
	  `nickname` varchar(255) NOT NULL,
	  `password` varchar(40) NOT NULL,
	  `email` varchar(255) NOT NULL
	) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COMMENT='Table des clients';

	--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `status_id`, `firstname`, `lastname`, `nickname`, `password`, `email`) VALUES
(1, 2, 'Jean', 'Marsault', 'Iansus', '123456', 'jean.iansus@gmail.com'),
(2, 3, 'Yves-Marie', 'Lefloch', 'yml', '654321', 'lefloch@enst.fr');

-- --------------------------------------------------------

--
-- Table structure for table `drinks`
--

CREATE TABLE IF NOT EXISTS `drinks` (
	`id` int(11) NOT NULL COMMENT 'ID du produit',
	  `brand` varchar(255) NOT NULL,
	  `name` varchar(255) NOT NULL,
	  `price` float NOT NULL
	) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8 COMMENT='Table des produits';

	-- --------------------------------------------------------

--
-- Table structure for table `entries`
--

CREATE TABLE IF NOT EXISTS `entries` (
	`id` int(11) NOT NULL COMMENT 'ID du paiement',
	  `customer_id` int(11) NOT NULL COMMENT 'ID du client',
	  `debitant_id` int(11) DEFAULT NULL,
	  `amount` float NOT NULL,
	  `date` int(11) NOT NULL COMMENT 'Date du paiement'
	) ENGINE=InnoDB AUTO_INCREMENT=12499 DEFAULT CHARSET=utf8 COMMENT='Table des paiements';

	-- --------------------------------------------------------

--
-- Table structure for table `sells`
--

CREATE TABLE IF NOT EXISTS `sells` (
	`id` int(11) NOT NULL COMMENT 'ID de la vente',
	  `customer_id` int(11) NOT NULL COMMENT 'ID du client',
	  `drink_id` int(11) DEFAULT NULL COMMENT 'ID du produit',
	  `quantity` int(11) NOT NULL COMMENT 'Quantité achetée',
	  `price` float NOT NULL COMMENT 'Prix',
	  `date` int(11) NOT NULL COMMENT 'Date de la vente'
	) ENGINE=InnoDB AUTO_INCREMENT=53826 DEFAULT CHARSET=utf8 COMMENT='Table des ventes';

	-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE IF NOT EXISTS `status` (
	`id` int(11) NOT NULL,
	  `name` varchar(20) NOT NULL COMMENT 'ID du status',
	  `overdraft` float NOT NULL COMMENT 'Découvert autorisé'
	) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='Table des status';

	--
-- Dumping data for table `status`
--

INSERT INTO `status` (`id`, `name`, `overdraft`) VALUES
(1, 'standard', 0),
(2, 'barman', -20),
(3, 'barman', -20);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
 ADD PRIMARY KEY (`id`), ADD KEY `status_id` (`status_id`);

--
-- Indexes for table `drinks`
--
ALTER TABLE `drinks`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `entries`
--
ALTER TABLE `entries`
 ADD PRIMARY KEY (`id`), ADD KEY `customer` (`customer_id`), ADD KEY `debitant` (`debitant_id`);

--
-- Indexes for table `sells`
--
ALTER TABLE `sells`
 ADD PRIMARY KEY (`id`), ADD KEY `drink` (`drink_id`), ADD KEY `customer` (`customer_id`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID du client',AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `drinks`
--
ALTER TABLE `drinks`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID du produit',AUTO_INCREMENT=129;
--
-- AUTO_INCREMENT for table `entries`
--
ALTER TABLE `entries`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID du paiement',AUTO_INCREMENT=12499;
--
-- AUTO_INCREMENT for table `sells`
--
ALTER TABLE `sells`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID de la vente',AUTO_INCREMENT=53826;
--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
ADD CONSTRAINT `customer_to_status` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `entries`
--
ALTER TABLE `entries`
ADD CONSTRAINT `entry_to_debitant` FOREIGN KEY (`debitant_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `entry_to_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `sells`
--
ALTER TABLE `sells`
ADD CONSTRAINT `sell_to_drink` FOREIGN KEY (`drink_id`) REFERENCES `drinks` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
ADD CONSTRAINT `sell_to_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

