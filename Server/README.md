# Welcome to the Server side (we too have cookies)

## Specs

- The transmission format is JSON.
- API for object maniupulation

## Remote access
iansus.hd.free.fr:10080
iansus.hd.free.fr:10443
iansus.hd.free.fr:10022

## Random facts
- Server's female


# To be acknowledged
- An user deletion requires a password (401 to be fired) => A regler dans les droits (sur l'interface d'admin, a implementer)
- Need a way to get barmen/barkeepers list => va etre fait sous la forme "Recupere tous les non standard", ou ajout d'un attribut "elevated". Pourquoi ?
- Need a way to get stats' list	=> Pas compris ?
- Status 500 at user deletion, no 401 fired before => Regle. 
- How to add money when creating an user ? Could it be allright if a 'money' or 'balance' parameter was added to the post object with an amount to achieve customer initiation ?
