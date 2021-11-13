
echo $1 | sudo -S apt-get update -y
echo $1 | sudo -S apt-get install -y virtualbox-guest-x11
echo $1 | sudo -S VBoxClient --clipboard

echo $1 | sudo -S apt-get install -y curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

source ~/.bashrc
command -v nvm

nvm install --lts
