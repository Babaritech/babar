-- phpMyAdmin SQL Dump
-- version 4.2.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 29, 2014 at 11:14 PM
-- Server version: 5.5.38-0+wheezy1
-- PHP Version: 5.4.4-14+deb7u14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `newbabar`
--

-- --------------------------------------------------------

--
-- Stand-in structure for view `balances`
--
CREATE TABLE IF NOT EXISTS `balances` (
`customer_id` int(11)
,`balance` decimal(38,2)
);
-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE IF NOT EXISTS `customers` (
`customer_id` int(11) NOT NULL COMMENT 'ID du client',
  `status_id` int(11) NOT NULL,
  `surname` varchar(30) NOT NULL COMMENT 'Prénom',
  `name` varchar(30) NOT NULL COMMENT 'Nom',
  `nickname` varchar(30) DEFAULT NULL COMMENT 'Surnom',
  `sex` varchar(1) NOT NULL DEFAULT 'M' COMMENT 'Sexe',
  `weight` decimal(5,2) NOT NULL DEFAULT '75.00' COMMENT 'Poids',
  `height` decimal(3,2) NOT NULL DEFAULT '1.75' COMMENT 'Taille',
  `picture` varchar(200) NOT NULL DEFAULT '../images/default.jpg' COMMENT 'Photo'
) ENGINE=InnoDB AUTO_INCREMENT=1076 DEFAULT CHARSET=utf8 COMMENT='Table des clients';

-- --------------------------------------------------------

--
-- Table structure for table `drinks`
--

CREATE TABLE IF NOT EXISTS `drinks` (
`drink_id` int(11) NOT NULL COMMENT 'ID du produit',
  `name` varchar(50) NOT NULL COMMENT 'Nom',
  `price` decimal(5,2) NOT NULL COMMENT 'Prix',
  `volume` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT 'Volume',
  `alcohol` decimal(3,1) NOT NULL DEFAULT '0.0' COMMENT 'Taux d''alcool',
  `hidden` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Vrai si produit supprimé'
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8 COMMENT='Table des produits';

-- --------------------------------------------------------

--
-- Table structure for table `entries`
--

CREATE TABLE IF NOT EXISTS `entries` (
`entry_id` int(11) NOT NULL COMMENT 'ID du paiement',
  `customer_id` int(11) NOT NULL COMMENT 'ID du client',
  `debitant_id` int(11) DEFAULT NULL,
  `amount` decimal(5,2) NOT NULL COMMENT 'Montant',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date du paiement'
) ENGINE=InnoDB AUTO_INCREMENT=12499 DEFAULT CHARSET=utf8 COMMENT='Table des paiements';

-- --------------------------------------------------------

--
-- Table structure for table `sells`
--

CREATE TABLE IF NOT EXISTS `sells` (
`sell_id` int(11) NOT NULL COMMENT 'ID de la vente',
  `customer_id` int(11) NOT NULL COMMENT 'ID du client',
  `drink_id` int(11) DEFAULT NULL COMMENT 'ID du produit',
  `quantity` int(11) NOT NULL COMMENT 'Quantité achetée',
  `price` decimal(5,2) NOT NULL COMMENT 'Prix',
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Date de la vente'
) ENGINE=InnoDB AUTO_INCREMENT=53826 DEFAULT CHARSET=utf8 COMMENT='Table des ventes';

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE IF NOT EXISTS `status` (
`status_id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL COMMENT 'ID du status',
  `overdraft` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT 'Découvert autorisé'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Table des status';

-- --------------------------------------------------------

--
-- Stand-in structure for view `total_entries`
--
CREATE TABLE IF NOT EXISTS `total_entries` (
`customer_id` int(11)
,`amount` decimal(27,2)
);
-- --------------------------------------------------------

--
-- Stand-in structure for view `total_sells`
--
CREATE TABLE IF NOT EXISTS `total_sells` (
`customer_id` int(11)
,`amount` decimal(37,2)
);
-- --------------------------------------------------------

--
-- Structure for view `balances`
--
DROP TABLE IF EXISTS `balances`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `balances` AS select `e`.`customer_id` AS `customer_id`,(ifnull(`e`.`amount`,0) - ifnull(`s`.`amount`,0)) AS `balance` from (`total_entries` `e` left join `total_sells` `s` on((`e`.`customer_id` = `s`.`customer_id`))) group by `e`.`customer_id`;

-- --------------------------------------------------------

--
-- Structure for view `total_entries`
--
DROP TABLE IF EXISTS `total_entries`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `total_entries` AS select `e`.`customer_id` AS `customer_id`,sum(ifnull(`e`.`amount`,0)) AS `amount` from `entries` `e` group by `e`.`customer_id`;

-- --------------------------------------------------------

--
-- Structure for view `total_sells`
--
DROP TABLE IF EXISTS `total_sells`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `total_sells` AS select `s`.`customer_id` AS `customer_id`,sum((ifnull(`s`.`quantity`,0) * ifnull(`s`.`price`,0))) AS `amount` from `sells` `s` group by `s`.`customer_id`;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
 ADD PRIMARY KEY (`customer_id`), ADD KEY `status_id` (`status_id`);

--
-- Indexes for table `drinks`
--
ALTER TABLE `drinks`
 ADD PRIMARY KEY (`drink_id`);

--
-- Indexes for table `entries`
--
ALTER TABLE `entries`
 ADD PRIMARY KEY (`entry_id`), ADD KEY `customer` (`customer_id`), ADD KEY `debitant` (`debitant_id`);

--
-- Indexes for table `sells`
--
ALTER TABLE `sells`
 ADD PRIMARY KEY (`sell_id`), ADD KEY `drink` (`drink_id`), ADD KEY `customer` (`customer_id`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
 ADD PRIMARY KEY (`status_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID du client',AUTO_INCREMENT=1076;
--
-- AUTO_INCREMENT for table `drinks`
--
ALTER TABLE `drinks`
MODIFY `drink_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID du produit',AUTO_INCREMENT=129;
--
-- AUTO_INCREMENT for table `entries`
--
ALTER TABLE `entries`
MODIFY `entry_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID du paiement',AUTO_INCREMENT=12499;
--
-- AUTO_INCREMENT for table `sells`
--
ALTER TABLE `sells`
MODIFY `sell_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID de la vente',AUTO_INCREMENT=53826;
--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
ADD CONSTRAINT `status_link` FOREIGN KEY (`status_id`) REFERENCES `status` (`status_id`) ON UPDATE CASCADE;

--
-- Constraints for table `entries`
--
ALTER TABLE `entries`
ADD CONSTRAINT `debitant_link` FOREIGN KEY (`debitant_id`) REFERENCES `customers` (`customer_id`) ON DELETE SET NULL ON UPDATE CASCADE,
ADD CONSTRAINT `customer_link` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `sells`
--
ALTER TABLE `sells`
ADD CONSTRAINT `customer_link2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
ADD CONSTRAINT `drink_link` FOREIGN KEY (`drink_id`) REFERENCES `drinks` (`drink_id`) ON DELETE SET NULL ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
