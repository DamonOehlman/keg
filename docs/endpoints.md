```
PUT /:store/:name/:version
```

Put a versioned, named payload of JSON metadata into the registry.

```
GET /:store/:name/:version
```

Get a versioned, named payload of JSON metadata from the `:store` registry.

```
GET /:store/:name/:range
```

Get the latest version of a package that satisfies the supplied [slimver range](https://github.com/DamonOehlman/slimver-spec#ranges).

```
GET /:store/name
```

Get the latest version of a named payload of JSON metadata from the registry.

### Changes Feed

A [couchdb](http://couchdb.apache.org) like changes feed is provied at the `_changes` endpoint, with various options as outlined below:

```
GET /:store/_changes
```

Get all the changes since the beginning of keg data. End once we have hit the last known change.

The following querystring options are supported:

  - `since=%timestamp%`

     get all the changes since the specified [monontonic-timestamp](https://github.com/dominictarr/monotonic-timestamp).

  - `includeDocs=true`

    get the docs in addition to the package and version information associated with a change


  - `live=true`

    once we hit the end continue to listen for new changes.
