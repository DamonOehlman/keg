# keg

This is a simple registry that is used by
[nokku](https://github.com/DamonOehlman/nokku) to track local service
installations and versions.  Could be used to store any versioned data though.

__NOTE:__ Uses more restrictive [slimver](https://github.com/DamonOehlman/slimver-spec)
versioning over semver, so be aware of those limitations.


[![NPM](https://nodei.co/npm/keg.png)](https://nodei.co/npm/keg/)

[![unstable](https://img.shields.io/badge/stability-unstable-yellowgreen.svg)](https://github.com/dominictarr/stability#unstable) [![Build Status](https://img.shields.io/travis/DamonOehlman/keg.svg?branch=master)](https://travis-ci.org/DamonOehlman/keg) 

## Endpoints

```
PUT /name/version
```

Put a versioned, named payload of JSON metadata into the registry.

```
GET /name/version
```

Get a versioned, named payload of JSON metadata from the registry.

```
GET /name/range
```

Get the latest version of a package that satisfies the supplied [slimver range](https://github.com/DamonOehlman/slimver-spec#ranges).

```
GET /name
```

Get the latest version of a named payload of JSON metadata from the registry.

### Changes Feed

A [couchdb](http://couchdb.apache.org) like changes feed is provied at the `_changes` endpoint, with various options as outlined below:

```
GET /_changes
```

Get all the changes since the beginning of keg data. End once we have hit the last known change.

The following querystring options are supported:

  - `since=%timestamp%`

     get all the changes since the specified [monontonic-timestamp](https://github.com/dominictarr/monotonic-timestamp).

  - `includeDocs=true`

    get the docs in addition to the package and version information associated with a change


  - `live=true`

    once we hit the end continue to listen for new changes.


## Usage

To be completed.

## License(s)

### MIT

Copyright (c) 2014 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
