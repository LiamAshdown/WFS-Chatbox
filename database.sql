-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.10-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for chat_box
CREATE DATABASE IF NOT EXISTS `chat_box` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `chat_box`;

-- Dumping structure for table chat_box.messages
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int(10) unsigned DEFAULT NULL,
  `username` varchar(30) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `date_sent` datetime DEFAULT NULL,
  KEY `FK__users` (`id`),
  CONSTRAINT `FK__users` FOREIGN KEY (`id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table chat_box.messages: ~2 rows (approximately)
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` (`id`, `username`, `message`, `date_sent`) VALUES
	(9, 'Jerry', 'dasda', '2019-12-04 17:05:10');
INSERT INTO `messages` (`id`, `username`, `message`, `date_sent`) VALUES
	(8, 'Quadral', 'wtf', '2019-12-04 17:12:54');
INSERT INTO `messages` (`id`, `username`, `message`, `date_sent`) VALUES
	(8, 'Quadral', 'wtf', '2019-12-04 17:12:54');
INSERT INTO `messages` (`id`, `username`, `message`, `date_sent`) VALUES
	(9, 'Jerry', 'Yep', '2019-12-04 17:17:42');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;

-- Dumping structure for table chat_box.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(30) DEFAULT NULL,
  `password` varchar(40) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `date_joined` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

-- Dumping data for table chat_box.users: ~2 rows (approximately)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `username`, `password`, `session_id`, `last_login`, `date_joined`) VALUES
	(8, 'Quadral', 'bb779c877cc09717cc5b1bc6d711b949c8509d26', '59g8er33dtvltf6dtvvgdkhgca', '2019-12-04 16:22:44', '2019-12-04 16:22:44');
INSERT INTO `users` (`id`, `username`, `password`, `session_id`, `last_login`, `date_joined`) VALUES
	(9, 'Jerry', '69f0033bd4a2a4ed1b8b1293bd5832f010670e71', 'tposmq2mj19q3hsg81lf26lj9l', '2019-12-04 16:56:08', '2019-12-04 16:56:08');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

-- Dumping structure for table chat_box.user_list
CREATE TABLE IF NOT EXISTS `user_list` (
  `id` int(10) unsigned NOT NULL,
  `username` varchar(30) NOT NULL,
  KEY `FK_user_list_users` (`id`),
  CONSTRAINT `FK_user_list_users` FOREIGN KEY (`id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table chat_box.user_list: ~22 rows (approximately)
/*!40000 ALTER TABLE `user_list` DISABLE KEYS */;
INSERT INTO `user_list` (`id`, `username`) VALUES
	(8, 'Quadral');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(8, 'Quadral');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(9, 'Jerry');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(8, 'Quadral');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(9, 'Jerry');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(9, 'Jerry');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(9, 'Jerry');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(9, 'Jerry');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(9, 'Jerry');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(9, 'Jerry');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(9, 'Jerry');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(9, 'Jerry');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(9, 'Jerry');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(9, 'Jerry');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(9, 'Jerry');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(9, 'Jerry');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(9, 'Jerry');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(9, 'Jerry');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(9, 'Jerry');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(9, 'Jerry');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(8, 'Quadral');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(8, 'Quadral');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(8, 'Quadral');
INSERT INTO `user_list` (`id`, `username`) VALUES
	(8, 'Quadral');
/*!40000 ALTER TABLE `user_list` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
