# VTTA.io Browser Extension

Part of the VTTA.io toolset to integrate D&D Beyond content with Foundry VTT.

## Usage

- Install modules `vtta-core` and `vtta-ddb` directly from GitHub
- Clone the repository, install it's dependencies
- Run `yarn run dev` to transpile the Chrome extension into the `/build` folder (it is running on Edge, too)
- Connect your account to the **STAGING** environment by visiting https://www.vtta.dev`s user profile instead of https://www.vtta.io.

## Compatibility

- Currently, Google Chrome and Microsoft Edge are supported browsers.
- Compatibility with Firefox is to be determined since switching to Google Manifest v3 for browser extensions, which could require more significant changes than just using the `browser.*` instead of using `chrome.*` context
