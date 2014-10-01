### Customer:
- firstname
- nickname (must be unique)
- lastname
- status (one of [Customer, VIP, Barman, Barchief])
- password (not to be sent, but to be received)
- money
- email
- history :
  	  - drink (concat of brand + type ?)
	  - time (since epoch, in millis)

### Drink:
- brand (eg 'Hoegarden')
- type (eg 'Grand Cru')(field to be renamed ?)
- price

### User:
- name (must be exactly similar to one nickname)
- history :
  	  - amount
	  - customer (concat of first + nick + last ?)
	  - time (since epoch, in millis)
	  
	  
# Policy
- VIP now authorized only to a 50-euros deficit

