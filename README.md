# capstone-project-3900-t16a-wearefromthesametutorial
# Online 2D Pirate Game Deployment Manual

## Deployment on virtual box lubuntu/ local linux instances

Note: Also Need to install virtualbox extension pack to allow copy paste of github token and command.

#### Unpack the project source code
> git clone https://github.com/unsw-cse-comp3900-9900-21T3/capstone-project-3900-t16a-wearefromthesametutorial.git

Or just unzip the project.zip folder

#### If on virtual machine, run the following to setup node.js
> chmod ug=rwx lubuntu.sh
> ./lubuntu.sh lubuntu

#### If on local debian linux or wsl:
Remove the first three lines from lubuntu.sh that setups host-machine copy paste and run lubuntu.sh.

#### Go to the project folder and start node:
> cd capstone-project-3900-t16a-wearefromthesametutorial
or
> cd project

> node server.js <port> <map>

#### Browser access from localhost:<port>
 > node server.js <port> <map>


### Command Line Arguments
When running the server without any additional arguments the port will default to 8080 and map defaults to big map
