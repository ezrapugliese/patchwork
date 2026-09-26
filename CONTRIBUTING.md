# contributing to patchwork

thank you for wanting to help out with patchwork! this is a small, early project, so contributions of any size genuinely matter right now. this doc is a work in progress, like everything else here, so feel free to ask in the [discord](https://discord.gg/CbcWTsXAgP) if anything's unclear or you still have questions. thanks!

## what you can contribute

you don't need to write code to help! some ways to pitch in are:

- **code** - bug fixes, new features, refactors. see "what's needed right now" below for ideas. this section is always changing.
- **design** - icons (a lot of the sidebar icons are still placeholders), layout feedback, accessibility improvements.
- **bug reports** - if something breaks or looks wrong, open an issue.
- **feature suggestions** - have an idea for something a plural system would find useful? open an issue or bring it up in discord.
- **testing** - try the [dev build](https://pw-dev.vercel.app) and tell us what's confusing, broken, or missing.
- **feedback from lived experience** - patchwork is built by and for plural systems, so if something doesn't reflect how your system actually works, that feedback is valuable.

## what's needed right now
- the `pages/*.html` files (dashboard, system, alters, settings) are currently empty shells - these need actual content and functionality
- sidebar icons referenced in `index.html` don't exist yet
- a way to actually store alter/system data (currently everything is placeholder UI, nothing persists)
- accessibility passes on existing markup

check open issues on the [github repo](https://github.com/mantislegion/patchwork) for anything more current.

## how to contribute code

1. fork the repo
2. clone your fork
3. make your changes on a new branch
4. keep changes focused. one feature or fix per pull request is easier to review than one giant PR
5. test your changes by opening `index.html` in a browser
6. open a pull request against `main` with a description of what you changed and why

## reporting bugs
open an issue on [github](https://github.com/mantislegion/patchwork/issues) with:
- what you expected to happen
- what actually happened
- steps to reproduce, if you can
- browser/device, if relevant

## questions?
join the [discord](https://discord.gg/CbcWTsXAgP)! it's the fastest way to reach me and other contributors :)
