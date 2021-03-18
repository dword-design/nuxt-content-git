<!-- TITLE/ -->
# nuxt-content-hooks-git
<!-- /TITLE -->

<!-- BADGES/ -->
  <p>
    <a href="https://npmjs.org/package/nuxt-content-hooks-git">
      <img
        src="https://img.shields.io/npm/v/nuxt-content-hooks-git.svg"
        alt="npm version"
      >
    </a><img src="https://img.shields.io/badge/os-linux%20%7C%C2%A0macos%20%7C%C2%A0windows-blue" alt="Linux macOS Windows compatible"><a href="https://github.com/dword-design/nuxt-content-git-hooks/actions">
      <img
        src="https://github.com/dword-design/nuxt-content-git-hooks/workflows/build/badge.svg"
        alt="Build status"
      >
    </a><a href="https://codecov.io/gh/dword-design/nuxt-content-git-hooks">
      <img
        src="https://codecov.io/gh/dword-design/nuxt-content-git-hooks/branch/master/graph/badge.svg"
        alt="Coverage status"
      >
    </a><a href="https://david-dm.org/dword-design/nuxt-content-git-hooks">
      <img src="https://img.shields.io/david/dword-design/nuxt-content-git-hooks" alt="Dependency status">
    </a><img src="https://img.shields.io/badge/renovate-enabled-brightgreen" alt="Renovate enabled"><br/><a href="https://gitpod.io/#https://github.com/dword-design/nuxt-content-git-hooks">
      <img src="https://gitpod.io/button/open-in-gitpod.svg" alt="Open in Gitpod">
    </a><a href="https://www.buymeacoffee.com/dword">
      <img
        src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg"
        alt="Buy Me a Coffee"
        height="32"
      >
    </a><a href="https://paypal.me/SebastianLandwehr">
      <img
        src="https://dword-design.de/images/paypal.svg"
        alt="PayPal"
        height="32"
      >
    </a><a href="https://www.patreon.com/dworddesign">
      <img
        src="https://dword-design.de/images/patreon.svg"
        alt="Patreon"
        height="32"
      >
    </a>
</p>
<!-- /BADGES -->

<!-- DESCRIPTION/ -->
nuxt-content hooks that replace or add createdAt and updatedAt dates based on the git history.
<!-- /DESCRIPTION -->

<!-- INSTALL/ -->
## Install

```bash
# npm
$ npm install nuxt-content-hooks-git

# Yarn
$ yarn add nuxt-content-hooks-git
```
<!-- /INSTALL -->

## Usage

Add the hooks to your hooks config:

```js
import nuxtContentHooksGit from 'nuxt-content-hooks-git'

export default {
  hooks: {
    ...
    ...nuxtContentHooksGit(),
  },
}
```

This will replace `doc.createdAt` and `doc.updatedAt` with the dates from the Git log.

It is also possible to not override the values but instead specify the field names like this:

```js
import nuxtContentHooksGit from 'nuxt-content-hooks-git'

export default {
  hooks: {
    ...
    ...nuxtContentHooksGit({ createdAtName: 'gitCreatedAt', updatedAtName: 'gitUpdatedAt' }),
  },
}
```

Then you can access them via `doc.gitCreatedAt` and `doc.gitUpdatedAt`.

<!-- LICENSE/ -->
## Contributing

Are you missing something or want to contribute? Feel free to file an [issue](https://github.com/dword-design/nuxt-content-git-hooks/issues) or [pull request](https://github.com/dword-design/nuxt-content-git-hooks/pulls)! ⚙️

## Support Me

Hey, I am Sebastian Landwehr, a freelance web developer, and I love developing web apps and open source packages. If you want to support me so that I can keep packages up to date and build more helpful tools, you can donate here:

<p>
  <a href="https://www.buymeacoffee.com/dword">
    <img
      src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg"
      alt="Buy Me a Coffee"
      height="32"
    >
  </a>&nbsp;If you want to send me a one time donation. The coffee is pretty good 😊.<br/>
  <a href="https://paypal.me/SebastianLandwehr">
    <img
      src="https://dword-design.de/images/paypal.svg"
      alt="PayPal"
      height="32"
    >
  </a>&nbsp;Also for one time donations if you like PayPal.<br/>
  <a href="https://www.patreon.com/dworddesign">
    <img
      src="https://dword-design.de/images/patreon.svg"
      alt="Patreon"
      height="32"
    >
  </a>&nbsp;Here you can support me regularly, which is great so I can steadily work on projects.
</p>

Thanks a lot for your support! ❤️

## License

[MIT License](https://opensource.org/licenses/MIT) © [Sebastian Landwehr](https://dword-design.de)
<!-- /LICENSE -->
