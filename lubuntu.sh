
echo $1 | sudo -S apt-get update -y
echo $1 | sudo -S apt-get install -y virtualbox-guest-x11
echo $1 | sudo -S VBoxClient --clipboard

echo $1 | sudo -S apt-get install -y curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

source ~/.bashrc
command -v nvm

export NVM_DIR="$HOME/.config/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

nvm install --lts
