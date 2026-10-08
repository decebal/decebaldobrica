# @decebal/products

Shared product catalog for decebaldobrica.com and wolventech.com.

## catalog.json

`catalog.json` is generated from the `catalog` blocks in
[`wolven-tech/portfolio-control-room`](https://github.com/wolven-tech/portfolio-control-room)
`config/portfolio.json`. Never edit it by hand: change the config, then regenerate.

The control room resolves a relative path against its own directory, so pass an
absolute one. From the monorepo root:

```bash
cargo run --manifest-path ../../founder-mode/portfolio-control-room/Cargo.toml -- catalog "$PWD/packages/products/catalog.json"
cargo run --manifest-path ../../founder-mode/portfolio-control-room/Cargo.toml -- catalog-check "$PWD/packages/products/catalog.json"
```

`catalog-check` fails when this file differs from what the config generates.

## Art

`ProductScene` crops one cell from `/images/products/scenes-20261008.webp`, a
4×4 atlas served by both apps. A product's `art.cell` is its index in that grid,
row by row.
