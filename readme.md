# VTTA.io Browser Extension

Part of the VTTA.io toolset to integrate D&D Beyond content with Foundry VTT.

## Usage

- Install modules [vtta-core](https://www.github.com/vttassets/vtta-core) and [vtta-ddb](https://www.github.com/vttassets/vtta-ddb) directly from GitHub
- Clone this repository, install it's dependencies with `yarn install`
- Run `yarn run dev` to transpile the Chrome extension into the `/build` folder (it is running on Edge, too)
- Load the extension as an unpacked extension from the `/build` folder

## Parser environments

During development, you should change your parsing environment from vtta.io to vtta.dev:

- vtta.io: Production environment, once everything is tested thoroughly the changes will be published on the production kubernetes cluster running under the domain vtta.io
- vtta.dev: Staging environment. Unstable, testing fixes in an environment very close to the production environment, but is completely seperate: Kubernetes cluster and MongoDB are seperate, and the database contents might be different from the production content

### How to switch environments

The account connection from your VTTA user profile determines the used parser environment:

- **PRODUCTION**: Go to vtta.io and visit your user profile
- **STAGING**: Go to vtta.dev and visit your user profile

## Compatibility

- Currently, Google Chrome and Microsoft Edge are supported browsers.
- Compatibility with Firefox is to be determined since switching to Google Manifest v3 for browser extensions, which could require more significant changes than just using the `browser.*` instead of using `chrome.*` context
