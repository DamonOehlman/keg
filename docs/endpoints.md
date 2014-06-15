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
