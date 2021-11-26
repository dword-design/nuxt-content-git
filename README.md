<!-- TITLE/ -->
# nuxt-content-git
<!-- /TITLE -->

<!-- BADGES/ -->
  <p>
    <a href="https://npmjs.org/package/nuxt-content-git">
      <img
        src="https://img.shields.io/npm/v/nuxt-content-git.svg"
        alt="npm version"
      >
    </a><img src="https://img.shields.io/badge/os-linux%20%7C%C2%A0macos%20%7C%C2%A0windows-blue" alt="Linux macOS Windows compatible"><a href="https://github.com/dword-design/nuxt-content-git/actions">
      <img
        src="https://github.com/dword-design/nuxt-content-git/workflows/build/badge.svg"
        alt="Build status"
      >
    </a><a href="https://codecov.io/gh/dword-design/nuxt-content-git">
      <img
        src="https://codecov.io/gh/dword-design/nuxt-content-git/branch/master/graph/badge.svg"
        alt="Coverage status"
      >
    </a><a href="https://david-dm.org/dword-design/nuxt-content-git">
      <img src="https://img.shields.io/david/dword-design/nuxt-content-git" alt="Dependency status">
    </a><img src="https://img.shields.io/badge/renovate-enabled-brightgreen" alt="Renovate enabled"><br/><a href="https://gitpod.io/#https://github.com/dword-design/nuxt-content-git">
      <img
        src="https://gitpod.io/button/open-in-gitpod.svg"
        alt="Open in Gitpod"
        width="114"
      >
    </a><a href="https://www.buymeacoffee.com/dword">
      <img
        src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg"
        alt="Buy Me a Coffee"
        width="114"
      >
    </a><a href="https://paypal.me/SebastianLandwehr">
      <img
        src="https://sebastianlandwehr.com/images/paypal.svg"
        alt="PayPal"
        width="163"
      >
    </a><a href="https://www.patreon.com/dworddesign">
      <img
        src="https://sebastianlandwehr.com/images/patreon.svg"
        alt="Patreon"
        width="163"
      >
    </a>
</p>
<!-- /BADGES -->

<!-- DESCRIPTION/ -->
Additional module for @nuxt/content that replaces or adds createdAt and updatedAt dates based on the Git history.
<!-- /DESCRIPTION -->

<!-- INSTALL/ -->
## Install

```bash
# npm
$ npm install nuxt-content-git

# Yarn
$ yarn add nuxt-content-git
```
<!-- /INSTALL -->

## Usage

Add the module to your `nuxt.config.js` file **before** `@nuxt/content`:

```js
export default {
  modules: [
    'nuxt-content-git',
    '@nuxt/content',
  },
}
```

This will replace `doc.createdAt` and `doc.updatedAt` with the dates from the Git log.

It is also possible to not override the values but instead specify the field names like this:

```js
export default {
  modules: [
    ['nuxt-content-git', {
      createdAtName: 'gitCreatedAt',
      updatedAtName: 'gitUpdatedAt',
    }],
    '@nuxt/content',
  ],
}
```

Then you can access them via `doc.gitCreatedAt` and `doc.gitUpdatedAt`.

## Deployment

The module uses the Git history to calculate the dates. That is why the history also needs to be checked out when deploying the project to live. During local development the repository is usually deeply cloned. But CI systems like GitHub Actions often only do a shallow clone for performance reasons, which will result in wrong dates.

To do a deep clone in a GitHub Actions workflow, configure the checkout step the following way:

```yaml
- uses: actions/checkout
  with:
    fetch-depth: 0
```

Keep in mind that when deploying to static site hosters like GitHub Pages, you also need to do a deep clone on the system where you are generating the site. So do a local regular clone when generating locally, or use the config above for GitHub actions.

<!-- LICENSE/ -->
## Contribute

Are you missing something or want to contribute? Feel free to file an [issue](https://github.com/dword-design/nuxt-content-git/issues) or a [pull request](https://github.com/dword-design/nuxt-content-git/pulls)! ⚙️

## Support

Hey, I am Sebastian Landwehr, a freelance web developer, and I love developing web apps and open source packages. If you want to support me so that I can keep packages up to date and build more helpful tools, you can donate here:

<p>
  <a href="https://www.buymeacoffee.com/dword">
    <img
      src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg"
      alt="Buy Me a Coffee"
      width="114"
    >
  </a>&nbsp;If you want to send me a one time donation. The coffee is pretty good 😊.<br/>
  <a href="https://paypal.me/SebastianLandwehr">
    <img
      src="https://sebastianlandwehr.com/images/paypal.svg"
      alt="PayPal"
      width="163"
    >
  </a>&nbsp;Also for one time donations if you like PayPal.<br/>
  <a href="https://www.patreon.com/dworddesign">
    <img
      src="https://sebastianlandwehr.com/images/patreon.svg"
      alt="Patreon"
      width="163"
    >
  </a>&nbsp;Here you can support me regularly, which is great so I can steadily work on projects.
</p>

Thanks a lot for your support! ❤️

## See also

* [nuxt-content-body-html](https://github.com/dword-design/nuxt-content-body-html): Embed a Mermaid diagram in a Nuxt.js app by providing its diagram string.
* [nuxt-mail](https://github.com/dword-design/nuxt-mail): Adds email sending capability to a Nuxt.js app. Adds a server route, an injected variable, and uses nodemailer to send emails.
* [nuxt-route-meta](https://github.com/dword-design/nuxt-route-meta): Adds Nuxt page data to route meta at build time.
* [nuxt-modernizr](https://github.com/dword-design/nuxt-modernizr): Adds a Modernizr build to your Nuxt.js app.
* [nuxt-mermaid-string](https://github.com/dword-design/nuxt-mermaid-string): Embed a Mermaid diagram in a Nuxt.js app by providing its diagram string.

## License

[MIT License](https://opensource.org/licenses/MIT) © [Sebastian Landwehr](https://sebastianlandwehr.com)
<!-- /LICENSE -->
