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

```
GET /_changes?since=%timestamp%
```

Get all the changes since the specified [monontonic-timestamp](https://github.com/dominictarr/monotonic-timestamp).  End once we have hit the last known change.

```
GET /_changes?live=true
```

Get all the changes since the beginning of time, but continue to listen once we are up to date.
