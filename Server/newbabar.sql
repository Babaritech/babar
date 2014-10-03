-- phpMyAdmin SQL Dump
-- version 4.2.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 03, 2014 at 03:38 PM
-- Server version: 5.5.38-0+wheezy1
-- PHP Version: 5.4.4-14+deb7u14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `newbabar`
--

-- --------------------------------------------------------

--
-- Table structure for table `actions`
--

CREATE TABLE IF NOT EXISTS `actions` (
`id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Stand-in structure for view `balances`
--
CREATE TABLE IF NOT EXISTS `balances` (
`customer_id` int(11)
,`balance` double(19,2)
);
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COMMENT='Table des clients';

-- --------------------------------------------------------

--
-- Stand-in structure for view `customer_entries`
--
CREATE TABLE IF NOT EXISTS `customer_entries` (
`customer_id` int(11)
,`amount` float(5,2)
);
-- --------------------------------------------------------

--
-- Stand-in structure for view `customer_sells`
--
CREATE TABLE IF NOT EXISTS `customer_sells` (
`customer_id` int(11)
,`amount` double(19,2)
);
-- --------------------------------------------------------

--
-- Table structure for table `drinks`
--

CREATE TABLE IF NOT EXISTS `drinks` (
`id` int(11) NOT NULL COMMENT 'ID du produit',
  `brand` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` float NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=130 DEFAULT CHARSET=utf8 COMMENT='Table des produits';

-- --------------------------------------------------------

--
-- Stand-in structure for view `effective_rights`
--
CREATE TABLE IF NOT EXISTS `effective_rights` (
`action_name` varchar(255)
,`status_name` varchar(20)
,`right` enum('allow','deny')
);
-- --------------------------------------------------------

--
-- Table structure for table `entries`
--

CREATE TABLE IF NOT EXISTS `entries` (
`id` int(11) NOT NULL COMMENT 'ID du paiement',
  `customer_id` int(11) NOT NULL COMMENT 'ID du client',
  `debitant_id` int(11) DEFAULT NULL,
  `amount` float(5,2) NOT NULL,
  `date` varchar(30) NOT NULL COMMENT 'Date du paiement'
) ENGINE=InnoDB AUTO_INCREMENT=12502 DEFAULT CHARSET=utf8 COMMENT='Table des paiements';

-- --------------------------------------------------------

--
-- Table structure for table `rights`
--

CREATE TABLE IF NOT EXISTS `rights` (
`id` int(11) NOT NULL,
  `action_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `right` enum('allow','deny') NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `sells`
--

CREATE TABLE IF NOT EXISTS `sells` (
`id` int(11) NOT NULL COMMENT 'ID de la vente',
  `customer_id` int(11) NOT NULL COMMENT 'ID du client',
  `drink_id` int(11) DEFAULT NULL COMMENT 'ID du produit',
  `quantity` int(11) NOT NULL COMMENT 'Quantité achetée',
  `price` float(5,2) NOT NULL COMMENT 'Prix',
  `date` varchar(30) NOT NULL COMMENT 'Date de la vente'
) ENGINE=InnoDB AUTO_INCREMENT=53828 DEFAULT CHARSET=utf8 COMMENT='Table des ventes';

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE IF NOT EXISTS `status` (
`id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL COMMENT 'ID du status',
  `overdraft` float NOT NULL COMMENT 'Découvert autorisé'
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='Table des status';

-- --------------------------------------------------------

--
-- Stand-in structure for view `total_entries`
--
CREATE TABLE IF NOT EXISTS `total_entries` (
`customer_id` int(11)
,`total` double(19,2)
);
-- --------------------------------------------------------

--
-- Stand-in structure for view `total_sells`
--
CREATE TABLE IF NOT EXISTS `total_sells` (
`customer_id` int(11)
,`total` double(19,2)
);
-- --------------------------------------------------------

--
-- Structure for view `balances`
--
DROP TABLE IF EXISTS `balances`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `balances` AS select `e`.`customer_id` AS `customer_id`,(`e`.`total` - `s`.`total`) AS `balance` from (`total_entries` `e` left join `total_sells` `s` on((`e`.`customer_id` = `s`.`customer_id`)));

-- --------------------------------------------------------

--
-- Structure for view `customer_entries`
--
DROP TABLE IF EXISTS `customer_entries`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `customer_entries` AS select `c`.`id` AS `customer_id`,`e`.`amount` AS `amount` from (`customers` `c` left join `entries` `e` on((`c`.`id` = `e`.`customer_id`)));

-- --------------------------------------------------------

--
-- Structure for view `customer_sells`
--
DROP TABLE IF EXISTS `customer_sells`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `customer_sells` AS select `c`.`id` AS `customer_id`,(`s`.`quantity` * `s`.`price`) AS `amount` from (`customers` `c` left join `sells` `s` on((`c`.`id` = `s`.`customer_id`)));

-- --------------------------------------------------------

--
-- Structure for view `effective_rights`
--
DROP TABLE IF EXISTS `effective_rights`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `effective_rights` AS select `a`.`name` AS `action_name`,`s`.`name` AS `status_name`,`r`.`right` AS `right` from ((`actions` `a` join `rights` `r`) join `status` `s`) where ((`a`.`id` = `r`.`action_id`) and (`s`.`id` = `r`.`status_id`)) order by `a`.`name`,`s`.`name`;

-- --------------------------------------------------------

--
-- Structure for view `total_entries`
--
DROP TABLE IF EXISTS `total_entries`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `total_entries` AS select `customer_entries`.`customer_id` AS `customer_id`,sum(ifnull(`customer_entries`.`amount`,0)) AS `total` from `customer_entries` group by `customer_entries`.`customer_id`;

-- --------------------------------------------------------

--
-- Structure for view `total_sells`
--
DROP TABLE IF EXISTS `total_sells`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `total_sells` AS select `customer_sells`.`customer_id` AS `customer_id`,sum(ifnull(`customer_sells`.`amount`,0)) AS `total` from `customer_sells` group by `customer_sells`.`customer_id`;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `actions`
--
ALTER TABLE `actions`
 ADD PRIMARY KEY (`id`);

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
-- Indexes for table `rights`
--
ALTER TABLE `rights`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `action` (`action_id`), ADD UNIQUE KEY `status` (`status_id`);

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
-- AUTO_INCREMENT for table `actions`
--
ALTER TABLE `actions`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=48;
--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID du client',AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `drinks`
--
ALTER TABLE `drinks`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID du produit',AUTO_INCREMENT=130;
--
-- AUTO_INCREMENT for table `entries`
--
ALTER TABLE `entries`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID du paiement',AUTO_INCREMENT=12502;
--
-- AUTO_INCREMENT for table `rights`
--
ALTER TABLE `rights`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `sells`
--
ALTER TABLE `sells`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID de la vente',AUTO_INCREMENT=53828;
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
ADD CONSTRAINT `entry_to_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
ADD CONSTRAINT `entry_to_debitant` FOREIGN KEY (`debitant_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `rights`
--
ALTER TABLE `rights`
ADD CONSTRAINT `rights_to_status` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `rights_to_action` FOREIGN KEY (`action_id`) REFERENCES `actions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sells`
--
ALTER TABLE `sells`
ADD CONSTRAINT `sell_to_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
ADD CONSTRAINT `sell_to_drink` FOREIGN KEY (`drink_id`) REFERENCES `drinks` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

