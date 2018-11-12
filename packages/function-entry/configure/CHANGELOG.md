# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="2.0.0"></a>
# 2.0.0 (2018-09-20)


### Bug Fixes

* build fixes ([3c3a7f2](https://github.com/pie-framework/pie-elements/commit/3c3a7f2))
* bump config-ui@^7.6.6 ([266235a](https://github.com/pie-framework/pie-elements/commit/266235a))


### Features

* **dependencies:** use latest dependencies ([5220ea2](https://github.com/pie-framework/pie-elements/commit/5220ea2))
* **dependencies:** use latest of [@pie-ui](https://github.com/pie-ui)/* ([ac9d2e5](https://github.com/pie-framework/pie-elements/commit/ac9d2e5))
* **function-entry:** add mathjs to function entry ([25ab268](https://github.com/pie-framework/pie-elements/commit/25ab268))
* **function-entry:** added function entry ([5523192](https://github.com/pie-framework/pie-elements/commit/5523192))
* **function-entry:** added hints popover ([3a6cfd3](https://github.com/pie-framework/pie-elements/commit/3a6cfd3))
* **function-entry:** finalized function-entry component ([6911a86](https://github.com/pie-framework/pie-elements/commit/6911a86))
* **function-entry:** getting ready for publish, final version ([972518a](https://github.com/pie-framework/pie-elements/commit/972518a))
* **function-entry:** hints popover fixes and adjustments ([8926f7b](https://github.com/pie-framework/pie-elements/commit/8926f7b))
* **model:** move away from legacy model, use latest feedback model. ([317a9c3](https://github.com/pie-framework/pie-elements/commit/317a9c3))
* upgrade material-ui -> [@material-ui](https://github.com/material-ui)/core@1.0.0-rc.1 ([12b45c7](https://github.com/pie-framework/pie-elements/commit/12b45c7))


### BREAKING CHANGES

* **model:** The model has moved from this:

```javascript
    {
      id: '1',
      element: 'function-entry',
      weight: 1,
      incorrectFeedback: {
        type: 'default',
      },
      correctResponse: {
        equation: '3x+2',
        feedback: {
          type: 'default',
        },
      },
      model: {
        showFormattingHelp: true
      }
    }

```

To this:

```javascript
    {
      id: '1',
      element: 'function-entry',
      weight: 1,
      showFormattingHelp: true,
      equation: '3x+2',
      feedback: {
        correct: {
          type: 'default',
          default: 'Correct'
        },
        incorrect: {
          type: 'default',
          default: 'Incorrect'
        }
      }
    }

```