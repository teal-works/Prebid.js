ARG VARIANT="20"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:${VARIANT}

# Install AWS CLI v2
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install \
    && rm -rf awscliv2.zip ./aws

# --------------------------------------------------------------------------------
# Install Yarn's key
# --------------------------------------------------------------------------------
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor > /usr/share/keyrings/yarn-archive-keyring.gpg

# --------------------------------------------------------------------------------
# Install Google Chrome and XVFB for Headless Testing (REVISED)
# This uses the modern method for adding GPG keys, avoiding the 'apt-key' error.
# --------------------------------------------------------------------------------

# 1. Download the Google signing key and save it securely in the keyrings directory.
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub \
    | gpg --dearmor -o /etc/apt/keyrings/google-chrome.gpg

# 2. Add the Chrome repository, referencing the securely stored key.
RUN echo "deb [signed-by=/etc/apt/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" \
    > /etc/apt/sources.list.d/google-chrome.list

# 3. Update package lists and install Chrome and XVFB (X Virtual Frame Buffer).
RUN apt update && apt install -y google-chrome-stable xvfb