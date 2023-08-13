# csv-cli
A CLI wrapper around the node [csv][1] package

# Usage

```shell
$ npm install -g csv-cli

$ csv --help

$ csv convert --help
$ csv convert -t json [file.csv] [file.json]
$ csv convert -t csv [file.json] [file.csv]
```

## Conversions

Currently only supports converting from CSV <--> JSON

When converting to JSON, the CSV header values are used as the keys of the object.

When converting to CSV, the keys are used as the header values.

[1]: https://csv.js.org/
