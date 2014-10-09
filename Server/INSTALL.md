# Server Requirements & step by step installation

## Environment

### Web server

In order to run the Server, you need to install the following packages:

- apache2
- php5
- php5-cli (for action & rights update)
- libapache2-mod-php5
- mysql-server
- php5-mysql

On Ubuntu/Debian, you should run the following command (with root rights):

	apt-get install apache2 php5 php5-cli libapache2-mod-php5 mysql-server php5-mysql

Your pages will be located in the _/var/www_ directory and available trough http://127.0.0.1/

### Files & Directories permissions

If you use standard development technics, you might have multiple users writing code.
The web Server will use a different user (service account _www-data_) to run. This user requires __at least__ read rights on files, and read + execution rights on directories and shell scripts.

Therefore, you should use the _www-data_ group as a development group, while having each user as owner of his files. Finally, use the suid group bit so that the group owner is superseded by the parent directory group owner.

In the event you have user1 and user2 in the dev team:

	adduser user1 www-data
	adduser user2 www-data
	find /var/www -exec chown www-data:www-data {} \;
	find /var/www -type f -exec chmod 664 {} \;
	find /var/www -type d -exec chmod 775 {} \;
	find /var/www -type d -exec chmod g+s {} \;

### DataBase Management System (DBMS)

For improved convenience, you should use a DBMS to manage the databases, their structure and data.
We __strongly__ recommend you use PhpMyAdmin: http://sourceforge.net/projects/phpmyadmin/files/latest/download?source=files

Then, unzip the previously downloaded archive in the _/var/www/_ directory:

	mv phpMyAdmin*.zip /var/www
	cd /var/www
	unzip phpMyAdmin*.zip
	rm phpMyAdmin*.zip
	mv phpMyAdmin* phpmyadmin

PhpMyAdmin is now available at http://127.0.0.1/phpmyadmin/ (use the root password configured during mysql installation to log in).

## Server deployment

### Scripts

Just copy the Server/ directory to your _/var/www_ directory.

### Database

You also need to import the SQL file that will create your database structure.
Finally run the _update_actions.php in a console.
