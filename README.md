# Dependency Tracker

This is a small console tool for visually comparing `package.json` dependencies across projects.

## Setup

You will need to create a `config.js`. There exists a [`config.js.example`](config.js.example) from which you can derive your configuration file.

You will also need a Github token if you intend to use this against private
repos to which you have access.

You may also configure a `whitelist` array to check against.

- Regular expressions check as a `test`
- Strings check equality

## Output

This just uses `console.table`.

Here's an example.

```
┌────────────────────────┬──────────────────────────────────┬───────────────────────────┐
│        (index)         │      anonymous/ anonymous        │ second one /  second one  │
├────────────────────────┼──────────────────────────────────┼───────────────────────────┤
│         jquery         │               '~1'               │           '~1'            │
│  jquery-mobile-events  │             '~1.4.0'             │                           │
│     jquery.cookie      │             '^1.4.1'             │         '^1.4.1'          │
│         react          │            '^16.8.6'             │         '^15.6.2'         │
│      react-addons      │                                  │    '^0.9.1-deprecated'    │
│  react-addons-update   │                                  │         '^15.6.2'         │
│  react-debounce-input  │             '^3.2.0'             │                           │
│       react-dom        │            '^16.8.5'             │         '^15.6.2'         │
│      react-quill       │             '^1.3.3'             │                           │
│      react-redux       │             '^5.1.1'             │         '^5.0.7'          │
│      react-select      │             '^2.4.1'             │                           │
│   react-select-plus    │             '^1.1.0'             │                           │
│   react-sortable-hoc   │             '^0.6.8'             │                           │
│      react-sticky      │             '^6.0.3'             │                           │
│ react-transition-group │             '^1.1.2'             │                           │
│     react-truncate     │             '^2.4.0'             │                           │
└────────────────────────┴──────────────────────────────────┴───────────────────────────┘
```
