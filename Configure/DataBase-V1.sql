-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 06, 2023 at 04:08 AM
-- Server version: 10.4.16-MariaDB
-- PHP Version: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `srj`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(100) NOT NULL,
  `admin_id` int(20) NOT NULL,
  `admin_name` varchar(50) NOT NULL,
  `admin_email` varchar(100) NOT NULL,
  `admin_password` varchar(50) NOT NULL,
  `admin_role` varchar(20) NOT NULL,
  `admin_key` varchar(20) NOT NULL,
  `admin_status` int(20) NOT NULL,
  `admin_ifdeleted` int(20) NOT NULL,
  `created` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `admin_id`, `admin_name`, `admin_email`, `admin_password`, `admin_role`, `admin_key`, `admin_status`, `admin_ifdeleted`, `created`, `updated`) VALUES
(1, 39496743, 'kalyan', 'kalyan@gmail.com', '3120', 'admin', '0', 0, 0, '2023-04-30 22:19:34', '2023-04-30 22:19:34'),
(2, 88330433, 'kd', 'kd@gmail.com', '1234', 'superAdmin', '0', 0, 0, '2023-04-30 22:20:30', '2023-05-01 03:31:30'),
(6, 64780846, 'kn', 'kn@gmail.com', '123456', 'admin', 'a25AZ21haWwuY29t', 0, 0, '2023-05-02 03:17:58', '2023-05-02 03:17:58');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(100) NOT NULL,
  `user_id` int(50) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_mobile` varchar(50) NOT NULL,
  `user_address` text NOT NULL,
  `user_status` int(20) NOT NULL,
  `user_ifdeleted` int(20) NOT NULL,
  `created` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `expanses`
--

CREATE TABLE `expanses` (
  `id` int(100) NOT NULL,
  `expanse_id` int(50) NOT NULL,
  `expanse_by_name` varchar(150) NOT NULL,
  `expanse_by_mobile_no` varchar(50) NOT NULL,
  `expanse_type` varchar(50) NOT NULL,
  `expanse_amount` decimal(20,2) NOT NULL,
  `expanse_reason` text NOT NULL,
  `expanse_status` int(20) NOT NULL,
  `expanse_ifdeleted` int(20) NOT NULL,
  `date` varchar(20) NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `online_payments`
--

CREATE TABLE `online_payments` (
  `id` int(100) NOT NULL,
  `user_id` int(50) NOT NULL,
  `user_mobile` varchar(20) NOT NULL,
  `sale_id` int(50) NOT NULL,
  `sale_due_amount` decimal(50,2) NOT NULL,
  `flatform_charges` decimal(20,2) NOT NULL,
  `grand_total` decimal(50,2) NOT NULL,
  `pl_id` varchar(50) NOT NULL,
  `pl_payment_id` varchar(50) NOT NULL,
  `pl_order_id` varchar(50) NOT NULL,
  `pl_signiture` varchar(50) NOT NULL,
  `pl_ref_id` varchar(50) NOT NULL,
  `pl_amount` decimal(50,2) NOT NULL,
  `pl_description` text NOT NULL,
  `pl_created` varchar(20) NOT NULL,
  `pl_short_url` varchar(50) NOT NULL,
  `pl_paid` decimal(20,2) NOT NULL,
  `pl_paid_date_time` varchar(20) NOT NULL,
  `pl_payment_status` varchar(10) NOT NULL,
  `pl_payment_method` varchar(50) NOT NULL,
  `payment_status` int(10) NOT NULL,
  `payment_ifdeleted` int(10) NOT NULL,
  `created` varchar(10) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sale_addons`
--

