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

Get the latest version of a package that satisfies the supplied [simver range](https://github.com/DamonOehlman/simver-spec#ranges).

```
GET /name
```

Get the latest version of a named payload of JSON metadata from the registry.