CREATE TABLE `sale_addons` (
  `id` int(100) NOT NULL,
  `sale_id` int(50) NOT NULL,
  `user_id` int(50) NOT NULL,
  `wastage_gm` decimal(50,0) NOT NULL,
  `making_amount` decimal(50,0) NOT NULL,
  `stones_amount` decimal(50,0) NOT NULL,
  `no_of_grams` varchar(50) NOT NULL,
  `melting` decimal(50,0) NOT NULL,
  `purity` decimal(50,0) NOT NULL,
  `sale_status` int(20) NOT NULL,
  `sale_ifdeleted` int(20) NOT NULL,
  `created` varchar(20) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sale_details`
--

CREATE TABLE `sale_details` (
  `id` int(100) NOT NULL,
  `sale_id` int(100) NOT NULL,
  `user_id` int(50) NOT NULL,
  `user_mobile` varchar(50) NOT NULL,
  `product_name` text NOT NULL,
  `one_gram_price` decimal(20,0) NOT NULL,
  `no_of_grams` varchar(50) NOT NULL,
  `total_grams_price` decimal(50,0) NOT NULL,
  `payment_method` varchar(20) NOT NULL,
  `sale_status` int(20) NOT NULL,
  `sale_ifdeleted` int(20) NOT NULL,
  `created` varchar(20) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sale_exchange`
--

CREATE TABLE `sale_exchange` (
  `id` int(100) NOT NULL,
  `sale_id` int(50) NOT NULL,
  `user_id` int(50) NOT NULL,
  `ex_product_name` varchar(100) NOT NULL,
  `ex_one_gm_rate` decimal(50,2) NOT NULL,
  `ex_purity` decimal(50,2) NOT NULL,
  `ex_netwt` decimal(50,2) NOT NULL,
  `melting` decimal(50,2) NOT NULL,
  `ex_gms_wt` decimal(50,2) NOT NULL,
  `ex_amount` decimal(50,2) NOT NULL,
  `sale_status` int(20) NOT NULL,
  `sale_ifdeleted` int(20) NOT NULL,
  `created` varchar(20) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sale_price_details`
--

CREATE TABLE `sale_price_details` (
  `id` int(100) NOT NULL,
  `sale_id` int(50) NOT NULL,
  `user_id` int(50) NOT NULL,
  `user_name` varchar(225) NOT NULL,
  `user_mobile` varchar(20) NOT NULL,
  `total_price` decimal(50,2) NOT NULL,
  `tax_at` decimal(20,2) NOT NULL,
  `tax_total` decimal(20,2) NOT NULL,
  `total_after_tax` decimal(50,2) NOT NULL,
  `extra_product_desc` varchar(50) NOT NULL,
  `extra_product_amount` decimal(50,2) NOT NULL,
  `discount_amount` decimal(20,2) NOT NULL,
  `payment_method` varchar(10) NOT NULL,
  `flatform_charges` decimal(20,2) NOT NULL,
  `ex_amount` decimal(50,2) NOT NULL,
  `paid_amount` decimal(50,2) NOT NULL,
  `grand_total` decimal(50,2) NOT NULL,
  `due_amount` decimal(50,2) NOT NULL,
  `sale_status` int(20) NOT NULL,
  `sale_ifdeleted` int(20) NOT NULL,
  `created` varchar(20) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sale_product_details`
--

CREATE TABLE `sale_product_details` (
  `id` int(150) NOT NULL,
  `sale_id` int(50) NOT NULL,
  `user_id` int(50) NOT NULL,
  `user_mobile` varchar(20) NOT NULL,
  `stock_id` varchar(50) NOT NULL,
  `product_name` varchar(25) NOT NULL,
  `one_gm_price` decimal(20,2) NOT NULL,
  `no_of_gms` decimal(50,2) NOT NULL,
  `wastage_gms` decimal(20,2) NOT NULL,
  `melting_at` decimal(50,4) NOT NULL,
  `purity_at` decimal(50,4) NOT NULL,
  `making_amount` decimal(25,2) NOT NULL,
  `stones_amount` decimal(20,2) NOT NULL,
  `total_amount` decimal(50,2) NOT NULL,
  `sale_status` int(10) NOT NULL,
  `sale_ifdeleted` int(10) NOT NULL,
  `created` varchar(20) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `stocks`
--

CREATE TABLE `stocks` (
  `id` int(150) NOT NULL,
  `stock_id` varchar(50) NOT NULL,
  `stock_name` varchar(50) NOT NULL,
  `stock_type` varchar(25) NOT NULL,
  `stock_quantity` decimal(50,2) NOT NULL,
  `stock_available` decimal(50,2) NOT NULL,
  `stock_price` decimal(50,2) NOT NULL,
  `stock_status` varchar(10) NOT NULL,
  `stock_ifdeleted` int(10) NOT NULL,
  `created` varchar(25) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tax_details`
--

CREATE TABLE `tax_details` (
  `id` int(50) NOT NULL,
  `tax_id` int(20) NOT NULL,
  `tax_name` varchar(20) NOT NULL,
  `tax_percentage` decimal(10,2) NOT NULL,
  `tax_status` int(10) NOT NULL,
  `tax_ifdeleted` int(10) NOT NULL,
  `created` varchar(20) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `txn_details`
--

CREATE TABLE `txn_details` (
  `id` int(100) NOT NULL,
  `txn_id` int(20) NOT NULL,
  `user_id` int(50) NOT NULL,
  `user_mobile` varchar(20) NOT NULL,
  `sale_id` int(50) NOT NULL,
  `order_total` decimal(50,2) NOT NULL,
  `txn_amount` decimal(50,2) NOT NULL,
  `order_due` decimal(50,2) NOT NULL,
  `txn_method` varchar(10) NOT NULL,
  `txn_status` int(10) NOT NULL,
  `txn_ifdeleted` int(10) NOT NULL,
  `date` varchar(20) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `workdata`
--

CREATE TABLE `workdata` (
  `id` int(100) NOT NULL,
  `workdata_id` int(50) NOT NULL,
  `workshop_id` int(50) NOT NULL,
  `forwared_wt` decimal(20,2) NOT NULL,
  `received_wt` decimal(20,2) NOT NULL,
  `workdata_status` int(10) NOT NULL,
  `workdata_ifdeleted` int(10) NOT NULL,
  `created` varchar(20) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `workshop`
--

CREATE TABLE `workshop` (
  `id` int(100) NOT NULL,
  `workshop_id` int(50) NOT NULL,
  `workshop_name` varchar(50) NOT NULL,
  `workshop_number` varchar(50) NOT NULL,
  `workshop_status` int(10) NOT NULL,
  `workshop_ifdeleted` int(10) NOT NULL,
  `created` varchar(20) NOT NULL,
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `expanses`
--
ALTER TABLE `expanses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `online_payments`
--
ALTER TABLE `online_payments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sale_addons`
--
ALTER TABLE `sale_addons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sale_details`
--
ALTER TABLE `sale_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sale_exchange`
--
ALTER TABLE `sale_exchange`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sale_price_details`
--
ALTER TABLE `sale_price_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sale_product_details`
--
ALTER TABLE `sale_product_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stocks`
--
ALTER TABLE `stocks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tax_details`
--
ALTER TABLE `tax_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `txn_details`
--
ALTER TABLE `txn_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `workdata`
--
ALTER TABLE `workdata`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `workshop`
--
ALTER TABLE `workshop`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `expanses`
--
ALTER TABLE `expanses`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `online_payments`
--
ALTER TABLE `online_payments`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `sale_addons`
--
ALTER TABLE `sale_addons`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=223;

--
-- AUTO_INCREMENT for table `sale_details`
--
ALTER TABLE `sale_details`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=232;

--
-- AUTO_INCREMENT for table `sale_exchange`
--
ALTER TABLE `sale_exchange`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=251;

--
-- AUTO_INCREMENT for table `sale_price_details`
--
ALTER TABLE `sale_price_details`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=249;

--
-- AUTO_INCREMENT for table `sale_product_details`
--
ALTER TABLE `sale_product_details`
  MODIFY `id` int(150) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `stocks`
--
ALTER TABLE `stocks`
  MODIFY `id` int(150) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `tax_details`
--
ALTER TABLE `tax_details`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `txn_details`
--
ALTER TABLE `txn_details`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=222;

--
-- AUTO_INCREMENT for table `workdata`
--
ALTER TABLE `workdata`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `workshop`
--
ALTER TABLE `workshop`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
